const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/refresh-token', (req, res) => {
  try {
    // ตรวจสอบว่ามี token ในคำขอหรือไม่
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }

    // ดึงข้อมูลอื่น ๆ จาก refreshToken หรือฐานข้อมูล
    // ตรวจสอบความถูกต้องของ refreshToken และดึงข้อมูลที่เกี่ยวข้อง

    // สร้าง token ใหม่
    const newToken = jwt.sign({ /* ข้อมูลที่ต้องการให้มีใน token */ }, 'your-secret-key', { expiresIn: '1h' });

    // ส่ง token ใหม่กลับไปยังผู้ใช้
    res.status(200).json({ token: newToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;