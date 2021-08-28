const cartCtrl = require('../controllers/category')

const router = require('express').Router()

router.route('/category').post(cartCtrl.createCartegory).get(cartCtrl.getCategory)
router.route('/category/:id').delete(cartCtrl.deleteCat).put(cartCtrl.updateCat)

module.exports = router