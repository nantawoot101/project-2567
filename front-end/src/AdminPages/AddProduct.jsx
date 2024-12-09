import { useState } from 'react';
import axios from 'axios';

export default function AddProduct() {
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    stock_quantity: '',
    bookimg: null,
    genreId: ''
  });

  const [previewImg, setPreviewImg] = useState(null); // เพิ่ม state เพื่อเก็บ URL ของรูปภาพที่จะแสดง

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedImg = e.target.files[0];
    setFormData({ ...formData, bookimg: selectedImg });
    setPreviewImg(URL.createObjectURL(selectedImg)); // สร้าง Object URL และเก็บไว้ใน state สำหรับการแสดงรูปภาพ
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('author', formData.author);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stock_quantity', formData.stock_quantity);
    formDataToSend.append('bookimg', formData.bookimg);
    formDataToSend.append('genreId', formData.genreId);

    try {
      await axios.post('http://localhost:8888/books/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("เพิ่มหนังสือสำเร็จ")
    } catch (error) {
      console.error('Error creating product:', error);
      alert("เกิดข้อผิดพลาดในการเพิ่มหนังสือ");
    }
  };

  return (
    <div className="p-5 border w-4/6 min-w-[1000px] mx-auto rounded mt-5">
      <div className="text-3xl mb-10 text-center">เพิ่มสินค้าใหม่</div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit} >
        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">ชื่อหนังสือ</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>

        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">ชื่อผู้แต่ง</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
        </label>

        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">คำอธิบาย</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">ราคา</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </label>

        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">จำนวนสต๊อกสินค้า</span>
          </div>
          <input
            type="number"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
          />
        </label>

        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">เพิ่มภาพสินค้า</span>
          </div>
          <input
            type="file"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="bookimg"
            onChange={handleFileChange}
          />
          {previewImg && (
            <img src={previewImg} alt="Preview" className="mt-3 rounded w-[250px]" /> // แสดงรูปภาพตัวอย่างถ้ามีการเลือกรูป
          )}
        </label>

        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">รหัสหมวดหมู่หนังสือ</span>
          </div>
          <input
            type="number"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="genreId"
            value={formData.genreId}
            onChange={handleChange}
          />
        </label>

        <div className="flex gap-5">
          <button type="submit" className="btn bg-green-500 transition duration-300 hover:bg-green-600 text-white max-w-xs mx-auto w-[200px] h-10 rounded rounded-20 mr-2">เพิ่มสินค้า</button>
          <button type="reset" className="btn bg-red-600 transition duration-300 hover:bg-red-500 text-white max-w-xs mx-auto w-[200px] h-10 rounded rounded-20">ยกเลิก</button>
        </div>
      </form>
    </div>
  );
}
