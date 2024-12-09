import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function ShippingAddressForm() {
  const [shippingAddress, setShippingAddress] = useState();
  const { user } = useAuth(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          console.error('No user logged in');
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found, redirecting to login...');
          return;
        }

        const shippingResponse = await axios.get(`http://localhost:8888/shipping/alluserId`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Shipping data:', shippingResponse.data); // Log fetched data
        setShippingAddress(shippingResponse.data);
      } catch (error) {
        console.error('Error fetching shipping data:', error);
        // Handle error appropriately (display message, redirect, etc.)
      }
    };

    fetchData();
  }, [user]); // Add userId to the dependency array

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8888/shipping/${id}`);
      const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found, redirecting to login...');
          return;
        }

        const shippingResponse = await axios.get(`http://localhost:8888/shipping/alluserId`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Shipping data:', shippingResponse.data); // Log fetched data
        setShippingAddress(shippingResponse.data);
      alert("ลบข้อมูลสำเร็จ")
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  return (
    <div>
      <h1 className="text-[36px] ml-[120px] mt-10 text-center">ที่อยู่สำหรับจัดส่งสินค้า</h1>
      <hr className="border-[1px]" />
      <div className="mt-15">
      <div className="flex justify-end mr-10 mt-10">
    <Link to="/newshipping-address" className="btn border border-green-500 rounded-10 bg-white mr-20">+ เพิ่มที่อยู่สำหรับจัดส่งสินค้า</Link>
      </div>
        <div className="border p-4 rounded-md bg-gray-50 w-[1300px] text-[24px] mt-10 mx-auto" >
        {shippingAddress && shippingAddress.map((shippingAddress, index) => (
          <div key={index} className="border p-4 rounded-md mt-10 bg-white">
            <p><span className="font-semibold">ชื่อ-สกุล:</span> {shippingAddress.recipient_fname} {shippingAddress.recipient_lname}</p>
            <p><span className="font-semibold">ที่อยู่:</span> {shippingAddress.shipping_address}</p>
            <p><span className="font-semibold">ตำบล:</span> {shippingAddress.district}</p>
            <p><span className="font-semibold">อำเภอ/เขต:</span> {shippingAddress.prefecture}</p>
            <p><span className="font-semibold">จังหวัด:</span> {shippingAddress.province}</p>
            <p><span className="font-semibold">รหัสไปรษณีย์:</span> {shippingAddress.zip_code}</p>
            <p><span className="font-semibold">เบอร์โทรศัพท์:</span> {shippingAddress.phone}</p>
            <Link to ={`/edit-shipping/${shippingAddress.id}`}
              type="button"
              className="btn bg-green-500 transition duration-300 hover:bg-green-600 text-white max-w-xs w-[150px] h-10 rounded rounded-20 mr-2"
            >
              แก้ไขข้อมูล
            </Link>

            <button 
              type="button"
              className="btn bg-red-600 transition duration-300 hover:bg-red-500 text-white max-w-xs w-[150px] h-10 rounded rounded-20"
              onClick={() => handleDelete(shippingAddress.id)}
            >
              ลบข้อมูล
            </button>

          </div>
    ))}
        </div>
      </div>
    </div>
  );
}

