import React from 'react';

const AdminDashboard = () => {
    const monthSalesData = [
        { month: 'January', totalRevenue: '฿10,000', totalQuantitySold: 100 },
        { month: 'February', totalRevenue: '฿15,000', totalQuantitySold: 150 },
        { month: 'March', totalRevenue: '฿12,000', totalQuantitySold: 120 },
        { month: 'April', totalRevenue: '฿20,000', totalQuantitySold: 200 },
    ];

    const dailySalesData = [
        { date: '2024-04-01', totalRevenue: '฿1000', totalQuantitySold: 5 },
        { date: '2024-04-02', totalRevenue: '฿5000', totalQuantitySold: 10 },
        { date: '2024-04-03', totalRevenue: '฿2000', totalQuantitySold: 10 },
        { date: '2024-04-04', totalRevenue: '฿5000', totalQuantitySold: 15 },
        { date: '2024-04-05', totalRevenue: '฿2500', totalQuantitySold: 10 },
        { date: '2024-04-06', totalRevenue: '฿2000', totalQuantitySold: 15 },
        { date: '2024-04-07', totalRevenue: '฿2500', totalQuantitySold: 5 },
    ];

    // คำนวณยอดรวมของรายวัน
    let totalDailyRevenue = 0;
    let totalDailyQuantitySold = 0;
    dailySalesData.forEach((sale) => {
        totalDailyRevenue += parseFloat(sale.totalRevenue.replace('฿', '').replace(',', ''));
        totalDailyQuantitySold += sale.totalQuantitySold;
    });

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mt-10 mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">ยอดขายรายเดือน</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">เดือน</th>
                                    <th className="px-4 py-2">รายได้รวม</th>
                                    <th className="px-4 py-2">จำนวนที่ขายได้</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthSalesData.map((sale, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{sale.month}</td>
                                        <td className="border px-4 py-2">{sale.totalRevenue}</td>
                                        <td className="border px-4 py-2">{sale.totalQuantitySold}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">ยอดขายรายวัน (เดือนเมษายน 2024)</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">วันที่</th>
                                    <th className="px-4 py-2">รายได้รวม</th>
                                    <th className="px-4 py-2">จำนวนที่ขายได้</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailySalesData.map((sale, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{sale.date}</td>
                                        <td className="border px-4 py-2">{sale.totalRevenue}</td>
                                        <td className="border px-4 py-2">{sale.totalQuantitySold}</td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-200">
                                    <td className="border px-4 py-2 font-semibold">รวม</td>
                                    <td className="border px-4 py-2 font-semibold">฿{totalDailyRevenue.toLocaleString()}</td>
                                    <td className="border px-4 py-2 font-semibold">{totalDailyQuantitySold}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
