const db = require("../models/db");

exports.getAllShippingAddress = async (req, res, next) => {
  try {
    const shippingAddress  = await db.shippingAddress.findMany();
    res.json(shippingAddress);
  } catch (err) {
    next(err);
  }
};



exports.createShippingAddress = async (req, res, next) => {
  const { recipient_fname, recipient_lname, shipping_address, district, prefecture, province,zip_code,phone } = req.body;
  const userId = req.user.id ;
  try {
      if (!(recipient_fname && recipient_lname && shipping_address && district && prefecture && province && zip_code && phone)) {
          return res.status(404).json({ error: 'Please provide all required book information' });
      }

      const data = {
        recipient_fname,
        recipient_lname,
        shipping_address,
        district,
        prefecture,
        province,
        zip_code,
        phone,
        userId: userId,
      };

      
      const rsb = await db.shippingAddress.create({data});
      console.log(rsb);

      res.json({ msg: 'เพิ่มสินค้าสำเร็จ' ,data: rsb});
  } catch (err) {
      next(err);
  }
}


  // ลบข้อมูล ShippingInformation โดย ID
  exports.deleteShipping = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedShipping = await db.shippingAddress.delete({
        where: {
          id: parseInt(id)
        }
      });
  
      if (!deletedShipping) {
        return res.status(404).json({ error: 'Shipping address not found' });
      }
  
      return res.json({ msg: 'ลบที่อยู่จัดส่งสำเร็จ' });
    } catch (err) {
      next(err);
    }
  };
  

// แสดงข้อมูล ShippingInformation โดย ID
exports.getShippingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่า id เป็น integer
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // ค้นหา shipping address โดยใช้ id
    const shippingAddress = await db.shippingAddress.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!shippingAddress) {
      return res.status(404).json({ error: "Shipping address not found" });
    }

    // ส่ง response shipping address
    res.json(shippingAddress);
  } catch (err) {
    next(err);
  }
};


exports.getAllShipAddressByUserId = async (req, res, next) => {
  try {
    // ดึง userId จาก query parameter
    const userId = req.user.id; 

    // ค้นหาข้อมูลที่อยู่จัดส่งของผู้ใช้โดยใช้ userId
    const shippingAddresses = await db.shippingAddress.findMany({
      where: {
        userId,
      },
    });

    // ส่งข้อมูลที่อยู่จัดส่งกลับไปยังผู้ใช้
    res.json(shippingAddresses);
  } catch (error) {
    next(error);
  }
};


exports.updateShipping = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { recipient_fname, recipient_lname, shipping_address, district, prefecture, province, zip_code, phone } = req.body;

    // ตรวจสอบว่ามีข้อมูลที่จะอัปเดตหรือไม่
    if (!(recipient_fname && recipient_lname && shipping_address && district && prefecture && province && zip_code && phone)) {
      return res.status(400).json({ error: 'Please provide all required shipping address information' });
    }

    // อัปเดตข้อมูลที่อยู่จัดส่ง
    const updatedShipping = await db.shippingAddress.update({
      where: { id: parseInt(id) },
      data: {
        recipient_fname,
        recipient_lname,
        shipping_address,
        district,
        prefecture,
        province,
        zip_code,
        phone,
      },
    });

    // ตรวจสอบว่าข้อมูลถูกอัปเดตหรือไม่
    if (!updatedShipping) {
      return res.status(404).json({ error: 'Shipping address not found' });
    }

    // ส่งข้อมูลที่อยู่จัดส่งที่ถูกอัปเดตกลับไปยังผู้ใช้
    res.json({ msg: 'อัปเดตที่อยู่จัดส่งสำเร็จ', data: updatedShipping });
  } catch (error) {
    next(error);
  }
};

