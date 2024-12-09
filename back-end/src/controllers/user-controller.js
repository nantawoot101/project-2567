const db = require("../models/db");
const bcrypt = require("bcryptjs");


exports.getUsers = async (req, res, next) => {
    try {
        const users = await db.user.findMany();
        res.json(users);
    } catch (err) {
        next(err);
    }
};


exports.getUserById = async (req, res, next) => {
  try {
    
    const { id } = req.params;

    // ตรวจสอบว่า id เป็น integer
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // ค้นหา user โดยใช้ id
    const user = await db.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    // ตรวจสอบว่า user ไม่ null
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ส่ง response user
    res.json(user);
  } catch (err) {
    next(err);
  }
};


const SALT_ROUNDS = 10;
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    // ตรวจสอบว่า id เป็น integer
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    let updateData = {};

    if (req.body.firstname) {
      updateData.firstname = req.body.firstname;
    }
    if (req.body.lastname) {
      updateData.lastname = req.body.lastname;
    }
    if (req.body.username) {
      updateData.username = req.body.username;
    }

    // ตรวจสอบและแปลงรหัสผ่านก่อนการอัปเดต
    if (req.body.password) {
      // ทำการ hash รหัสผ่านใหม่
      const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
      // กำหนดรหัสผ่านที่แปลงแล้วให้เป็นค่า updateData.password
      updateData.password = hashedPassword;
    }

    if (req.body.phone) {
      updateData.phone = req.body.phone;
    }
    if (req.body.email) {
      updateData.email = req.body.email;
    }
    if (req.body.address) {
      updateData.address = req.body.address;
    }
    if (req.body.gender) {
      updateData.gender = req.body.gender;
    }

    // อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล
    const user = await db.user.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    // ตรวจสอบว่าพบผู้ใช้หรือไม่
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ส่งข้อมูลผู้ใช้ที่อัปเดตแล้วกลับไปยังผู้ใช้
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};


// ลบข้อมูลผู้ใช้
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params; // รับค่า ID ผู้ใช้ที่ต้องการลบ
    // ค้นหาผู้ใช้โดยใช้ ID
    const deletedUser = await db.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    // ถ้าไม่มีผู้ใช้ที่ต้องการลบ
    if (!deletedUser) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    res.json({ message: "ลบผู้ใช้เรียบร้อยแล้ว" });
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล" });
  }
};