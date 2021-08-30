const router = require('express').Router()
const productCtrl = require('../controllers/product')
const adminAuth = require('../middleware/adminAuth')
const auth = require('../middleware/auth')
const Product = require('../models/Product')

productCtrl
router.route('/products')
.get(productCtrl.getProducts)
.post(auth, adminAuth, productCtrl.createProduct)

router.route('/product/:id')
.put(auth, adminAuth, productCtrl.updateProduct)
.delete(auth, adminAuth, productCtrl.deleteProduct)

module.exports = router