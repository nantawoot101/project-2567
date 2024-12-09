require('dotenv').config()
const express = require('express')
const cors = require('cors')
const notFound = require('./middlewares/notFound')
const errorMiddleware = require('./middlewares/error')
const authRoute = require('./routes/auth-route')
const userRoutes = require('./routes/user-route');
const bookRoutes = require('./routes/book-route');
const cartRoutes = require('./routes/cart-route');
const promoteRoutes = require('./routes/promote-route');
const ContactRoutes = require('./routes/contact-route');
const OrderRoutes = require('./routes/order-route');
const ShippingRoutes = require('./routes/shippingaddress-route');

const app = express()

app.use(cors())
app.use(express.json())
app.use('/product', express.static('upload/product'));
app.use('/promote', express.static('upload/promote'));
app.use('/payment', express.static('upload/payment'));


// service
app.use('/auth', authRoute)
app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/cart', cartRoutes);
app.use('/promotes', promoteRoutes);
app.use('/shipping', ShippingRoutes);
app.use('/contact', ContactRoutes);
app.use('/order', OrderRoutes);




// notFound
app.use( notFound )

// error
app.use(errorMiddleware)

let port = process.env.PORT || 8000
app.listen(port, ()=> console.log('Server on Port :', port))