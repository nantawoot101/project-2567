import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Order() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const { user } = useAuth(null);

    useEffect(() => {
        fetchOrderById();
    }, [user]);

    const fetchOrderById = async () => {
        try {
            const response = await axios.get(`http://localhost:8888/order/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setOrder(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getBackgroundColor = (status) => {
        return status === 'Pending' ? '' : '';
    };

    return (
        <div className={`py-4 px-6 rounded-md ${order ? getBackgroundColor(order.status) : 'bg-gray-50'}`}>
            <h1 className="text-2xl font-bold mb-4">รายการสั่งซื้อสินค้า</h1>
            {order && (
                <table className="w-full border-collapse border border-gray-300">
                    <td className="p-2 font-semibold">รหัสคำสั่งซื้อ:</td>
                    <td className="p-2 font-semibold">วันสั่ง:</td>
                    <td className="p-2 font-semibold">จำนวนเงินทั้งหมด:</td>
                    <td className="p-2 font-semibold">สถานะ:</td>
                    <tbody>
                            <td className="p-2">{order.id}</td>
                            
                            <td className="p-2">{new Date(order.order_date).toLocaleString()}</td>
                            
                            <td className="p-2">{order.total_amount}</td>
                            
                            <td className="p-2">{order.status}</td>
                    </tbody>
                </table>
            )}
        </div>
    );
}