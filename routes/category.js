const cartCtrl = require('../controllers/category')
const auth = require('../middleware/auth')
const admin = require('../middleware/adminAuth')

const router = require('express').Router()

router.route('/category').post(cartCtrl.createCategory, auth, admin).get(cartCtrl.getCategory)
router.route('/category/:id').delete(cartCtrl.deleteCat).put(cartCtrl.updateCat)

module.exports = router