import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom'
import LoginForm from '../pages/LoginForm'
import RegisterForm from '../pages/RegisterForm'
import useAuth from '../hooks/useAuth'
import Header from '../pages/Header'
import HomePage from '../pages/HomePage'
import Cart from '../pages/Cart'
import AdminHome from '../AdminPages/AdminHome'
import AdminNav from '../AdminPages/AdminNav'
import UserData from '../AdminPages/UserData'
import AdminData from '../AdminPages/Admindata'
import EditData from '../AdminPages/EditData'
import AddProduct from '../AdminPages/AddProduct'
import ProductFrom from '../AdminPages/ProductFrom'
import AddGenre from '../AdminPages/AddGenre'
import NewArrival from '../pages/NewArrival'
import SellingWell from '../pages/SellingWell'
import BookDetails from '../pages/BookDetails'
import AddPromote from '../AdminPages/AddPromote'
import PromoteFromAdmin from '../AdminPages/PromoteFromAdmin'
import EditProduct from '../AdminPages/EditProduct'
import AddShippingAddress from '../pages/AddShippingAddress'
import UserProfile from '../pages/UserProfile'
import Recommend from '../pages/Recommend'
import Contact from '../pages/Contact'
import Payments from '../pages/Payments'
import Order from '../pages/Order'
import ShippingAddressForm from '../pages/ShippingAddressForm'
import EditShippingAddress from '../pages/EditShippingAddress'





const guestRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children: [
      { index: true, element: <HomePage /> }, // ตั้งค่าให้ HomePage เป็นหน้าแรก
      { path: '/home', element: <HomePage /> },
      { path: '/login', element: <LoginForm />},
      { path: '/register', element: <RegisterForm />},
      { path: '/new-areival', element: <NewArrival />},
      { path: '/selling-well', element: <SellingWell />},
      { path: '/book-details/:id', element: <BookDetails />},
      { path: '/order', element: <Order /> },
      {path: '/cart', element: <Cart/>},

    ]
  }
])

const userRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children : [
      { index: true, element: <HomePage /> }, // ตั้งค่าให้ HomePage เป็นหน้าแรก
      { path: '/login', element: <HomePage to='/' />},
      { path: '/login', element: <LoginForm />},
      { path: '/home', element: <HomePage /> },
      { path: '/userprofile/:id', element: <UserProfile /> },
      { path: '/cart', element: <Cart/>},
      { path: '/new-areival', element: <NewArrival />},
      { path: '/selling-well', element: <SellingWell />},
      { path: '/newshipping-address', element: <AddShippingAddress />},
      { path: '/book-details/:id', element: <BookDetails />},
      { path: '/editdata/:id', element: <EditData  /> },
      { path: '/recommend', element: <Recommend  /> },
      { path: '/contact' , element: <Contact />},
      { path: '/payments' , element: <Payments />},
      { path: '/order' , element: <Order />},
      { path: '/shipping-address' , element: <ShippingAddressForm />},
      { path: '/edit-shipping/:id' , element: <EditShippingAddress />},


    ]
  }
])


const adminRouter = createBrowserRouter([
  {
    path: '/',
    element:  <div className='flex flex-row px-4 py-6 gap-x-4'>
      <AdminNav />
      <Outlet />
    </div>,
    children : [
      { index: true, element: <AdminHome /> },
      { path: '/login', element: <AdminHome to='/' />},
      { path: '/home', element: <AdminHome /> },
      { path: '/userdata', element: <UserData to='/'  /> },
      { path: '/admindata', element: <AdminData /> },
      { path: '/editdata/:id', element: <EditData  /> },
      { path: '/productfrom', element: <ProductFrom  /> },
      {path: '/addproduct', element: <AddProduct />},
      {path: '/addgenre', element: <AddGenre />},
      {path: '/addpromote', element: <AddPromote />},
      {path: '/promote-fromadmin', element: <PromoteFromAdmin />},
      {path: '/edit-product/:id', element: <EditProduct />},
      { path: '/order', element: <Order /> },

       

      
    ]
  }
])

export default function AppRouter() {
  const {user} = useAuth()
  
  const finalRouter = !user?.id ? guestRouter : user.role === 'Admin' ? adminRouter : userRouter
  return (
    <RouterProvider router={finalRouter} />
  )
}