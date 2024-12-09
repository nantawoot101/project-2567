import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function BookForm() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PerPage = 8;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8888/books/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setBooks(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBooks();
  }, []);

  const addToCart = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return console.error('Unauthorized');
      }

      const response = await axios.post(`http://localhost:8888/cart/add/${id}`, {
        userId: id,
        bookId: id,
        cart_quantity: 1
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log(response.data);
      alert('เพิ่มสินค้าลงตระกร้าสำเร็จ')
    } catch (error) {
      console.error(error);
    }
  };

// สร้างฟังก์ชันที่ใช้ในการแยกหนังสือตามจำนวนหน้าที่กำหนด
const Book = () => {
  const indexOfLastBook = currentPage * PerPage;
  const indexOfFirstBook = indexOfLastBook - PerPage;
  return books.slice(indexOfFirstBook, indexOfLastBook);
};

// สร้างฟังก์ชันที่ใช้ในการกำหนดจำนวนหน้า pagination ที่ต้องการแสดง
const pageNumbers = [];
for (let i = 1; i <= Math.ceil(books.length / PerPage); i++) {
  pageNumbers.push(i);
}

return (
  <div className='border-b border-gray-300 max-w-[80%] mx-auto'>
    <h1 className='p-5 text-[24px]'>หนังสือทั้งหมด</h1>
    <hr />
    <div className="grid grid-cols-4 gap-4 mt-3">
      {Book().map((book, index) => (
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
    {/* Pagination */}
    <div className="flex justify-center mt-4">
      <nav>
        <ul className="pagination flex items-center space-x-4">
          <li className="page-item">
            <button className="w-10 h-10 rounded-full border border-green-500 text-green-500 flex items-center justify-center" onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)}>&#9664;</button>
          </li>
          {pageNumbers.map(number => (
            <li key={number} className="page-item">
              <button onClick={() => setCurrentPage(number)} className={`w-10 h-10 rounded-full border border-green-500 text-green-500 flex items-center justify-center ${currentPage === number ? 'bg-green-500 text-white' : 'text-black'}`}>
                {number}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button className="w-10 h-10 rounded-full border border-green-500 text-green-500 flex items-center justify-center" onClick={() => setCurrentPage(currentPage === Math.ceil(books.length / PerPage) ? currentPage : currentPage + 1)}>&#9654;</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
);
          }
