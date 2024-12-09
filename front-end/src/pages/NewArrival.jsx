import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import Navmenu from "./Navmenu";

export default function NewArrival() {
  
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // ดึงข้อมูล book จากตาราง
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get('http://localhost:8888/books/', {
          params: {
            _sort: 'date_created', // เรียงตามวันที่สร้าง
            _order: 'desc' // โดยแบบจากมากไปน้อย (ใหม่ไปเก่า)
          }
        });
        setBooks(response.data.reverse()); // กลับข้อมูลให้เรียงลำดับใหม่
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      }
    };
    fetchNewArrivals();
  }, []);



  const addToCart = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const response = await axios.post(`http://localhost:8888/cart/add/${id}`, {
        userId: id,
        bookId: id,
        cart_quantity: 1
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navmenu />
      <div  className='border-b border-gray-300 max-w-[80%] mx-auto'>
      
      <h1 className='p-5 text-[24px]'>มาใหม่</h1>
      <hr />
      <div className="grid grid-cols-4 gap-4 mt-3">
        {books.map((book, index) => (
          <div key={index} className="border p-4 rounded-md">
            <Link to={`/book-details/${book.id}`}>
              <img src={`http://localhost:8888/product/${book.bookimg}`} alt={book.title} className="mb-3 w-[350px] h-[350px] object-cover rounded-md" />
            </Link>
            <Link to={`/book-details/${book.id}`} className="text-lg font-semibold"> {book.title}</Link>
            <p className="text-gray-500">ผู้แต่ง: {book.author}</p>
            <button onClick={() => addToCart(book.id)} className="btn bg-white text-green-500 px-4 py-2 rounded-md mt-2 border-green-500">เพิ่มสินค้าลงตระกร้า</button>
            <Link to={`/book-details/${book.id}`} className="btn bg-green-500 text-white px-4 py-2 rounded-md mt-2 ml-3">฿ {book.price}</Link>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}