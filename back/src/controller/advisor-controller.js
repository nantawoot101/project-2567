const db = require('../models/db'); // ตรวจสอบว่าตำแหน่งนี้ถูกต้อง
const multer = require('multer');
const path = require('path');
const fs = require('fs');

exports.getAllAdvisor = async (req, res, next) => {
    try {
        const advisors = await db.advisor.findMany();
        res.json(advisors);
    } catch (err) {
        next(err);
    }
};

exports.getAdvisorById = async (req, res) => {
    const { id_advisor } = req.params;

    try {
        const intId = parseInt(id_advisor, 10);
        if (isNaN(intId)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const advisor = await db.advisor.findUnique({
            where: { id_advisor: intId }
        });

        if (!advisor) {
            return res.status(404).json({ error: 'Advisor not found' });
        }

        res.json({ advisor });
    } catch (error) {
        console.error('Error fetching advisor:', error);
        res.status(500).json({ error: 'An error occurred while fetching advisor' });
    }
};

exports.save = async (req, res, next) => {
    const { advisor_title, advisor_name, advisor_lastname, branch, group, phone_number, email } = req.body;

    if (!advisor_title || !advisor_name || !advisor_lastname || !branch || !group || !phone_number || !email) {
        return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    try {
        // ตรวจสอบว่าอีเมลนั้นมีอยู่แล้วหรือไม่
        const existingAdvisor = await db.advisor.findFirst({ 
            where: { email }
        });
        if (existingAdvisor) {
            return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
        }

        // สร้างข้อมูลใหม่
        const newAdvisor = await db.advisor.create({
            data: {
                advisor_title,
                advisor_name,
                advisor_lastname,
                branch,
                group,
                phone_number,
                email
            }
        });

        res.status(201).json({ msg: 'ลงทะเบียนสำเร็จ', advisor: newAdvisor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
    }
};

exports.updateAdvisor = async (req, res) => {
    const { id_advisor, advisor_title, advisor_name, advisor_lastname, branch, group, phone_number, email } = req.body;

    try {
        const intId = parseInt(id_advisor, 10);
        if (isNaN(intId)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        // ตรวจสอบว่าอีเมลนั้นมีอยู่แล้วหรือไม่
        const existingAdvisor = await db.advisor.findFirst({
            where: {
                email,
                NOT: {
                    id_advisor: intId
                }
            }
        });

        if (existingAdvisor) {
            return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
        }

        // อัปเดตข้อมูล
        const updatedAdvisor = await db.advisor.update({
            where: { id_advisor: intId },
            data: {
                advisor_title,
                advisor_name,
                advisor_lastname,
                branch,
                group,
                phone_number,
                email
            },
        });

        res.json({ msg: 'อัปเดตข้อมูลสำเร็จ', advisor: updatedAdvisor });
    } catch (error) {
        console.error('Error during advisor update:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
    }
};

exports.deleteAdvisor = async (req, res) => {
    const { id_advisor } = req.params;

    try {
        const intId = parseInt(id_advisor, 10);
        if (isNaN(intId)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        // ตรวจสอบข้อมูลที่เกี่ยวข้อง
        const relatedData = await db.someRelatedModel.findMany({
            where: { id_advisor: intId }
        });

        if (relatedData.length > 0) {
            return res.status(400).json({ error: 'ไม่สามารถลบได้ เนื่องจากมีข้อมูลที่เกี่ยวข้องอยู่' });
        }

        // ลบ advisor ถ้าไม่มีข้อมูลที่เกี่ยวข้อง
        const deletedAdvisor = await db.advisor.delete({
            where: { id_advisor: intId }
        });

        res.json({ msg: 'ลบข้อมูลสำเร็จ', advisor: deletedAdvisor });
    } catch (error) {
        console.error('Error deleting advisor:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    }
};


exports.getTotalAdvisorCount = async (req, res) => {
    try {
        const advisorCount = await db.advisor.count();
        res.status(200).json({ advisorCount });
    } catch (error) {
        console.error('Error counting advisors:', error);
        res.status(500).json({ error: 'Failed to count advisors', details: error.message });
    }
};
