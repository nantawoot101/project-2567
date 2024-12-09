const db = require("../models/db");
const multer = require('multer');

exports.getAllBooks = async (req, res, next) => {
    try {
      const books = await db.book.findMany();
      res.json(books);
    } catch (err) {
      next(err);
    }
  };


  exports.getBookById = async (req, res, next) => {
    try {
      const { id } = req.params;

    // ตรวจสอบว่า id เป็น integer
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // ค้นหา user โดยใช้ id
    const book = await db.book.findUnique({
      where: {
        id: parseInt(id),
      },
    });


    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // ส่ง response user
    res.json(book);
  } catch (err) {
    next(err);
  }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/product')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage }).single('bookimg');

exports.createBook = async (req, res, next) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        const { title, author, description, price, stock_quantity, genreId } = req.body;
        const bookimg = req.file.filename ;
        try {
            if (!(title && author && description && price && stock_quantity && bookimg && genreId)) {
                return res.status(404).json({ error: 'Please provide all required book information' });
            }

            const data = {
                title,
                author,
                description,
                price: parseInt(price),
                stock_quantity: parseInt(stock_quantity),
                bookimg,
                genreId: parseInt(genreId)
            };

            
            const rsb = await db.book.create({data});
            console.log(rsb);

            res.json({ msg: 'เพิ่มสินค้าสำเร็จ' });
        } catch (err) {
            next(err);
        }
    });
}

exports.updateBook = async (req, res, next) => {
  try {
    
    const { title, author, description, price, stock_quantity, genreId } = req.body; 
    
    let updateData = {};

    if (title) {
      updateData.title = title;
    }
    if (author) {
      updateData.author = author;
    }
    if (description) {
      updateData.description = description;
    }
    if (price) {
      updateData.price = parseInt(price);
    }
    if (stock_quantity) {
      updateData.stock_quantity = parseInt(stock_quantity);
    }
    if (genreId) {
      updateData.genreId = parseInt(genreId);
    }
    if (req.file) {
      updateData.bookimg = req.file.filename;
    }

    const book = await db.book.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: updateData
    });

    if (!book) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.status(200).json(book);
  } catch (error) {

    next(error);
  }
};


  exports.deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedBook = await db.book.delete({
            where: {
                id: parseInt(id)
            }
        });

        if (!deletedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }

        return res.json({ msg: 'ลบหนังสือสำเร็จ' });
    } catch (err) {
        next(err);
    }
};

  exports.getAllGenres = async (req, res, next) => {
    try {
      const genres = await db.genres.findMany();
      res.json(genres);
    } catch (err) {
      next(err);
    }
  };

  exports.getGenreById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const genre = await db.genres.findUnique({
        where: {
          id: parseInt(id),
        },
      });
  

      if (!genre) {
        return res.status(404).json({ error: 'Genre not found' });
      }
      res.json(genre);
    } catch (err) {
      next(err);
    }
  };

exports.genresBook = async (req, res, next) => {
    try {
        const { genre_name} = req.body;
        if (!genre_name) {
            return res.status(404).json({ error: 'Please provide all required book information' });
        }

        const data = {
            genre_name
        };

        const rs = await db.genres.create({data});
        console.log(rs);

        res.json({ msg: 'สร้างหมวดหมู่หนังสือสำเร็จ' });
    } catch (err) {
        next(err);
    }
};


exports.updateGenre = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { genre_name } = req.body;
  
      const updateData = {};
      if (genre_name) updateData.genre_name = genre_name;
  
      const updatedGenre = await db.genres.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedGenre) {
        return res.status(404).json({ error: 'Genre not found' });
      }
      res.json({ msg: "แก้ไขไม่สำเร็จ"});
      }catch (err) {
        next(err);
    }
    };

    