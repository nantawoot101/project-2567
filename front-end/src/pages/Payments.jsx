import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom'; // เพิ่ม Link เข้ามา
import axios from 'axios';
import useAuth from '../hooks/useAuth'; 
import { useParams } from 'react-router-dom';


const qrCodeImg = '/src/img/payment/PromptPay.jpg';

export default function Payments() {
  const [slipImg, setSlipImg] = useState(null);
  const [payment_method, setPaymentMethod] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const totalPrice = queryParams.get('totalPrice');
  const shippingCost = queryParams.get('shippingCost');
  const totalCost = queryParams.get('totalCost');
  const [shippingAddress, setShippingAddress] = useState([]);
  const { user } = useAuth(null);
  const { id } = useParams();
  const [slipImgUrl, setSlipImgUrl] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  

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
  }, [user]);




  const handleAddressChange = (event) => {
    const addressId = event.target.value;
    setSelectedAddressId(addressId);
    const selectedAddress = findShippingAddress(addressId);
    setSelectedAddress(selectedAddress);
  };

  const findShippingAddress = (addressId) => {
    return shippingAddress.find(address => address.id === parseInt(addressId));
  };


  const handleSlipChange = (e) => {
    const selectedSlip = e.target.files[0];
    setSlipImg(selectedSlip);
    setSlipImgUrl(URL.createObjectURL(selectedSlip));
    setPaymentMethod("Bank");
  };


  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (!user) {
          console.error('No user logged in');
          return;
        }
  
        const response = await axios.get(`http://localhost:8888/cart/getCart`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCartItems(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchCartItems();
  }, [user]); // เพิ่ม user เป็น dependency
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        console.error('No user logged in, redirecting to login...');
        // จัดการการเข้าสู่ระบบที่ไม่ถูกต้อง  เช่น การ redirect ไปยังหน้า login
        return;
      }
  
      const orderDate = {
        orderDate: new Date(),
        total_amount: totalCost,
        payment_method,
        status: "Pending",
        amount: totalPrice,
        payment_img: slipImgUrl,
        cartId: cartItems.map(item => item.id), // ใช้ map เพื่อดึงเฉพาะ ID ของ cartItems
        shippingAddressId: selectedAddressId, // ใช้ selectedAddressId ที่เก็บ ID ของที่อยู่ที่ถูกเลือก
        userId: user.id,
      };
  
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, redirecting to login...');
        // จัดการการเข้าสู่ระบบที่ไม่ถูกต้อง  เช่น การ redirect ไปยังหน้า login
        return;
      }
  
      const response = await axios.post('http://localhost:8888/order/new', orderDate, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Payment submitted:', response.data);
      
      alert('ยืนยันการสั่งซื้อสำเร็จ');
      // ทำอย่างอื่นต่อที่ต้องการหลังจากการส่งข้อมูลสำเร็จ
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert("เกิดข้อผิดพลาด");
      // จัดการข้อผิดพลาดตามที่ต้องการ
    }
  };
  
  return (
    <div>
      <h1 className="mt-10 text-center text-[42px] mb-2">ชำระเงิน</h1>
      <hr className="" />
      {/* สรุปยอดรายการสั่งซื้อ */}
      <form onSubmit={handleSubmit} >
      <div className="flex justify-start mt-10 ml-10">
        <div className="">
          {/* ส่วนของช่องทางการชำระเงิน */}
          <div className="w-[800px] bg-white rounded-lg shadow-lg overflow-hidden mr-10 ">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold mb-2">ช่องทางการชำระเงิน</h1>
              <hr className="mb-4" />
              <div className="flex flex-col space-y-2">
                {/* ตัวเลือกชำระเงินปลายทาง */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M3 11a9 9 0 0118 0v5a1 1 0 01-1 1H4a1 1 0 01-1-1v-5z"></path>
                      <path d="M7 11V9a5 5 0 019.9-1"></path>
                    </svg>
                    <p>ชำระเงินปลายทาง</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={payment_method === "Pay_on_delivery"}
                    onChange={() => setPaymentMethod("Pay_on_delivery")}
                  />
                </div>
                {/* ตัวเลือกชำระเงินผ่านธนาคาร */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {/* รูปแบบของธนาคารให้ใช้รูปอาคารของธนาคาร */}
                      <path
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 2L2 7v10a2 2 0 002 2h16a2 2 0 002-2V7l-10-5z"
                      ></path>
                      <rect x="9" y="14" width="6" height="2"></rect>
                    </svg>
                    <p>บัญชีธนาคาร</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={payment_method === "Bank"}
                    onChange={() => setPaymentMethod("Bank")}
                  />
                </div>
                {/* แสดงรายละเอียดบัญชีธนาคารเมื่อเลือกชำระเงินผ่านธนาคาร */}
                {payment_method === "Bank" && (
                  <div>
                    <div className="flex items-center mt-1">
                      <img src="/src/img/payment/SCB.png" alt="SCB" className="w-15 h-6 mr-2 " />
                      <p>บัญชีธนาคาร: ไทยพาณิชย์</p>
                    </div>
                    <p>เลขบัญชี: 4351185882</p>
                    <p>นันธวุฒิ บุญเหลี่ยม</p>
                    <label className="block">หลักฐานการโอนเงิน</label>
                    <input type="file" accept="image/*" onChange={handleSlipChange} />
                    <div className="flex items-center">
                      <img src={slipImgUrl} className="w-64 h-64 mr-2 mt-4" />
                    </div>
                  </div>
                )}
                {/* ตัวเลือกชำระเงินผ่านการสแกน QR Code */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h3m12 0h3M3 12h3m0 6h18M12 21v-3m0-12V3m0 18v-3m-6-6H3M9 9h3m6 0h3M9 21h3m6-12h3M9 3h3m6 12h3m-3-6h3m-3 6h3m-12-6h3m-3 6h3"
                      ></path>
                    </svg>
                    <p>สแกน QR CODE</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={payment_method === "QR_CODE"}
                    onChange={() => setPaymentMethod("QR_CODE")}
                  />
                </div>
                {/* แสดง QR Code เมื่อเลือกชำระเงินผ่านการสแกน QR Code */}
                {payment_method === "QR_CODE" && (
                  <div className="flex flex-col items-center">
                    <img src={qrCodeImg} alt="QR Code" className="w-[500px] h-[500px]" />
                    <label className="block">หลักฐานการโอนเงิน</label>
                    <input type="file" accept="image/*" onChange={handleSlipChange} />
                    <img src={slipImgUrl} className="w-64 h-64 mr- mt-5" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-10 ml-10">
            {/* เลือกที่อยู่จาก select */}
            <select onChange={handleAddressChange} className="text-[24px] border-[2px] p-2 rounded-md">
              <option value="">โปรดเลือกที่อยู่</option>
              {shippingAddress.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.recipient_fname} {address.recipient_lname}
                </option>
              ))}
            </select>
          </div>
          

          {/* แสดงข้อมูลที่อยู่ที่เลือก */}
          {selectedAddress && (
            <div className="border p-4 w-[500px] rounded-md mt-5 bg-white">
              <p><span className="font-semibold">ชื่อ-สกุล:</span> {selectedAddress.recipient_fname} {selectedAddress.recipient_lname}</p>
              <p><span className="font-semibold">ที่อยู่:</span> {selectedAddress.shipping_address}</p>
              <p><span className="font-semibold">ตำบล:</span> {selectedAddress.district}</p>
              <p><span className="font-semibold">อำเภอ/เขต:</span> {selectedAddress.prefecture}</p>
              <p><span className="font-semibold">จังหวัด:</span> {selectedAddress.province}</p>
              <p><span className="font-semibold">รหัสไปรษณีย์:</span> {selectedAddress.zip_code}</p>
              <p><span className="font-semibold">เบอร์โทรศัพท์:</span> {selectedAddress.phone}</p>
            </div>
          )}
        </div>
            <div className="border-green-500 border-[1px] rounded-lg p-4  mr-10 ml-10">
              <h1 className="text-xl font-semibold mt-3">สรุปยอดรายการสั่งซื้อ</h1>
              {cartItems.map((item) => (
            <div key={item.id} className="flex items-center mb-4 mt-3">
              <img
                className="h-20 w-20 rounded-md mr-4"
                src={`http://localhost:8888/product/${item.book.bookimg}`}
                alt={item.book.title}
              />
                <div className="text-sm font-medium text-gray-900">{item.book.title} จำนวน {item.cart_quantity} รายการ</div>
            </div>
          ))}
              <p className="mt-3">ยอดรวม: {totalPrice}</p>
              <p className="mt-3">ค่าจัดส่ง: {shippingCost}</p>
              <hr className="mt-3"/>
              <h1 className="text-xl font-semibold mt-3">ยอดรวมสุทธิ: {totalCost}</h1>
              <button type="submit" className="btn bg-green-500 text-white mt-5 w-[460px]">ยืนยันการสั่งซื้อ</button>
            </div>
      </div>
      </form>
      
    </div>
  );
}
