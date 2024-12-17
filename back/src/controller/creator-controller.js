const bcrypt = require('bcrypt');
const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

exports.getAllCreator = async (req, res, next) => {
    try {
        const creators = await db.creator.findMany();
        res.json(creators);
    } catch (err) {
        next(err);
    }
};

exports.getCreatorById = async (req, res) => {
    const { id } = req.params;
  
    try {
      // แปลง id เป็นชนิดข้อมูลที่ Prisma คาดหวัง
      const intId = parseInt(id, 10);
  
      // ตรวจสอบว่าการแปลงสำเร็จหรือไม่
      if (isNaN(intId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
  
      // ค้นหา creator โดยใช้ id ที่แปลงแล้ว
      const creator = await db.creator.findUnique({
        where: {
          id: intId
        }
      });
  
      // ตรวจสอบว่าพบข้อมูลหรือไม่
      if (!creator) {
        return res.status(404).json({ error: 'Creator not found' });
      }
  
      res.json(creator);
    } catch (error) {
      console.error('Error fetching creator:', error);
      res.status(500).json({ error: 'An error occurred while fetching creator' });
    }
  };

exports.save = async (req, res, next) => {
    const { creator, id_student, id_project } = req.body;

    try {
        if (!creator || !id_student || !id_project) {
            return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }

        const data = {
            creator,
            id_student,
            id_project,
        };

        const rs = await db.creator.create({ data });
        console.log(rs);

        res.status(201).json({ msg: 'ลงทะเบียนสำเร็จ' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
    }
};

exports.getCreatorByProductId = async (req, res) => {
    const { id_product } = req.params;
  
    try {
        const intProductId = parseInt(id_product, 10);
  
        if (isNaN(intProductId)) {
            return res.status(400).json({ error: 'Invalid Product ID format' });
        }
  
        // ค้นหาผู้สร้างที่เชื่อมโยงกับผลิตภัณฑ์
        const creators = await db.creator.findMany({
            where: {
                id_project: intProductId
            }
        });
  
        if (creators.length === 0) {
            return res.status(404).json({ error: 'No creators found for this product' });
        }
  
        res.json(creators);
    } catch (error) {
        console.error('Error fetching creator by product ID:', error);
        res.status(500).json({ error: 'An error occurred while fetching creator by product ID' });
    }
};

exports.update = async (req, res, next) => {
    const { id, creator, id_student, id_project } = req.body;

    try {
        if (!id) {
            return res.status(400).json({ error: "กรุณากรอก ID ของผู้สร้างโครงการ" });
        }

        const existingCreator = await db.creator.findUnique({
            where: { id: id },
        });

        if (!existingCreator) {
            return res.status(404).json({ error: "ไม่พบผู้สร้างโครงการ" });
        }

        const updateData = {
            creator: creator || existingCreator.creator,
            id_student: id_student || existingCreator.id_student,
            id_project: id_project || existingCreator.id_project,
        };

        const updatedCreator = await db.creator.update({
            where: { id: id },
            data: updateData,
        });

        res.json({ msg: 'อัปเดตข้อมูลโปรไฟล์สำเร็จ', updatedCreator });
    } catch (err) {
        console.error('Error during profile update:', err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลโปรไฟล์' });
    }
};
