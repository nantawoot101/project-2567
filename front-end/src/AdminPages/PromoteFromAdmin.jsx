import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

export default function PromoteFromAdmin() {
    const [promotes, setPromotes] = useState([]);

    useEffect(() => {
        // เรียกข้อมูลโปรโมชั่นจาก API
        const fetchPromotes = async () => {
            try {
                const response = await axios.get('http://localhost:8888/promotes/');
                setPromotes(response.data);
            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการดึงข้อมูลโปรโมชั่น:', error);
            }
        };

        fetchPromotes();
    }, []);


    const deletePromote = async (id) => {
        try {
            await axios.delete(`http://localhost:8888/promotes/${id}`);
            // หลังจากลบข้อมูลสำเร็จ ให้ดึงข้อมูลสินค้าใหม่
            const response = await axios.get('http://localhost:8888/promotes/');
            setPromotes(response.data);
            alert('ลบข้อมูลโปรโมทสำเร็จ');
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
        }
    };


    return (
        <div>
            <Link to={'/addpromote'} className="btn w-64 rounded-full">เพิ่มการโปรโมท</Link>

            <h2 className="text-xl font-bold mt-5">รายการโปรโมท</h2>
            <div className="grid grid-cols-3 gap-4 mt-3">
                {promotes.map((promote, index) => (
                    <div key={index} className="border p-4 rounded-md">
                        <img src={`http://localhost:8888/promote/${promote.promote_img}`} alt={promote.promote_name} className="mb-3 w-full h-40 object-cover rounded-md" />
                        <button onClick={() => deletePromote(promote.id)} className="btn bg-red-500 text-white">ลบ</button>
                        </div>
                ))}
            </div>
        </div>
    );
}