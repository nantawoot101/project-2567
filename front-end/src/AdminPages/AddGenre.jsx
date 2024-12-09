import { useState } from 'react';
import axios from 'axios';

export default function AddGenre() {
  const [formData, setFormData] = useState({
    genre_name: ''
  });

  const handleChange = (e) => {
    setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const rs = await axios.post('http://localhost:8888/books/genres', formData);
      console.log(rs)
      if(rs.status === 200) {
        alert('เพิ่มหมวดหมู่สำเร็จ')
      }
    } catch (error) {
      console.error('Error creating genre:', error);
    }
  };

  return (
    <div className="p-5 border w-4/6 min-w-[1000px] mx-auto rounded mt-5">
      <div className="text-3xl mb-10 text-center">เพิ่มหมวดหมู่หนังสือ</div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <label className='form-control w-full max-w-xs mx-auto mb-5'>
        <div className="label">
            <span className="label-text">ชื่อหมวดหมู่</span>
        </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="genre_name"
            value={formData.genre_name}
            onChange={handleChange}
          />
        </label>
        <div className="flex gap-5">
          <button type="submit" className="btn bg-green-500 transition duration-300 hover:bg-green-600 text-white max-w-xs mx-auto w-[200px] h-10 rounded rounded-20 mr-2">เพิ่มหมวดหมู่</button>
          <button type="reset" className="btn bg-red-600 transition duration-300 hover:bg-red-500 text-white max-w-xs mx-auto w-[200px] h-10 rounded rounded-20">ยกเลิก</button>
        </div>
      </form>
    </div>
  );
}