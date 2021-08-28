const router = require('express').Router()
const paymentCtrl = require('../controllers/paymentCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/adminAuth')

router.route('/payment')
  .get(auth, authAdmin, paymentCtrl.getPayment)
  .post(auth, paymentCtrl.createPayment)

module.exports = router