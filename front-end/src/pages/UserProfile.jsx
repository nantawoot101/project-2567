import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // ดึง token จาก localStorage
        if (!token) {
          // ถ้าไม่มี token ใน localStorage ให้กลับไปหน้าล็อกอินหรือทำการจัดการตามที่เหมาะสม
          console.error('No token found, redirecting to login...');
          // ทำการ redirect หรือจัดการตามที่ต้องการ
          return;
        }
        const response = await axios.get(`http://localhost:8888/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // ทำการจัดการเรื่องของ error ได้ตามที่เหมาะสม เช่น แสดงข้อความแจ้งเตือน
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // แปลงค่า gender เป็นข้อความที่แสดงความหมายตามที่ต้องการ
  let genderText = "";
  if (user.gender === "male") {
    genderText = "ผู้ชาย";
  } else if (user.gender === "female") {
    genderText = "ผู้หญิง";
  } else {
    genderText = "อื่นๆ";
  }

  return (
    <div>
        <h1 className="text-center text-[36px] mt-10">จัดการข้อมูลผู้ใช้</h1>
        <div className="ml-10 mt-5 text-[36px] flex items-center">
          <h1>{user.username}</h1>
          <div className="ml-auto">
            <Link to={`/editdata/${user.id}`} className="btn border border-green-500 p-4 rounded-10 bg-white mr-10">แก้ไขข้อมูลส่วนตัว</Link>
          </div>
        </div>
        <div className='border p-4 rounded-md bg-gray-100 w-[1300px] text-[24px] mt-10 mx-auto'>
          <p><span className="font-semibold">Username:</span> {user.username}</p>
          <p><span className="font-semibold">ชื่อจริง:</span> {user.firstname}</p>
          <p><span className="font-semibold">นามสกุล:</span> {user.lastname}</p>
          <p><span className="font-semibold">เพศ:</span> {genderText}</p>
          <p><span className="font-semibold">เบอร์โทรศัพท์:</span> {user.phone}</p>
          <p><span className="font-semibold">อีเมล:</span> {user.email}</p>
          <p><span className="font-semibold">ที่อยู่:</span> {user.address}</p>
        </div>
        
    </div>
  );
}
