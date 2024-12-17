const bcrypt = require('bcrypt');
const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // นำเข้า file system module สำหรับจัดการไฟล์

// ดึงข้อมูลสมาชิกทั้งหมด
exports.getAllMember = async (req, res, next) => {
    try {
        const members = await db.member.findMany();
        res.json(members);
    } catch (err) {
        next(err);
    }
};

// ดึงข้อมูลสมาชิกตาม member_id
exports.getMemberById = async (req, res, next) => {
    const { member_id } = req.params;

    try {
        const numericMemberId = parseInt(member_id, 10);
        if (isNaN(numericMemberId)) {
            return res.status(400).json({ error: 'ID ของสมาชิกไม่ถูกต้อง' });
        }

        const member = await db.member.findUnique({
            where: { member_id: numericMemberId },
        });

        if (!member) {
            return res.status(404).json({ error: "ไม่พบสมาชิก" });
        }

        res.json(member);
    } catch (err) {
        next(err);
    }
};

// ฟังก์ชันการลงทะเบียน
// ฟังก์ชันลงทะเบียน
exports.register = async (req, res, next) => {
    const { role_id, username_id, password_id, phone_number, Id_student, member_title, member_name, member_lastname, member_email, faculity, branch, status } = req.body;

    try {
        // ตรวจสอบว่ากรอกข้อมูลครบถ้วน (ยกเว้น Id_student)
        if (!(role_id && username_id && password_id && phone_number && member_title && member_name && member_lastname && member_email && faculity && branch && status)) {
            return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }

        // ตรวจสอบรูปแบบอีเมล
        if (!/\S+@\S+\.\S+/.test(member_email)) {
            return res.status(400).json({ error: "รูปแบบอีเมลไม่ถูกต้อง" });
        }

        // ตรวจสอบว่าชื่อผู้ใช้ซ้ำหรือไม่
        const existingUser = await db.member.findUnique({
            where: { username_id }
        });

        if (existingUser) {
            return res.status(409).json({ error: "ชื่อผู้ใช้นี้มีอยู่แล้ว" }); // 409 Conflict error
        }

        // ตรวจสอบว่าอีเมลซ้ำหรือไม่
        // ตรวจสอบว่าอีเมลซ้ำหรือไม่
const existingEmail = await db.member.findFirst({
    where: { member_email }
});

if (existingEmail) {
    return res.status(409).json({ error: "อีเมลนี้มีอยู่แล้ว" }); // 409 Conflict error
}

        // เตรียมข้อมูลสำหรับบันทึก
        const data = {
            role_id: parseInt(role_id),
            username_id,
            password_id,
            phone_number,
            member_title,
            member_name,
            member_lastname,
            member_email,
            faculity,
            branch,
            status: "1", // ค่าเริ่มต้น status
        };

        // รวม Id_student หากมีข้อมูล
        if (Id_student) {
            data.Id_student = Id_student;
        }

        // บันทึกข้อมูลในฐานข้อมูล
        const rs = await db.member.create({ data });

        // ส่งคำตอบสำเร็จ
        res.status(201).json({ msg: 'ลงทะเบียนสำเร็จ' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
    }
};




// ฟังก์ชันเข้าสู่ระบบ
exports.login = async (req, res, next) => {
    const { username_id, password_id } = req.body;

    try {
        if (!(username_id && password_id)) {
            return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }

        const user = await db.member.findUnique({
            where: { username_id },
        });

        if (!user || password_id !== user.password_id) {
            return res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }

        res.json({
            msg: 'เข้าสู่ระบบสำเร็จ',
            ...user
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
    }
};

// ฟังก์ชันอัปเดตโปรไฟล์
exports.updateProfile = async (req, res, next) => {
    const { member_id, role_id, username_id, password_id, member_title, member_name, member_lastname, member_email, phone_number, Id_student, faculity, branch, status } = req.body;

    try {
        // ตรวจสอบรูปแบบอีเมล
        if (member_email && !/\S+@\S+\.\S+/.test(member_email)) {
            return res.status(400).json({ error: "รูปแบบอีเมลไม่ถูกต้อง" });
        }

        // ค้นหาข้อมูลสมาชิกในฐานข้อมูล
        let existingMember;
        if (member_id) {
            const numericMemberId = parseInt(member_id, 10);
            if (isNaN(numericMemberId)) {
                return res.status(400).json({ error: 'ID ของสมาชิกไม่ถูกต้อง' });
            }
            existingMember = await db.member.findFirst({
                where: { member_id: numericMemberId },
            });
        } 

        if (!existingMember) {
            return res.status(404).json({ error: "ไม่พบสมาชิก" });
        }

        // ตรวจสอบว่าอีเมลซ้ำหรือไม่ (ยกเว้นถ้าเป็นอีเมลของผู้ใช้ปัจจุบัน)
        if (member_email && member_email !== existingMember.member_email) {
            const existingEmail = await db.member.findUnique({
                where: { member_email }
            });

            if (existingEmail) {
                return res.status(409).json({ error: "อีเมลนี้มีอยู่แล้ว" }); // 409 Conflict error
            }
        }

        // เตรียมข้อมูลที่จะอัปเดต
        const updatedData = {};

        if (role_id !== undefined) updatedData.role_id = parseInt(role_id);
        if (username_id) updatedData.username_id = username_id;
        if (password_id) updatedData.password_id = password_id;
        if (Id_student) updatedData.Id_student = Id_student;
        if (member_title) updatedData.member_title = member_title;
        if (member_name) updatedData.member_name = member_name;
        if (member_lastname) updatedData.member_lastname = member_lastname;
        if (member_email) updatedData.member_email = member_email;
        if (phone_number) updatedData.phone_number = phone_number;
        if (faculity) updatedData.faculity = faculity;
        if (branch) updatedData.branch = branch;
        if (status) updatedData.status = status;

        // ตรวจสอบว่ามีข้อมูลที่ต้องอัปเดตหรือไม่
        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({ error: "ไม่มีข้อมูลให้ทำการอัปเดต" });
        }

        // อัปเดตข้อมูลสมาชิกในฐานข้อมูล
        const updatedMember = await db.member.update({
            where: { member_id: existingMember.member_id },
            data: {
                ...updatedData,
            },
        });

        res.json({ msg: 'อัปเดตโปรไฟล์สำเร็จ', data: updatedMember });
    } catch (err) {
        console.error('Error during profile update:', err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์' });
    }
};

exports.changePassword = async (req, res, next) => {
    const { member_id, password_id } = req.body; // รวม member_id ด้วยเพื่อระบุสมาชิกที่ต้องการเปลี่ยนรหัสผ่าน

    try {
        // ตรวจสอบว่ามี member_id และ password_id ถูกส่งมา
        if (!member_id || !password_id) {
            return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
        }

        // แปลง member_id เป็นจำนวนเต็ม
        const memberIdInt = parseInt(member_id, 10);
        
        // ตรวจสอบว่าการแปลงเป็นจำนวนเต็มสำเร็จหรือไม่
        if (isNaN(memberIdInt)) {
            return res.status(400).json({ error: 'member_id ต้องเป็นจำนวนเต็ม' });
        }

        // อัปเดตรหัสผ่านใหม่ในฐานข้อมูล
        await db.member.update({
            where: { member_id: memberIdInt }, // ใช้ memberIdInt แทน
            data: { password_id: password_id }, // อัปเดต password_id
        });

        res.json({ msg: 'เปลี่ยนรหัสผ่านสำเร็จ' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' });
    }
};




// ฟังก์ชันลบสมาชิก
exports.deleteMember = async (req, res, next) => {
    const { member_id } = req.params;

    try {
        const numericMemberId = parseInt(member_id, 10);
        if (isNaN(numericMemberId)) {
            return res.status(400).json({ error: 'ID ของสมาชิกไม่ถูกต้อง' });
        }

        // ค้นหาสมาชิกในฐานข้อมูล
        const member = await db.member.findUnique({
            where: { member_id: numericMemberId },
        });

        if (!member) {
            return res.status(404).json({ error: "ไม่พบสมาชิก" });
        }

        // ลบรูปภาพโปรไฟล์ถ้ามี
        if (member.profile_image) {
            const imagePath = path.join(__dirname, '..', 'uploads', 'profile', member.profile_image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // ลบไฟล์รูปภาพ
            }
        }

        // ลบข้อมูลสมาชิกในฐานข้อมูล
        await db.member.delete({
            where: { member_id: numericMemberId },
        });

        res.json({ msg: 'ลบสมาชิกสำเร็จ' });
    } catch (err) {
        console.error('Error during member deletion:', err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบสมาชิก' });
    }
};



//////////////////////////////////////////////////////////////////////////////////////////////////////////
//ข้อมูลที่ใช้ในกราฟผู้ใช้เพื่อใช้ใน dashboard

// อัปเดต API สำหรับข้อมูลการสมัครรายวัน
exports.getDailyRegistrationStats = async (req, res, next) => {
    try {
        // ค้นหาจำนวนสมาชิกที่สมัครในแต่ละวัน
        const dailyRegistrations = await db.member.groupBy({
            by: ['created_at'],
            _count: {
                id: true,
            },
            where: {
                role_id: 1, // ตรวจสอบให้แน่ใจว่าค่าตรงกับที่ใช้ในฐานข้อมูล
            },
            orderBy: {
                created_at: 'asc', // เรียงลำดับตามวันที่
            },
        });

        // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
        const labels = dailyRegistrations.map(reg => reg.created_at.toISOString().split('T')[0]);
        const data = dailyRegistrations.map(reg => reg._count.id);

        res.json({ labels, data });
    } catch (err) {
        console.error('Error fetching daily registration stats:', err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการสมัครสมาชิกรายวัน' });
    }
};


// API สำหรับนับจำนวนนักเรียน
exports.getStudentCount = async (req, res, next) => {
    try {
        const studentCount = await db.member.count({
            where: { role_id: 1 } // role_id = 1 สำหรับนักเรียน
        });
        res.json({ count: studentCount });
    } catch (error) {
        console.error('Error fetching student count:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลนักเรียน' });
    }
}

// API สำหรับนับจำนวนอาจารย์
exports.getTeacherCount = async (req, res, next) => {
    try {
        const teacherCount = await db.member.count({
            where: { role_id: 2 } // role_id = 2 สำหรับอาจารย์
        });
        res.json({ count: teacherCount });
    } catch (error) {
        console.error('Error fetching teacher count:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลอาจารย์' });
    }
}


// API สำหรับข้อมูลการสมัครรายวันแบบแยกตามบทบาท (อาจารย์และนักศึกษา)
exports.getDailyRegistrationStatsByRole = async (req, res, next) => {
    try {
        // Query to get daily registration counts by role
        const dailyRegistrations = await db.member.groupBy({
            by: ['created_at', 'role_id'],
            _count: {
                member_id: true,
            },
            orderBy: {
                created_at: 'asc', // Sort by date
            },
        });

        // Format the data for the frontend
        const formattedData = dailyRegistrations.reduce((acc, curr) => {
            const date = curr.created_at.toISOString().split('T')[0]; // Extract date in YYYY-MM-DD format
            const role = curr.role_id === 1 ? 'students' : 'teachers'; // Adjust based on role_id

            if (!acc[date]) {
                acc[date] = { students: 0, teachers: 0 };
            }

            acc[date][role] += curr._count.member_id; // Count based on member_id

            return acc;
        }, {});

        // Prepare labels and data for the response
        const labels = Object.keys(formattedData);
        const studentData = labels.map(date => formattedData[date].students);
        const teacherData = labels.map(date => formattedData[date].teachers);

        res.json({
            labels,
            datasets: [
                {
                    label: 'นักศึกษา',
                    data: studentData,
                    backgroundColor: '#FF6384',
                },
                {
                    label: 'อาจารย์',
                    data: teacherData,
                    backgroundColor: '#36A2EB',
                },
            ],
        });
    } catch (err) {
        console.error('Error fetching daily registration stats by role:', err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการสมัครสมาชิกรายวันแบบแยกบทบาท' });
    }
};




