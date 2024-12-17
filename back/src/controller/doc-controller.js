const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');

// กำหนดที่เก็บไฟล์ในโฟลเดอร์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/docs/');
    },
    filename: async (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        const newFilename = await getUniqueFilename(basename, ext);
        cb(null, newFilename);
    }
});

// ฟังก์ชันเพื่อรับชื่อไฟล์ที่ไม่ซ้ำ
const getUniqueFilename = (basename, ext) => {
    return new Promise((resolve, reject) => {
        const folderPath = 'uploads/docs/';
        let counter = 1;
        let filename = `${basename}${ext}`;

        const checkFileExists = (filename) => {
            fs.access(path.join(folderPath, filename), fs.constants.F_OK, (err) => {
                if (!err) {
                    // ถ้ามีไฟล์อยู่แล้ว, เพิ่มเลขต่อท้ายและตรวจสอบอีกครั้ง
                    filename = `${basename}(${counter})${ext}`;
                    counter++;
                    checkFileExists(filename);
                } else {
                    // ถ้าไม่มีไฟล์อยู่, ส่งชื่อไฟล์ที่ไม่ซ้ำ
                    resolve(filename);
                }
            });
        };

        checkFileExists(filename);
    });
};

// กำหนดขนาดสูงสุดของไฟล์ที่ 20MB
const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // ขนาดไฟล์สูงสุด 20MB
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf)$/)) { // ตรวจสอบไฟล์ PDF เท่านั้น
            return cb(new Error('Only PDF files are allowed!'), false);
        }
        cb(null, true);
    }
});

// อัปโหลดไฟล์ PDF หลายไฟล์
exports.newDoc = [
    upload.array('files'),
    async (req, res) => {
        try {
            const { id_project, name_project } = req.body;

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }

            const projectId = parseInt(id_project, 10);

            // ตรวจสอบว่าโปรเจกต์มีอยู่จริง
            const project = await db.project.findUnique({ where: { id_project: projectId } });

            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            const docs = await Promise.all(req.files.map(async (file) => {
                const relativeFilePath = `uploads/docs/${file.filename}`;
            
                return db.doc.create({
                    data: {
                        file_type: file.mimetype,
                        id_project: projectId,
                        name_project: name_project,
                        name_file: file.filename,
                        file_size: (file.size / 1024).toFixed(2) + ' KB',
                        file_path: relativeFilePath
                    }
                });
            }));

            res.status(201).json({ message: 'Files uploaded successfully', data: docs });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: 'Failed to upload files', details: error.message });
        }
    }
];

// ฟังก์ชันสำหรับอัปเดตไฟล์
exports.updateDoc = [
    upload.single('files'), // ใช้ upload.single สำหรับการอัปเดตไฟล์เดียว
    async (req, res) => {
        try {
            const { id, name_project } = req.body;
            const id_project = parseInt(req.params.id, 10); // กำหนดค่า id_project จาก req.params

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const docId = parseInt(id, 10); // ใช้ docId แทน projectId
            if (isNaN(docId)) { // ตรวจสอบ docId แทน projectId
                return res.status(400).json({ error: 'Invalid Document ID' });
            }
            
            // ตรวจสอบว่าเอกสารมีอยู่จริง
            const existingDoc = await db.doc.findUnique({
                where: {
                    id: docId // ใช้ docId แทน projectId
                }
            });
            
            if (!existingDoc) {
                return res.status(404).json({ error: 'Document not found' });
            }

            // อัปเดตข้อมูลในฐานข้อมูล
            const updatedDoc = await db.doc.update({
                where: { id: docId },
                data: {
                    file_type: req.file.mimetype,
                    project: id_project ? { connect: { id: id_project } } : existingDoc.project,
                    name_project: name_project,
                    name_file: req.file.filename,
                    file_size: (req.file.size / 1024).toFixed(2) + ' KB',
                    file_path: `uploads/docs/${req.file.filename}`
                }
            });

            res.status(200).json({ message: 'File updated successfully', data: updatedDoc });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: 'Failed to update file', details: error.message });
        }
    }
];

// ฟังก์ชันสำหรับดึงเอกสารตาม ID ของโปรเจกต์
exports.getDocsByProjectId = async (req, res) => {
    try {
        const { id_project } = req.params;
        const projectId = parseInt(id_project, 10);

        const project = await db.project.findUnique({
            where: { id_project: projectId }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const docs = await db.doc.findMany({
            where: { id_project: projectId }
        });

        // เพิ่ม URL ของไฟล์ PDF ลงในผลลัพธ์
        const docsWithUrls = docs.map(doc => ({
            ...doc,
            file_url: `${req.protocol}://${req.get('host')}/files/${doc.name_file}`
        }));

        res.status(200).json({ message: 'Files retrieved successfully', data: docsWithUrls });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to retrieve files', details: error.message });
    }
};

// ฟังก์ชันสำหรับดึงเอกสารทั้งหมด
exports.getAllDocs = async (req, res) => {
    try {
        const docs = await db.doc.findMany();

        // เพิ่ม URL ของไฟล์ PDF ลงในผลลัพธ์
        const docsWithUrls = docs.map(doc => ({
            ...doc,
            file_url: `${req.protocol}://${req.get('host')}/${doc.file_path}`
        }));

        res.status(200).json({ message: 'Files retrieved successfully', data: docsWithUrls });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to retrieve files', details: error.message });
    }
};

exports.downloadDoc = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join('uploads/docs/', filename);

        // ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        // ตั้งค่า Content-Disposition header เพื่อให้ดาวน์โหลดไฟล์แทนที่จะแสดงในเบราว์เซอร์
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/pdf');

        // ส่งไฟล์ให้ผู้ใช้
        fs.createReadStream(filePath).pipe(res);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to download file', details: error.message });
    }
};
