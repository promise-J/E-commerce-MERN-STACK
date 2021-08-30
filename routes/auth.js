const router = require('express').Router()
const userCtrl = require("../controllers/auth")
const authMidWare = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')

router.post("/register", userCtrl.register)
// router.post("/activation", userCtrl.activationEmail)
router.post("/login", userCtrl.login)
router.post("/refresh_token", userCtrl.fetchAccessToken)
router.post("/forgot", userCtrl.forgotpassword)
router.patch("/reset", authMidWare, userCtrl.resetpassword)
router.get("/info", authMidWare, userCtrl.getUserInfo)
router.get("/all", authMidWare, adminAuth, userCtrl.all)
router.patch('/addCart',authMidWare, userCtrl.addCart)
router.put("/update", authMidWare, userCtrl.updateUser)
router.get("/history", authMidWare, userCtrl.history)
router.get("/logout", userCtrl.logout)
router.post('/google_login', userCtrl.googleLogin)
// router.post('/facebook_login', userCtrl.facebookLogin) 

router.delete("/delete", userCtrl.deleteUser)

module.exports = router
