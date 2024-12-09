const db = require("../models/db");
const multer = require('multer');


exports.getAllpromote = async (req, res, next) => {
    try {
      const promote = await db.promote.findMany();
      res.json(promote);
    } catch (err) {
      next(err);
    }
  };

  exports.getPromoteId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const promote = await db.promote.findById(id);
      if (!promote) {
        return res.status(404).json({ error: 'promote not found' });
      }
      res.json(promote);
    } catch (err) {
      next(err);
    }
  };
  

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/promote');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});



const upload = multer({ storage: storage }).single('promote_img');

exports.addpromote = async (req, res, next) => {
    upload(req, res, async function (err) {
        if (err) {
            // ตรวจสอบว่ามีข้อผิดพลาดในการอัปโหลดหรือไม่
            return res.status(500).json(err);
        }
        
        // ตรวจสอบว่ามี req.file อยู่หรือไม่
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { promote_name,bookId } = req.body;
        const promote_img = req.file.filename;

        try {
            // ตรวจสอบข้อมูลที่จำเป็น
            if (!promote_name || !promote_img || !bookId) {
                return res.status(400).json({ error: 'Please provide all required information' });
            }

            const data = {
                promote_name,
                promote_img,
                bookId: parseInt(bookId)
            };

            const rsb = await db.promote.create({data});
            console.log(rsb);

            res.json({ msg: 'เพิ่มการโปรโมทสำเร็จ' });
        } catch (err) {
            next(err);
        }
    });
}


exports.deletePromote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletePromote = await db.promote.delete({
            where: {
                id: parseInt(id)
            }
        });

        if (!deletePromote) {
            return res.status(404).json({ error: 'Book not found' });
        }

        return res.json({ msg: 'ลบหนังสือสำเร็จ' });
    } catch (err) {
        next(err);
    }
};
