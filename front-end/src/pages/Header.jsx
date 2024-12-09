import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenu = [
  ];
  
  return (
    <div className="navbar bg-green-500 h-20 mx-auto flex items-center justify-between">  
  {user ? (
    <div className="dropdown dropdown-end">
      <div className='flex'>
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-30 rounded-full">
            <img alt="Avatar" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" className="mr-20 w-42 h-16 rounded-full"/>
          </div>
        </div>
        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-[300px] h-[300px] absolute bottom-0 left-0 top-full">
          {userMenu.map(el => (
            <li key={el.to} >
              <Link to={el.to}>{el.text}</Link>
            </li>
          ))}
           <>
          <div>
            <p className="text-[24px]">{user.firstname} {user.lastname}</p>
          </div>
          

          <li>
            <Link to={`/userprofile/${user.id}`} className="mt-5 text-[20px]" >ข้อมูลบัญชีของฉัน</Link>
          </li>

          <li>
            <Link to="/order" className="mt-2 text-[20px]">การสั่งซื้อ</Link>
          </li>
             
          <li>
            <a className="mt-2 text-[20px]">ประวัติการสั่งซื้อ</a>
          </li>

          <li>
            <Link to="/shipping-address" className="mt-2 text-[20px]">ที่อยู่สำหรับจัดส่งสินค้า</Link>
          </li>

          <li>
            <Link to="/contact" className="mt-2 text-[20px]">ติดต่อสอบถาม</Link>
          </li>
          
          <li>
            <Link to='#' onClick={handleLogout} className="mt-5 text-[20px] border-2 border-red-500 btn bg-white text-red-500 text-center hover:bg-red-500 hover:border-red-500 hover:text-white">ออกจากระบบ</Link>
          </li>
          </>
        </ul>
      </div>
    </div>
  ) : (
    <div className='flex gap-x-4'>
      <Link to='/login' className="btn bg-green-600 text-white shadow-md hover:bg-white hover:text-green-500 pl-2 ml-3 mt-2 w-64 h-10">เข้าสู่ระบบ/สมัครสมาชิก</Link>
    </div>
  )}

      <Link to='/home' className="btn btn-ghost text-[56px] text-white text-center">Book-Click</Link>

      <div className="flex items-center justify-center">
        <input type="text" placeholder="ค้นหาหนังสือ" className="bg-gray-100 w-[300px] h-[40px] pl-2 rounded-[10px] mx-4"/>
        <Link to='/cart' className="btn bg-green-600 w-32 h-10 rounded-[10px] text-white flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg"  >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <circle cx="9" cy="19" r="2" />
        <circle cx="17" cy="19" r="2" />
        <path d="M17 17h-11v-14h-2" />
        <path d="M6 5l14 1l-1 7h-13" />
    </svg>
    <span className="ml-2">ตระกร้าสินค้า</span>
      </Link>



        <img src="/src/img/icon/bell.png" alt="bell" className="w-[30px] h-[30px] ml-4 mr-5"/>
      </div>
    </div>
  );
}