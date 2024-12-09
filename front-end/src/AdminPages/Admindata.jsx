import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminData() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8888/users');
                // กรองข้อมูลเฉพาะผู้ใช้ที่มีบทบาทเป็น User
                const filteredUsers = response.data.filter(user => user.role === 'Admin');
                setUsers(filteredUsers);
            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
            }
        };
    
        fetchData();
    }, []);
    return (
        <div>
            <h2 className="text-xl font-bold">ข้อมูลแอดมิน</h2>
            <table className="border-collapse border border-gray-400">
                <thead>
                    <tr>
                        <th className="border border-gray-400 px-4 py-2">ID</th>
                        <th className="border border-gray-400 px-4 py-2">ชื่อจริง</th>
                        <th className="border border-gray-400 px-4 py-2">นามสกุล</th>
                        <th className="border border-gray-400 px-4 py-2">เพศ</th>
                        <th className="border border-gray-400 px-4 py-2">อีเมล</th>
                        <th className="border border-gray-400 px-4 py-2">เบอร์โทรศัพท์</th>
                        <th className="border border-gray-400 px-4 py-2">ที่อยู่</th>
                        <th className="border border-gray-400 px-4 py-2">ชื่อผู้ใช้</th>
                        <th className="border border-gray-400 px-4 py-2">รหัสผ่าน</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td className="border border-gray-400 px-4 py-2">{user.id}</td>
                            <td className="border border-gray-400 px-4 py-2">{user.firstname}</td>
                            <td className="border border-gray-400 px-4 py-2">{user.lastname}</td>
                            <td className="border border-gray-400 px-4 py-2">{user.gender}</td>
                            <td className="border border-gray-400 px-4 py-2">{user.email}</td>
                            <td className="border border-gray-400 px-4 py-2">{user.phone}</td>
                            <td className="border border-gray-400 px-4 py-2">{user.address}</td>
                            <td className="border border-gray-400 px-4 py-2">{user.username}</td>
                            <td className="border border-gray-400 px-4 py-2">{user.password}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
