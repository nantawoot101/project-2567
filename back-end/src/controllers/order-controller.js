const db = require("../models/db");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/payment')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage }).single('payment_img');
// Create a new order
exports.createOrder = async (req, res, next) => {
    
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

    try {
        
        const { total_amount, status, payment_method, amount } = req.body;
        const payment_img = req.file; // เก็บชื่อไฟล์รูปภาพหากมีการอัปโหลด
        const cartId = parseInt(req.body.cartId);
        const shippingAddressId = parseInt(req.body.shippingAddressId);
        const userId = req.user.id; 

        const data = {
            total_amount: parseInt(total_amount),
            status: "Pending" ,
            payment_method: payment_method,
            amount: parseInt(amount),
            payment_img: payment_img,
            user: { connect: { id: userId } },
            cart: { connect: { id: cartId } },
            shippingAddress: { connect: { id: shippingAddressId } }
            }
           const order = await db.order.create({data});

        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
});
}



// Get an order by ID
exports.getOrderById = async (req, res, next) => {
    try {
        const orderId = parseInt(req.params.id);

        const order = await db.order.findUnique({
            where: {
                id: orderId
            }
        });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res, next) => {
    try {
        const orderId = parseInt(req.params.id);

        const deletedOrder = await db.order.delete({
            where: {
                id: orderId
            }
        });

        if (!deletedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        next(error);
    }
};

exports.getAllOrder = async (req, res, next) => {
    try {
      const order = await db.order.findMany();
      res.json(order);
    } catch (err) {
      next(err);
    }
  };