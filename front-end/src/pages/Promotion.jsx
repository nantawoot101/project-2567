import { useState, useEffect } from 'react';
import Navmenu from './Navmenu';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Promotion() {
    const [books, setBooks] = useState([]);
  
  
    useEffect(() => {
        const fetchBook = async () => {
          try {
            const response = await axios.get('http://localhost:8888/books/', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setBooks(response.data);
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchBook();
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
      <h1 className='p-5 text-[24px]'>โปรโมชั่น</h1>
      <hr />
            <div className="grid grid-cols-4 gap-4 mt-3">
                {books.map((book, index) => (
            <div key={index} className="border p-4 rounded-md">
                <Link to={`/book-details/${book.id}`}>
                <img src={`http://localhost:8888/product/${book.bookimg}`} alt={book.title} className="mb-3 w-[350px] h-[350px] object-cover rounded-md" />
                </Link>
                <Link to={`/book-details/${book.id}`} className="text-lg font-semibold"> {book.title}</Link>
                <p className="text-gray-500">ผู้แต่ง: {book.author}</p>
                <div>
                <button onClick={() => addToCart(book.id)} className="btn bg-white text-green-500 px-4 rounded-md mt-2 border-green-500 ">เพิ่มสินค้าลงตระกร้า</button>
                <Link to={`/book-details/${book.id}`} className="btn bg-green-500 text-white px-4 rounded-md mt-2  ml-3">฿ {book.price}</Link>
                </div>   
            </div>
            ))}
        </div>
    </div>
</div>
  );
}

