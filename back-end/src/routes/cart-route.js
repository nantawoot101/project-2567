const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart-controller');
const authenticate = require('../middlewares/authenticate');

router.get('/getCart', authenticate,cartController.getCart);
router.get('/getCart/:id', authenticate,cartController.getCartById);
router.post('/add/:id',authenticate, cartController.addToCart);
router.put('/updateCart/:id', authenticate, cartController.updateCart)
router.delete('/deleteCart/:id',authenticate, cartController.deleteCart);



module.exports = router;