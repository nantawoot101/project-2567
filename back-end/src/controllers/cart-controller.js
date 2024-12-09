const db = require("../models/db");

exports.addToCart = async (req, res, next) => {
    try {
        const userId = req.user.id; // ดึงรหัสผู้ใช้จาก req.user.id
        const bookId = parseInt(req.params.id); // แก้ไขเพื่อดึง bookId จาก params
        const cart_quantity = parseInt(req.body.cart_quantity); // แก้ไขเพื่อดึงปริมาณออกจากเนื้อหา
        
        // ตรวจสอบว่า bookId เป็นตัวเลขหรือไม่
        if (isNaN(bookId)) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        // ตรวจสอบว่ามีหนังสืออยู่ในรถเข็นแล้วหรือไม่
        const existingCartItem = await db.cart.findFirst({
            where: {
                userId: userId,
                bookId: bookId
            }
        });

        if (existingCartItem) {
            
            // หากมีหนังสืออยู่ให้อัพเดตจำนวน
            await db.cart.update({
                where: {
                    id: existingCartItem.id
                },
                data: {
                    cart_quantity: existingCartItem.cart_quantity + cart_quantity
                }
            });

            // ดึงรายการสินค้าในรถเข็นที่อัปเดต
            const updatedCartItem = await db.cart.findUnique({
                where: {
                    id: existingCartItem.id
                }
            });

            res.status(200).json(updatedCartItem);
        } else {
            // หากไม่มีหนังสือ ให้สร้างรายการในรถเข็นใหม่
            const cart = await db.cart.create({
                data: {
                    userId: userId,
                    bookId: bookId, 
                    cart_quantity: cart_quantity 
                }
            });

            res.status(201).json(cart);
        }
    } catch (error) {
        next(error);
    }
}

exports.getCart = async (req, res, next) => {
    try {
        const userId = req.user.id; // ดึงค่า userId จาก req.user.id
        const cart = await db.cart.findMany({
            where: {
                userId: userId
            },
            include: {
                book: true
            }
        });
        
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
}

exports.updateCart = async (req, res, next) => {
    try {
        const cart = await db.cart.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                cart_quantity: parseInt(req.body.cart_quantity)
            }
        });
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
}

exports.deleteCart = async (req, res, next) => {
    try {
        const cart = await db.cart.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
}


exports.getCartById = async (req, res, next) => {
    try {
        const userId = req.user.id; // ดึงค่า userId จาก req.user.id
        const cartId = parseInt(req.params.id); // แปลงค่า Id ของตะกร้าเป็นตัวเลข

        // ตรวจสอบว่า cartId เป็นตัวเลขหรือไม่
        if (isNaN(cartId)) {
            return res.status(400).json({ error: "Invalid cart ID" });
        }

        // ค้นหารายการในตะกร้า (cart) โดยใช้ Id ที่ระบุ
        const cartItem = await db.cart.findUnique({
            where: {
                id: cartId,
                userId: userId
            },
            include: {
                book: true
            }
        });

        // ตรวจสอบว่ามีรายการในตะกร้าหรือไม่
        if (!cartItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }

        // ส่งข้อมูลรายการในตะกร้ากลับไปยังผู้ใช้งานที่เรียก API นี้
        res.status(200).json(cartItem);
    } catch (error) {
        next(error);
    }
}
