
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Promote() {
    const [promotes, setPromotes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [promotesPerPage] = useState(3);

    useEffect(() => {
        const fetchPromotes = async () => {
            try {
                const response = await axios.get('http://localhost:8888/promotes/');
                setPromotes(response.data);
            } catch (error) {
                console.error('Error fetching promotes:', error);
            }
        };

        fetchPromotes();
    }, []);

    const indexOfLastPromote = currentPage * promotesPerPage;
    const indexOfFirstPromote = indexOfLastPromote - promotesPerPage;
    const currentPromotes = promotes.slice(indexOfFirstPromote, indexOfLastPromote);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="grid grid-cols-3 gap-4 mt-3">
                {currentPromotes.map((promote, index) => (
                    <div key={index} className="">
                        <Link to={`/book-details/${promote.bookId}`}>
                            <img src={`http://localhost:8888/promote/${promote.promote_img}`} alt={promote.promote_name} className="mb-3 w-[600px] h-[300px] object-cover rounded-md" />
                        </Link>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <nav>
                    <ul className="pagination flex items-center space-x-4">
                        <li className="page-item">
                            <button className="w-10 h-10 rounded-full border  border-green-500 text-green-500 flex items-center justify-center" onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)}>&#9664;</button>
                        </li>
                        {Array.from({ length: Math.ceil(promotes.length / promotesPerPage) }).map((_, index) => (
                            <li key={index} className="page-item">
                                <button onClick={() => paginate(index + 1)} className={`w-10 h-10 rounded-full border border-green-500 text-green-500 flex items-center justify-center ${currentPage === index + 1 ? 'bg-green-500 text-white' : 'text-black'}`}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li className="page-item">
                            <button className="w-10 h-10 rounded-full border  border-green-500 text-green-500 flex items-center justify-center" onClick={() => setCurrentPage(currentPage === Math.ceil(promotes.length / promotesPerPage) ? currentPage : currentPage + 1)}>&#9654;</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}