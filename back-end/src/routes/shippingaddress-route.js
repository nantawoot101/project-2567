const express = require('express');
const router = express.Router();
const ShippingAddressController = require('../controllers/shippingaddress-controller');
const authenticate = require('../middlewares/authenticate');


router.get('/', ShippingAddressController.getAllShippingAddress);
router.get('/alluserId', authenticate,ShippingAddressController.getAllShipAddressByUserId);
router.get('/:id',ShippingAddressController.getShippingById);
router.post('/new',authenticate,ShippingAddressController.createShippingAddress );
router.delete('/:id',ShippingAddressController.deleteShipping);
router.put('/edit/:id',ShippingAddressController.updateShipping);



module.exports = router;