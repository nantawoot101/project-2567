import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Navmenu from "./Navmenu";

export default function BookDetails() {
  const [book, setBook] = useState(null);
  const [cart_quantity, setCart_quantity] = useState(1); // เพิ่มตัวแปร cart_quantity และ setCart_quantity
  const { id } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:8888/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book data:', error);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);



  const addToCart = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const response = await axios.post(`http://localhost:8888/cart/add/${id}`, {
        userId: id,
        bookId: id,
        cart_quantity: cart_quantity
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log(response.data);
      alert('เพิ่มสินค้าลงตระกร้าสำเร็จ')
    } catch (error) {
      console.error(error);
    }
  };

  const decreaseQuantity = () => {
    if (cart_quantity > 1) {
        setCart_quantity(cart_quantity - 1); // ลดจำนวนสินค้าลงทีละ 1
    }
  };

  const increaseQuantity = () => {
    if (cart_quantity < book.stock_quantity) {
        setCart_quantity(cart_quantity + 1); // เพิ่มจำนวนสินค้าลงทีละ 1
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navmenu />
      <div className="flex mt-10 justify-center max-w-[80%]">
        <img
          src={`http://localhost:8888/product/${book.bookimg}`}
          alt={book.title}
          className="w-[500px] h-[500px] object-cover rounded-md mr-4"
        />
        <div className="p-4 ml-10">
          <h3 className="text-lg font-semibold">ชื่อเรื่อง: {book.title}</h3>
          <p className="text-gray-500 mt-5">ชื่อผู้แต่ง: {book.author}</p>
          <p className="text-gray-500 mt-5">คำอธิบาย: {book.description}</p>
          <p className="mt-5 text-gray-700 ">จำนวนสต๊อกสินค้า: {book.stock_quantity}</p>
          <h3 className="mt-5 text-lg font-semibold ">ราคา: ฿{book.price}</h3>
          <div className="flex items-center border border-gray-300 rounded mt-5">
            <button onClick={decreaseQuantity} className="px-3 py-1 border-r border-gray-300 flex-grow">-</button>
            <input type="number" id="quantity" min="1" value={cart_quantity} readOnly className="w-8 h-8 text-center flex-grow" /> 
            <button onClick={increaseQuantity} className="px-3 py-1 border-l border-gray-300 flex-grow">+</button>
          </div>  
          <button
            onClick={() => addToCart(book.id)}
            className="btn bg-white text-green-500 px-4 py-2 rounded-md mt-5 border-green-500"
          >
            เพิ่มสินค้าลงตระกร้า
          </button>
          <button className="btn bg-green-500 text-white px-4 py-2 rounded-md mt-2 ml-3 w-[150px]">
            ซื้อเลย
          </button>
        </div>
      </div>
    </div>
  );
}