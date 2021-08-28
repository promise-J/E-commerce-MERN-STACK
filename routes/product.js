const router = require('express').Router()
const productCtrl = require('../controllers/product')
const Product = require('../models/Product')

productCtrl
router.route('/products')
.get(productCtrl.getProducts)
.post(productCtrl.createProduct)

router.route('/product/:id')
.put(productCtrl.updateProduct)
.delete(productCtrl.deleteProduct)
.get(productCtrl.getProduct)

module.exports = router