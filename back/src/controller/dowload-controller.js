const db = require('../models/db');

exports.getAll = async (req, res, next) => {
    try {
      const dowloads = await db.dowload.findMany();
      res.json(dowloads);
    } catch (err) {
      next(err);
    }
  };

  exports.getDownloadCount = async (req, res) => {
    const { id_doc } = req.params; // Retrieve id_doc from URL
  
    try {
      // Ensure id_doc is a valid integer
      const parsedIdDoc = parseInt(id_doc, 10);
  
      if (isNaN(parsedIdDoc)) {
        return res.status(400).json({ message: 'Invalid document ID' });
      }
  
      // Retrieve all download records for the specified id_doc
      const downloads = await db.dowload.findMany({
        where: {
          id_doc: parsedIdDoc // Use the parsed integer value directly
        }
      });
  
      // If no downloads are found, return a 404 error
      if (downloads.length === 0) {
        return res.status(404).json({ message: 'No downloads found for this document' });
      }
  
      // Summarize the download counts
      const totalDownloads = downloads.reduce((acc, download) => acc + download.view_dowload, 0);
  
      // Return the total download count to the client
      res.status(200).json({ totalDownloads });
    } catch (error) {
      console.error('Error fetching download count:', error);
      res.status(500).json({ message: 'Error fetching download count' });
    }
  };
  
  
  

  exports.incrementDownload = async (req, res) => {
    try {
      const docId = parseInt(req.body.id_doc);
      console.log('docId:', docId);
  
      // ตรวจสอบว่ามี record ของการดาวน์โหลดเอกสารนี้อยู่หรือไม่
      const existingDownload = await db.dowload.findUnique({
        where: {
          id: docId
        },
      });
  
      console.log('existingDownload:', existingDownload);
  
      if (existingDownload) {
        // อัปเดตจำนวนดาวน์โหลดทุกครั้งที่มีการดาวน์โหลด
        const updatedDoc = await db.dowload.update({
          where: {
            id: docId
          },
          data: {
            view_dowload: {
              increment: 1
            }
          },
        });
  
        console.log('updatedDoc:', updatedDoc);
  
        res.status(200).json({ message: 'Download count updated', view_dowload: updatedDoc.view_dowload });
      } else {
        // ถ้าไม่มี record นี้มาก่อน ให้สร้างใหม่
        const newDoc = await db.dowload.create({
          data: {
            view_dowload: 1,
            doc: {
              connect: { id: docId } // เชื่อมโยงกับ doc ที่มี id ตรงกัน
            }
          },
        });
  
        console.log('newDoc:', newDoc);
  
        res.status(201).json({ message: 'New download record created', view_dowload: newDoc.view_dowload });
      }
    } catch (error) {
      console.error('Error updating download count:', error);
      res.status(500).json({ error: 'Failed to update download count', details: error.message });
    }
  };
  
  


  
 
  
  