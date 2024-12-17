const bcrypt = require('bcrypt');
const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

exports.getAllChairman = async (req, res, next) => {
    try {
        const chairmen = await db.chairman.findMany();
        res.json(chairmen);
    } catch (err) {
        next(err);
    }
};

exports.getChairmanById = async (req, res) => {
  const { id_chairman } = req.params;

  try {
    const intId = parseInt(id_chairman, 10);
    if (isNaN(intId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const chairman = await db.chairman.findUnique({
      where: { id_chairman: intId }
    });

    if (!chairman) {
      return res.status(404).json({ error: 'Chairman not found' });
    }

    res.json({ chairman });
  } catch (error) {
    console.error('Error fetching chairman:', error);
    res.status(500).json({ error: 'An error occurred while fetching chairman' });
  }
};

exports.save = async (req, res, next) => {
    const { chairman_title, chairman_name, chairman_lastname, branch, group, phone_number, email } = req.body;
  
    if (!chairman_title || !chairman_name || !chairman_lastname || !branch || !group || !phone_number || !email) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }
  
    try {
      const existingChairman = await db.chairman.findFirst({ 
        where: { email } 
      });
  
      if (existingChairman) {
        return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
      }
  
      const newChairman = await db.chairman.create({
          data: {
              chairman_title,
              chairman_name,
              chairman_lastname,
              branch,
              group,
              phone_number,
              email
          }
      });
  
      res.status(201).json({ msg: 'ลงทะเบียนสำเร็จ', chairman: newChairman });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
    }
  };
  

  exports.updateChairman = async (req, res) => {
    const { id_chairman, chairman_title, chairman_name, chairman_lastname, branch, group, phone_number, email } = req.body;
  
    try {
      const intId = parseInt(id_chairman, 10);
      if (isNaN(intId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
  
      const existingChairman = await db.chairman.findFirst({
        where: {
          email,
          NOT: {
            id_chairman: intId
          }
        }
      });
  
      if (existingChairman) {
        return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
      }
  
      const updatedChairman = await db.chairman.update({
          where: { id_chairman: intId },
          data: {
              chairman_title,
              chairman_name,
              chairman_lastname,
              branch,
              group,
              phone_number,
              email
          },
      });
  
      res.json({ msg: 'อัปเดตข้อมูลสำเร็จ', chairman: updatedChairman });
    } catch (error) {
      console.error('Error during chairman update:', error);
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
    }
  };
  

exports.deleteChairman = async (req, res) => {
  const { id_chairman } = req.params;

  try {
    const intId = parseInt(id_chairman, 10);
    if (isNaN(intId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const deletedChairman = await db.chairman.delete({
      where: { id_chairman: intId }
    });

    res.json({ msg: 'ลบข้อมูลสำเร็จ', chairman: deletedChairman });
  } catch (error) {
    console.error('Error deleting chairman:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
  }
};

exports.getTotalChairmanCount = async (req, res) => {
  try {
    const chairmanCount = await db.chairman.count();
    res.status(200).json({ chairmanCount: chairmanCount });
  } catch (error) {
    console.error('Error counting chairmen:', error);
    res.status(500).json({ error: 'Failed to count chairmen', details: error.message });
  }
};
