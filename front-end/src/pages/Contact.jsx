import Navmenu from "./Navmenu";
import axios from "axios"; 
import { useState } from 'react';



export default function Contact() {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8888/contact", contact);
      console.log(response.data);
      alert("ส่งข้อความสำเร็จ");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการส่งข้อความ:", error);
      alert("เกิดข้อผิดพลาดในการส่งข้อความ");
    }
  };

  return (
    <div>
      <Navmenu />
      <div className="ml-5 mr-5 mt-5 flex justify-around bg-gray-500">
        <div className="w-[500px] mx-[20px]">
          <div className="my-4 text-white">ช่องทางการติดต่อ</div>
          <hr />
          <div className="my-4">
            <form onSubmit={handleSubmit}>
              <label className="form-control w-full max-w-xs mx-auto mb-5">
                <div className="label">
                  <span className="label-text text-white">ชื่อ</span>
                </div>
                <input
                  type="text"
                  className="input input-bordered border-2  rounded rounded-20 w-full h-10 max-w-xs pl-2 "
                  name="name"
                  placeholder="ชื่อ"
                  value={contact.name}
                  onChange={handleChange}
                />
              </label>

              <label className="form-control w-full max-w-xs mx-auto mb-5">
                <div className="label">
                  <span className="label-text text-white">อีเมล</span>
                </div>
                <input
                  type="email"
                  className="input input-bordered border-2  rounded rounded-20 w-full h-10 max-w-xs pl-2"
                  name="email"
                  placeholder="อีเมล"
                  value={contact.email}
                  onChange={handleChange}
                />
              </label>

              <label className="form-control w-full max-w-xs mx-auto mb-5">
                <div className="label">
                  <span className="label-text text-white">เบอร์โทรศัพท์</span>
                </div>
                <input
                  type="number"
                  className="input input-bordered border-2  rounded rounded-20 w-full h-10 max-w-xs pl-2 "
                  name="phoneNumber"
                  placeholder="เบอร์โทรศัพท์"
                  value={contact.phoneNumber}
                  onChange={handleChange}
                />
              </label>
              <label className="form-control w-full max-w-xs mx-auto mb-5">
                <div className="label">
                  <span className="label-text text-white">ข้อความ</span>
                </div>
                <input
                  type="text"
                  className="input input-bordered border-2  rounded rounded-20 w-full h-10 max-w-xs pl-2 "
                  name="message"
                  placeholder="ข้อความ"
                  value={contact.message}
                  onChange={handleChange}
                />
              </label>
              <div className="flex justify-center items-center">
                <button
                    type="submit"
                    className="btn bg-green-500 transition duration-300 hover:bg-green-600 text-white max-w-xs w-[150px] h-10 rounded rounded-20 mr-2"
                >
                    ส่งข้อความ
                </button>
                <button
                    type="reset"
                    className="btn bg-red-600 transition duration-300 hover:bg-red-500 text-white max-w-xs w-[150px] h-10 rounded rounded-20"
                >
                    ยกเลิก
                </button>
                </div>

            </form>
          </div>
        </div>

        <div className="border-x-[1px]"></div>

        <div className="w-[500px] mx-[20px]">
          <div className="my-4 text-white">ติดต่อสอบถามข้อมูลเพิ่มเติม</div>
          <hr />
          <div className="my-4">
            <img src="/src/img/contact.jpg" alt="contact" />
          </div>
        </div>
      </div>
    </div>
  );
}
