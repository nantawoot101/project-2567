const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/authenticate')
const orderController = require('../controllers/order-controller')


router.post('/new', authenticate,orderController.createOrder)
router.get('/:id', orderController.getOrderById)
router.get('/', orderController.getAllOrder)
router.delete('/:id', authenticate,orderController.deleteOrder) 


module.exports = router