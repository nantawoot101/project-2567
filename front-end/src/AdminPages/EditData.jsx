import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function EditData() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    address: '',
    gender: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('ไม่พบ token ใน localStorage');
          return;
        }
        const response = await axios.get(`http://localhost:8888/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    
    if (id) {
      fetchUser();
    }
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('ไม่พบ token ใน localStorage');
        return;
      }
  
      const response = await axios.put(
        `http://localhost:8888/users/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (response.status === 200) {
        alert('แก้ไขข้อมูลสำเร็จ');
        // Redirect or do something else upon successful edit
      } else {
        console.error('เกิดข้อผิดพลาด:', response.data);
        // Show appropriate error message
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูล:', error.message);
      // Show appropriate error message
    }
  };
    
  return (
    <div className="p-5 border w-4/6 min-w-[1000px] mx-auto rounded mt-5">
      <div className="text-3xl mb-10 text-center">แก้ไขข้อมูลผู้ใช้</div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">ชื่อจริง</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
        </label>

        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">นามสกุล</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
        </label>

        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">เพศ</span>
          </div>
          <select
            className="select select-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">เลือกเพศของคุณ</option>
            <option value="male">ชาย</option>
            <option value="female">หญิง</option>
            <option value="other">อื่นๆ</option>
          </select>
        </label>

        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">Username</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>

        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">Password</span>
          </div>
          <input
            type="password"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">เบอร์โทรศัพท์</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>

        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">อีเมล</span>
          </div>
          <input
            type="email"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">ที่อยู่</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 pl-2"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>

        <div className="flex gap-5">
          <button type="submit" className="btn bg-green-500 transition duration-300 hover:bg-green-600 text-white max-w-xs mx-auto w-[200px] h-10 rounded rounded-20 mr-2">บันทึกข้อมูล</button>
          <button type="button" className="btn bg-red-600 transition duration-300 hover:bg-red-500 text-white max-w-xs mx-auto w-[200px] h-10 rounded rounded-20">ยกเลิก</button>
        </div>
      </form>
    </div>
  );
}