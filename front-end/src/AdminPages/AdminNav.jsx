import useAuth from "../hooks/useAuth";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

export default function AdminNav() {
    const navigate = useNavigate()
    const {logout} = useAuth()
  
    const hdlLogout = () => {
      logout()
      navigate('/')
    }
    
    return (
      <nav className='sticky left-0 flex flex-col w-2/12 h-screen px-4 gap-y-6 bg-gray-100'>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">เมนูจัดการ</h2>
          <div className="space-y-2">
            <Link to="/home" className="block py-2 rounded-md text-sm font-medium hover:bg-gray-200 hover:text-gray-900 focus:outline-none px-4">Dashboard</Link>
            <Link to="/productfrom" className="block py-2 rounded-md text-sm font-medium hover:bg-gray-200 hover:text-gray-900 focus:outline-none px-4">สินค้า</Link>
            <Link to="/promote-fromadmin" className="block py-2 rounded-md text-sm font-medium hover:bg-gray-200 hover:text-gray-900 focus:outline-none px-4">โปรโมท</Link>
            <button className="block py-2 rounded-md text-sm font-medium hover:bg-gray-200 hover:text-gray-900 focus:outline-none px-4">คำสั่งซื้อ</button>
            <button className="block py-2 rounded-md text-sm font-medium hover:bg-gray-200 hover:text-gray-900 focus:outline-none px-4">การชำระเงิน</button>
          </div>
        </div>
        
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">การจัดการผู้ใช้</h2>
          <div className="space-y-2">
            <Link to="/userdata" className="block py-2 rounded-md text-sm font-medium hover:bg-gray-200 hover:text-gray-900 focus:outline-none px-4">ข้อมูลผู้ใช้</Link>
            <Link to="/admindata" className="block py-2 rounded-md text-sm font-medium hover:bg-gray-200 hover:text-gray-900 focus:outline-none px-4">ข้อมูลแอดมิน</Link>
          </div>
        </div>
        
        <Link to='#' onClick={hdlLogout} className='btn bg-white text-red-600 border-[2px] border-red-600 hover:bg-red-500 hover:text-white pl-2 mt-auto'>ออกจากระบบ</Link>
      </nav>
    )
}