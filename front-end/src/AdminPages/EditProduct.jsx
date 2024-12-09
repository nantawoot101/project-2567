import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function AddProduct() {
  const { id } = useParams();
  const [previewImg, setPreviewImg] = useState(null); // เพิ่ม state เพื่อเก็บ URL ของรูปภาพที่จะแสดง
  const [editProduct, setEditProduct] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    stock_quantity: '',
    bookimg: null,
    genreId: ''
  });

  useEffect(() => {
    if (id) {
      fetchBookData();
    }
  }, [id]); 

  const fetchBookData = async () => {
    try {
      const response = await axios.get(`http://localhost:8888/books/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // ใช้ localStorage ในการเข้าถึง token
        }
      }
    );
      setEditProduct(response.data);
    } catch (error) {
      console.error('Error fetching book data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedImg = e.target.files[0]; // เก็บรูปที่เลือกไว้ในตัวแปร selectedImg
    setEditProduct({ ...editProduct, bookimg: selectedImg });
    setPreviewImg(URL.createObjectURL(selectedImg)); // สร้าง Object URL และเก็บไว้ใน state สำหรับการแสดงรูปภาพ
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (id) {
        response = await axios.put(
          `http://localhost:8888/books/edit/${id}`,
          editProduct,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}` // ใช้ localStorage ในการเข้าถึง token
            }
          }
        );
      } else {
        response = await axios.post(
          'http://localhost:8888/books',
          editProduct,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}` // ใช้ localStorage ในการเข้าถึง token
            }
          }
        );
      }

      if (response.status === 200) {
        alert('บันทึกข้อมูลสำเร็จ');
        // Redirect or do something else upon successful save
      } else {
        console.error('เกิดข้อผิดพลาด:', response.data);
        // Show appropriate error message
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error.message);
      // Show appropriate error message
    }
  };

  return (
    <div className="p-5 border w-4/6 min-w-[1000px] mx-auto rounded mt-5">
      <div className="text-3xl mb-10 text-center">แก้ไขข้อมูลหนังสือ</div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit} >
        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">ชื่อหนังสือ</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="title"
            value={editProduct.title}
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
            value={editProduct.author}
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
            value={editProduct.description}
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
            value={editProduct.price}
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
            value={editProduct.stock_quantity}
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
            value={editProduct.genreId}
            onChange={handleChange}
          />
        </label>

        <div className="flex gap-5">
          <button type="submit" className="btn bg-green-500 transition duration-300 hover:bg-green-600 text-white max-w-xs mx-auto w-[200px] h-10 rounded rounded-20 mr-2">บันทึกข้อมูล</button>
          <button type="reset" className="btn bg-red-600 transition duration-300 hover:bg-red-500 text-white max-w-xs mx-auto w-[200px] h-10 rounded rounded-20">ยกเลิก</button>
        </div>
      </form>
    </div>
  );
}
