import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth'; // Import your authentication hook
import { Link } from 'react-router-dom';

export default function Cart() {
    const { userId } = useAuth(); // Get the userId and setUserId from your authentication hook
    const [cartItems, setCartItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false); // State for selecting all items
    const [selectedItems, setSelectedItems] = useState([]); // State for selected items
    
    useEffect(() => {
        const fetchCartItems = async () => {
          try {
            const response = await axios.get(`http://localhost:8888/cart/getCart/`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCartItems(response.data);
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchCartItems();
    }, [userId]);

    const updateQuantity = async (id, quantity) => {
        if (quantity <= 0) {
          return;
        }
        
        try {
          const response = await axios.put(`http://localhost:8888/cart/updateCart/${id}`, {
            cart_quantity: quantity
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setCartItems(
            cartItems.map((item) =>
              item.id === id ? { ...item, cart_quantity: response.data.cart_quantity } : item
            )
          );
        } catch (error) {
          console.error(error);
        }
    }
      
    const deleteCart = async (id) => {
        try {
          await axios.delete(`http://localhost:8888/cart/deleteCart/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setCartItems(cartItems.filter((item) => item.id !== id));
        } catch (error) {
          console.error(error);
        }
    }

    // สรุปยอดรายการสั่งซื้อ
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
    const totalPrice = selectedCartItems.reduce((acc, item) => acc + (item.book.price * item.cart_quantity), 0);
    const shippingCost = 50; // ค่าจัดส่ง
    const totalCost = totalPrice + shippingCost;

    // ฟังก์ชั่นสำหรับเลือกรายการสินค้าทั้งหมด
    const toggleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedItems(cartItems.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    }

    
    // ฟังก์ชั่นสำหรับเลือกรายการสินค้าแต่ละรายการ
    const toggleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    }

    return (
        <div>
            <h1 className="text-3xl mt-10 text-center">ตระกร้า</h1>
            <h2 className="text-lg mt-4 mb-2 text-center text-gray-400">เลือกหนังสือที่ต้องการชำระเงิน</h2>
            <div className="mt-4 border-b border-gray-300 max-w-[80%] mx-auto"></div>
            {cartItems.length === 0 ? (
                <h2 className="text-lg mt-5 mb-2 text-center text-red-500">ไม่พบสินค้าในตะกร้า</h2>
            ) : (
                <div className="overflow-x-auto mt-10 ml-20">
                    <div className="flex justify-between">
                        <table className=" divide-y divide-gray-200  border-gray-200 border-[1px]">
                            
                            <thead className="bg-gray-50 ">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={toggleSelectAll}
                                            className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                        />
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        สินค้า
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ราคา
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        จำนวน
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ราคารวม
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ลบสินค้า
                                    </th>
                                </tr>
                            </thead>
                            
                            <tbody className="bg-white divide-y divide-gray-200 ">
                                {cartItems.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => toggleSelectItem(item.id)}
                                                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-20 w-20">
                                                    <img className="h-full w-full rounded-md" src={`http://localhost:8888/product/${item.book.bookimg}`} alt={item.book.title} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.book.title}</div>
                                                    <div className="text-sm text-gray-500">ชื่อผู้แต่ง:{item.book.author}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.book.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap ">
                                            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l" onClick={() => updateQuantity(item.id, item.cart_quantity - 1)}>-</button>
                                            <span className="mx-2">{item.cart_quantity}</span>
                                            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r" onClick={() => updateQuantity(item.id, item.cart_quantity + 1)}>+</button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.book.price * item.cart_quantity}</td>
                                        <td>
                                            <button className="text-red-500 text-center" onClick={() => deleteCart(item.id)}>ลบ</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    <div className="flex justify-end">
                        <div className="border-green-500 border-[1px] rounded-lg p-4 w-[500px] h-[300px] mr-10 ">
                            <h1 className="text-xl font-semibold mt-3">สรุปยอดรายการสั่งซื้อ</h1>
                            <p className="mt-3">ยอดรวม: {totalPrice}</p>
                            <p className="mt-3">ค่าจัดส่ง: {shippingCost}</p>
                            <hr className="mt-3"/>
                            <h1 className="text-xl font-semibold mt-3">ยอดรวมสุทธิ: {totalCost}</h1>
                            <Link to={`/payments?totalPrice=${totalPrice}&shippingCost=${shippingCost}&totalCost=${totalCost}`} className="btn bg-green-500 text-white mt-5 w-[460px]">ดำเนินการสั่งซื้อ</Link>
                        </div>
                    </div>
                        
                    </div>
                </div>
            )}
        </div>
    );
}
