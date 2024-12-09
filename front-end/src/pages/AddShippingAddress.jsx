import { useState } from 'react';
import axios from 'axios';

export default function AddShippingAddress() {

  const [shippingAddress, setShippingAddress] = useState({
    recipient_fname: '',
    recipient_lname: '',
    shipping_address: '',
    district: '',
    prefecture: '',
    province: '',
    zip_code: '',
    phone: '',
  });

  

  const hdlChange = e => {
    setShippingAddress(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('กรุณาเข้าสู่ระบบเพื่อเพิ่มที่อยู่สำหรับจัดส่ง');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8888/shipping/new`, shippingAddress, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        alert('เพิ่มข้อมูลจัดส่งสำเร็จ')
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มที่อยู่สำหรับจัดส่ง:', error);
      alert('เพิ่มข้อมูลไม่สำเร็จ')
    }
  };

  return (
    <div className="p-5 mt-5">
      <div className="text-3xl mb-10 text-center">
        <h1 className="text-[36px] mt-10 text-center">เพิ่มที่อยู่สำหรับจัดส่งสินค้า</h1>
      </div>
      <form className="flex flex-col gap-2" onSubmit={hdlSubmit}>
        <label className='form-control w-full max-w-xs mx-auto mb-5'>
          <div className="label">
            <span className="label-text">ชื่อผู้รับ</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="recipient_fname"
            placeholder="ชื่อจริง"
            value={shippingAddress.recipient_fname}
            onChange={hdlChange}
          />
        </label>
        <label className='form-control w-full max-w-xs mx-auto mb-5'>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="recipient_lname"
            placeholder="นามสกุล"
            value={shippingAddress.recipient_lname}
            onChange={hdlChange}
          />
        </label>

        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">ที่อยู่</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="shipping_address"
            value={shippingAddress.shipping_address}
            onChange={hdlChange}
          />
        </label>

        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">ตำบล</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="district"
            value={shippingAddress.district}
            onChange={hdlChange}
          />
          <div className="label">
            <span className="label-text">อำเภอ/เขต</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="prefecture"
            value={shippingAddress.prefecture}
            onChange={hdlChange}
          />
          <div className="label">
            <span className="label-text">จังหวัด</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="province"
            value={shippingAddress.province}
            onChange={hdlChange}
          />
        </label>

        <label className="form-control w-full max-w-xs mx-auto mb-5">
          <div className="label">
            <span className="label-text">รหัสไปรษณี</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="zip_code"
            value={shippingAddress.zip_code}
            onChange={hdlChange}
          />
          <div className="label">
            <span className="label-text">เบอร์โทรศัพท์</span>
          </div>
          <input
            type="text"
            className="input input-bordered border-2 rounded rounded-20 w-full h-10 max-w-xs pl-2"
            name="phone"
            value={shippingAddress.phone}
            onChange={hdlChange}
          />
        </label>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button type="submit" className="btn bg-green-500 text-white mt-5">เพิ่มที่อยู่</button>
          <button className="btn bg-green-500 text-white mt-5">ยกเลิก</button>
        </div>

      </form>
    </div>
  );
}
