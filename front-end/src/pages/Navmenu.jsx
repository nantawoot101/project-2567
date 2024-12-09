import { Link } from "react-router-dom";


export default function Navmenu(){


    return (
      <nav className="flex justify-center items-center py-4 px-8 bg-gray-100">
      <div>
      <form>
        <label className="flex justify-center">
          <select className="w-full h-10 max-w-xs pl-2 text-lg text-center bg-gray-100" name="Book">
            <option value="">หนังสือทั้งหมด</option>
            <option value="">หนังสือเรียน</option>
            <option value="/novel">นิยาย</option>
            <option value="">หนังสือการ์ตูน</option>
          </select>
        </label>
      </form>

        <Link to="/home" className="mr-4">หน้าแรก</Link>
        <Link to="/selling-well" className="mr-4">ขายดี</Link>
        <Link to="/new-areival" className="mr-4">มาใหม่</Link>
        <Link to="#" className="mr-4">โปรโมชั่น</Link>
        <Link to="/recommend" className="mr-4">แนะนำ</Link>
      </div>
      
    </nav>
  );
}
