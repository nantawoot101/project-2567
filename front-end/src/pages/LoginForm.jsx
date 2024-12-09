import axios from 'axios'
import {useState} from "react";
import useAuth from '../hooks/useAuth'
import { Link } from 'react-router-dom';

export default function LoginForm() {
  const { setUser } = useAuth()
  const [input, setInput] = useState({
    username : '', 
    password : ''
  })

  const hdlChange = e => {
    setInput( prv => ( { ...prv, [e.target.name] : e.target.value } ) )
  }

  const hdlSubmit = async e => {
    try {
      e.preventDefault()
      
      const rs = await axios.post('http://localhost:8888/auth/login', input)
      console.log(rs.data.token)
      localStorage.setItem('token', rs.data.token)
      const rs1 = await axios.get('http://localhost:8888/auth/me', {
        headers : { Authorization : `Bearer ${rs.data.token}` }
      })
      console.log(rs1.data)
      setUser(rs1.data)
      
    }catch(err) {
      console.log('เกิดข้อผิดพลาดในการดึงข้อมูล:', err.message)
    }
  }
    return(
      <div className="p-5 border w-4/6 min-w-[500px] mx-auto rounded mt-5 ">
      <div className="text-3xl mb-5 text-center">เข้าสู่ระบบ</div>
      <form className="flex flex-col gap-2" onSubmit={hdlSubmit}>
      <div className="flex flex-col gap-5 justify-center items-center">
  <label className="form-control w-full max-w-xs mt-5">
    <input
      type="text"
      className="input input-bordered w-full max-w-xs"
      name="username"
      placeholder="Username"
      value={input.username}
      onChange={hdlChange}
    />
  </label>

  <label className="form-control w-full max-w-xs">
    <input
      type="password"
      className="input input-bordered w-full max-w-xs"
      name="password"
      placeholder="Password"
      value={input.password}
      onChange={hdlChange}
    />
  </label>

  <div className="flex  justify-center">
    <button type="submit" className="btn bg-green-600 border-white border-[2px] text-white shadow-md hover:shadow-white hover:border-green-500 hover:text-green-500 pl-2 ml-3 mt-5 w-64 h-10">
      เข้าสู่ระบบ
    </button>
  </div>

  <div className="flex items-center  justify-center">
      <p >ยังไม่มีบัญชีใช่หรือไม่?</p>
      <Link to='/register' className='bg-green-500 border-[2px] border-white rounded-[10px] w-[100px] h-[30px] text-center ml-3 text-white hover:bg-white hover:text-green-500 hover:border-green-500'>สมัครใหม่</Link>
    </div>   

</div>
            </form>
        </div>
    )
}