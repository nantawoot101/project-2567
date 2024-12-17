const bcrypt = require('bcrypt');
const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

exports.getAllExpert = async (req, res, next) => {
    try {
        const creators = await db.expert.findMany();
        res.json(creators);
    } catch (err) {
        next(err);
    }
};

exports.getExpertById = async (req, res) => {
  const { id_expert } = req.params;

  try {
    const intId = parseInt(id_expert, 10);
    if (isNaN(intId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const expert = await db.expert.findUnique({
      where: { id_expert: intId }
    });

    if (!expert) {
      return res.status(404).json({ error: 'Expert not found' });
    }

    res.json({ expert }); // Make sure the response includes `expert` object
  } catch (error) {
    console.error('Error fetching expert:', error);
    res.status(500).json({ error: 'An error occurred while fetching expert' });
  }
};


  

exports.save = async (req, res, next) => {
  const { expert_title, expert_name, expert_lastname, branch, group, phone_number, email } = req.body;

  // ตรวจสอบข้อมูลที่ได้รับว่าครบถ้วนหรือไม่
  if (!expert_title || !expert_name || !expert_lastname || !branch || !group || !phone_number || !email) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    // ตรวจสอบว่าอีเมลมีอยู่ในฐานข้อมูลแล้วหรือไม่
    const existingExpert = await db.expert.findFirst({ where: { email } });
    if (existingExpert) {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    const newExpert = await db.expert.create({
        data: {
            expert_title,
            expert_name,
            expert_lastname,
            branch,
            group,
            phone_number,
            email
        }
    });

    res.status(201).json({ msg: 'ลงทะเบียนสำเร็จ', expert: newExpert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
  }
};



exports.updateExpert = async (req, res) => {
  const { id_expert, expert_title, expert_name, expert_lastname, branch, group, phone_number, email } = req.body;

  try {
    const intId = parseInt(id_expert, 10);
    if (isNaN(intId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    // ตรวจสอบว่ามีอีเมลเดียวกันอยู่ในฐานข้อมูลแล้วหรือไม่
    const existingExpert = await db.expert.findFirst({
      where: {
        email,
        NOT: {
          id_expert: intId
        }
      }
    });

    if (existingExpert) {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    const updatedExpert = await db.expert.update({
        where: { id_expert: intId },
        data: {
            expert_title,
            expert_name,
            expert_lastname,
            branch,
            group,
            phone_number,
            email
        },
    });

    res.json({ msg: 'อัปเดตข้อมูลสำเร็จ', expert: updatedExpert });
  } catch (error) {
    console.error('Error during expert update:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
  }
};

  


exports.deleteExpert = async (req, res) => {
  const { id_expert } = req.params;

  try {
      const intId = parseInt(id_expert, 10);
      if (isNaN(intId)) {
          return res.status(400).json({ error: 'Invalid ID format' });
      }

      const deletedExpert = await db.expert.delete({
          where: { id_expert: intId }
      });

      res.json({ msg: 'ลบข้อมูลสำเร็จ', expert: deletedExpert });
  } catch (error) {
      console.error('Error deleting expert:', error);
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
  }
};

exports.getTotalExpertCount = async (req, res) => {
  try {
      const expertCount = await db.expert.count();
      res.status(200).json({ expertCount: expertCount });
  } catch (error) {
      console.error('Error counting experts:', error);
      res.status(500).json({ error: 'Failed to count experts', details: error.message });
  }
};