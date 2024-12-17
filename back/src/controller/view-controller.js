const db = require('../models/db');

// เพิ่มจำนวนคลิกให้กับโปรเจค
exports.addView = async (req, res) => {
    try {
        // แปลงค่าให้เป็น integer
        const projectId = parseInt(req.body.id_project);

        // ตรวจสอบว่ามี record ของการคลิกโปรเจคนี้จากสมาชิกคนนี้อยู่หรือไม่
        const existingView = await db.view.findFirst({
            where: {
                AND: [
                    { id_project: projectId }
                ]
            },
        });

        // ถ้ามีอยู่แล้ว
        if (existingView) {
            // อัปเดตคลิกทุกครั้งที่มีการคลิก
            await db.view.update({
                where: { id: existingView.id },
                data: {
                    clickCount: { increment: 1 }, // เพิ่มคลิกทีละ 1
                    lastClicked: new Date(),      // อัปเดตเวลาที่คลิกล่าสุด
                },
            });
            res.status(200).json({ message: 'Click updated', clickCount: existingView.clickCount + 1 });
        } else {
            // ถ้าไม่มี record นี้มาก่อน ให้สร้างใหม่
            await db.view.create({
                data: {
                    id_project: projectId,
                    clickCount: 1,
                    lastClicked: new Date(),
                },
            });
            res.status(201).json({ message: 'New view created', clickCount: 1 });
        }
    } catch (error) {
        console.error('Error adding view:', error);
        res.status(500).json({ error: 'Failed to add view', details: error.message });
    }
};




// ฟังก์ชันสำหรับดึงข้อมูลวิวตาม projectId
exports.getViewsByProject = async (req, res) => {
    try {
        const { id_project } = req.params;

        // ดึงข้อมูลวิวทั้งหมดที่เกี่ยวข้องกับโปรเจคนี้
        const views = await db.view.findMany({
            where: {
                id_project: parseInt(id_project),
            },
            include: {
                project: true // นำข้อมูลโปรเจคมาแสดงด้วย
            },
        });

        res.status(200).json(views);
    } catch (error) {
        console.error('Error fetching views:', error);
        res.status(500).json({ error: 'Failed to fetch views', details: error.message });
    }
};
