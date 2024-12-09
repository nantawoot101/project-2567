import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function UserData() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8888/users');
        const filteredUsers = response.data.filter(user => user.role === 'User');
        setUsers(filteredUsers);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      }
    };

    fetchData();
  }, []);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8888/users/${id}`);
      const response = await axios.get('http://localhost:8888/users/');
      alert("ลบข้อมูลสำเร็จ")
      setUsers(response.data);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };



    
    return (
        <div>
            <h2 className="text-xl font-bold">ข้อมูลผู้ใช้</h2>
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
                        <th className="border border-gray-400 px-4 py-2">แก้ไขข้อมูล</th> 
                        <th className="border border-gray-400 px-4 py-2">ลบข้อมูล</th> 
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td className="border border-gray-400 px-4 py-2">{user.id}</td>
                            <td className="border border-gray-400 px-4 py-2">{user.firstname}</td>
                            <td className="border border-gray-400 px-4 py-2">{user.lastname}</td>
                            <td className="border border-gray-400 px-4 py-2">{user.gender === 'male' ? 'ชาย' : user.gender === 'female' ? 'หญิง' : 'อื่นๆ'}</td>
                            <td className="border border-gray-400 px-4 py-2">{user.email}</td>
                            <td className="border border-gray-400 px-4 py-2">{user.phone}</td>
                            <td className="border border-gray-400 px-4 py-2">{user.address}</td>
                            <td className="border border-gray-400 px-4 py-2">{user.username}</td>
                            <td className="border border-gray-400 px-4 py-2">{user.password}</td>
                            <td className="border border-gray-400 px-4 py-2">
                            <Link to={`/editdata/${user.id}`} className="text-blue-600 hover:underline">แก้ไข</Link>
                            </td>
                            <td className="border border-gray-400 px-4 py-2">
                                <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline">ลบ</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
