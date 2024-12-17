const bcrypt = require('bcrypt');
const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

exports.getAllAdmin = async (req, res, next) => {
    try {
        const admins = await db.admin.findMany();
        res.json(admins);
    } catch (err) {
        next(err);
    }
};


    exports.getAdminById = async (req, res, next) => {
        const { admin_id } = req.params;

    try {
    // Make sure admin_id is an integer before using it in Prisma
    const admin = await db.admin.findUnique({
        where: {
        admin_id: parseInt(admin_id)  // Convert to Int if necessary
        }
    });

    if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
    };


exports.register = async (req, res, next) => {
    const { admin_title, admin_name, admin_lastn, username, password } = req.body;

    try {
        if (!(admin_title && admin_name && admin_lastn && username && password)) {
            return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }


        const data = {
            admin_title,
            admin_name,
            admin_lastn,
            username,
            password,
        };

        const rs = await db.admin.create({ data });
        console.log(rs);

        res.status(201).json({ msg: 'ลงทะเบียนสำเร็จ' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
    }
};


exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        if (!(username && password)) {
            return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }

        const admin = await db.admin.findFirst({
            where: { username: username },
        });

        if (!admin) {
            return res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }

        // เปลี่ยนจาก bcrypt มาเป็นการเปรียบเทียบธรรมดา
        if (password !== admin.password) {
            return res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }

        res.json({
            msg: 'เข้าสู่ระบบสำเร็จ',
            admin_id: admin.admin_id,
            admin_title: admin.admin_title,
            admin_name: admin.admin_name,
            admin_lastn: admin.admin_lastn,
            username: admin.username,
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
    }
};

exports.changePassword = async (req, res, next) => {
    const { admin_id, password } = req.body; // รวม member_id ด้วยเพื่อระบุสมาชิกที่ต้องการเปลี่ยนรหัสผ่าน

    try {
        // ตรวจสอบว่ามี member_id และ password_id ถูกส่งมา
        if (!admin_id || !password) {
            return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
        }

        // แปลง member_id เป็นจำนวนเต็ม
        const adminId = parseInt(admin_id, 10);
        
        // ตรวจสอบว่าการแปลงเป็นจำนวนเต็มสำเร็จหรือไม่
        if (isNaN(adminId)) {
            return res.status(400).json({ error: 'adminId ต้องเป็นจำนวนเต็ม' });
        }

        // อัปเดตรหัสผ่านใหม่ในฐานข้อมูล
        await db.admin.update({
            where: { admin_id: adminId }, // ใช้ memberIdInt แทน
            data: { password: password}, // อัปเดต password_id
        });

        res.json({ msg: 'เปลี่ยนรหัสผ่านสำเร็จ' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' });
    }
};


exports.updateProfile = async (req, res, next) => {
    const { admin_id, username, password, admin_title, admin_name, admin_lastn } = req.body;

    try {
        if (!admin_id) {
            return res.status(400).json({ error: "กรุณาใส่ admin_id" });
        }

        // ตรวจสอบว่าผู้ดูแลระบบที่มี admin_id นี้มีอยู่ในระบบหรือไม่
        const admin = await db.admin.findUnique({
            where: { admin_id: admin_id }, // ใช้ admin_id แทน username
        });

        if (!admin) {
            return res.status(404).json({ error: "ไม่พบผู้ดูแลระบบ" });
        }

        const updateData = {
            admin_title,
            admin_name,
            admin_lastn,
        };

        if (password) {
            updateData.password = password; // hash รหัสผ่านใหม่ถ้ามีการแก้ไข
        }

        // อัพเดตโปรไฟล์โดยอ้างอิง admin_id
        const updatedAdmin = await db.admin.update({
            where: { admin_id: admin_id },
            data: updateData,
        });

        res.json({ msg: 'อัปเดตข้อมูลโปรไฟล์สำเร็จ', updatedAdmin });
    } catch (err) {
        console.error('Error during profile update:', err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลโปรไฟล์' });
    }
};

