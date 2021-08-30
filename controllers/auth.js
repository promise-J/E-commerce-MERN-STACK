const jwt = require("jsonwebtoken")
const User = require("../models/User")
const bcrypt = require('bcrypt')
const sendMail = require('../utils/sendEmail')
const Payment = require('../models/paymentModel')
// const { google } = require('googleapis')
// const { OAuth2 } = google.auth

// const {CLIENT_URL} = process.env
// const client = new OAuth2(process.env.GOOGLE_CLIENT_ID)


const userCtrl = {
   register: async (req, res)=> {
    try {
      const {email, username, password} = req.body
      if(!email || !username || !password)  return res.status(400).json({msg: "All fields must be filled"})
      if(password.length < 6)  return res.status(400).json({msg: "Password must be atleast 6 characters"})
      const existingUser = await User.findOne({email})
      if(existingUser) return res.status(400).json({msg: "Email already exists"})
      const hashPass = await bcrypt.hash(password, 10)
      const newUser = {email, password: hashPass, username}
      await new User(newUser).save()

  //     const activation_token = getActivationToken(newUser)
  //     const url = `${process.env.CLIENT_URL}/user/activation/${activation_token}`
  //     // console.log(newUser, activation_token, url)

  //     const message = `
  //     <div style="height: 400px; width: 800px; box-shadow: 4px 2px 12px 4px gray; border: 1px solid gray;">
  //     <h2 style="text-align: center; font-size: 30px;">WELCOME TO ADVANCE REACT AUTHENTICATION</h2>
  //     <p style="text-align: center; font-size: 24px;">Please activate your account by clicking on the link below...</p><br />
  //     <a href=${url} style="color: white; margin: 2rem; text-decoration: none; background-color: red; padding: 0.5rem 1rem; borderRadius: 7px; outline: none;">Activate your account</a> <span style="font-size: 20px">or copy this link below</span> <br />
  //     <div style="margin: 3rem;">${url}</div>
  //     </div>
  //  `
  //  const options = {
  //    to: email,
  //    subject: 'Email Activation',
  //    message
  //  }
  //  sendMail(options)

      res.json({msg: email + " is registered successfully..."})
    } catch (error) {
      return res.status(500).json({msg: error.message})
    }
   },
  //  activationEmail: async (req, res)=> {
  //    try {
  //      const {activation_token} = req.body
  //      const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN)
  //      const {password, email, username} = user
  //      const exists = await User.findOne({email})
  //      if(exists)  return res.status(400).json({msg: 'Email already exists.'})

  //      const newUser = new User({
  //        email, username, password
  //       })
       
  //      await newUser.save()
  //     //  console.log({activationToken}, newUser)
  //      res.json({msg: "Account has been activated. Login!"})
  //    } catch (error) {
  //      return res.status(500).json({msg: error.message + 'ctrl'})
  //    }
  //  },
   login: async (req, res)=> {
     try {
       const {email, password} = req.body
       if(!email) return res.status(400).json({msg: 'Email must be provided'})
       const user = await User.findOne({email})
       if(!user) return res.status(400).json({msg: "Email is not registered. Register!"})
       const isMatch = await bcrypt.compare(password, user.password)
       if(!isMatch)  return res.status(400).json({msg: "Password is incorrect"})
       const rf_token = getRefreshToken({id: user._id})
       res.cookie('refreshtoken', rf_token, {
         httpOnly: true,
         path: "/user/refresh_token",
         maxAge: 7*24*60*60*1000
       })
      // res.cookie('token', token)
      res.json({msg: "Login successful", role: user.role, cart: user.cart})
     } catch (error) {
       return res.status(500).json({msg: error.message})
     }
   },
   fetchAccessToken: (req, res)=> {
       try {
         console.log(req.cookie)
          const rf_token = req.cookies.refreshtoken
          if(!rf_token) return res.status(400).json({msg: 'Please login to get a token'})
          jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user)=> {
            if(err) res.status(400).json({msg: 'token verification failed'})
            const accessToken = getAccessToken({id: user.id})
            res.json({accessToken})
          })
       } catch (error) {
         return res.status(500).json({msg: error.message})
       }
   },
   forgotpassword: async (req, res)=> {
     try {
       const {email} = req.body
       const user = await User.findOne({email})
       if(!user) return res.status(400).json({msg: 'This email does not exist'})
       const accessToken = getAccessToken({id: user._id})
       const url = `${process.env.CLIENT_URL}/user/reset/${accessToken}`
      //  console.log(user._id, url)

       const message = `
      <div style="height: 400px; width: 800px; box-shadow: 4px 2px 12px 4px gray; border: 1px solid gray;">
      <h2 style="text-align: center; font-size: 30px;">PASSWORD RESET</h2>
      <p style="text-align: center; font-size: 24px;">.Please click on the link to reset your password</p><br />
      <a href=${url} style="color: white; margin: 2rem; text-decoration: none; background-color: red; padding: 0.5rem 1rem; borderRadius: 7px; outline: none;">Reset your password</a> <span style="font-size: 20px">or copy this link below</span> <br />
      <div style="margin: 3rem;">${url}</div>
      </div>
   `
   const options = {
     to: email,
     subject: 'Gospel E-Commerce Password Reset Request.',
     message
   }
   sendMail(options)
    res.json({msg: `Message sent to ${email}`})
     } catch (error) {
       return res.status(500).json({msg: error.message})
     }
   },
   resetpassword: async (req, res)=> {
      try {
        const {password} = req.body
        const hashPass = await bcrypt.hash(password, 10)
        
        await User.findOneAndUpdate({_id: req.user.id}, {
          password: hashPass
        })
        res.json({msg: 'Password Successfully changed'})
      } catch (error) {
        return res.status(500).json({mgs: error.message})
      }
   },
   all: async (req, res)=> {
      try {
        const users = await User.find().select('-password')
        res.json(users)
      } catch (error) {
        return res.status(500).json({msg: error.message})
      }
   },
   getUserInfo: async (req, res)=> {
     try {
       const user = await User.findById(req.user.id).select('-password')
       res.json(user)
     } catch (error) {
       return res.status(500).json({msg: error.message})
     }
   },
   logout: async (req, res)=> {
     try {
       res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
       return res.json({msg: 'Logged out'})
     } catch (error) {
       return res.status(500).json({msg: error.message})
     }
   },
   addCart: async (req, res)=>{
     try {
       const user = await User.findById(req.user.id)
       if(!user) return res.status(400).json({msg: 'User is not found'})
       const toUser = await User.findOneAndUpdate({_id: req.user.id}, {
         cart: req.body.cart
        }, {new: true})
       return res.status(200).json({msg: 'Added to cart', toUser})
     } catch (error) {
       return res.status(500).json({msg: error.message})
     }
   },
   updateUser: async (req, res)=> {
    try {
      const {username, avatar} = req.body
      if(!username || !avatar) return res.status(400).json({msg: 'Field must not be empty.'})
      await User.findOneAndUpdate({_id: req.user.id}, {
        avatar, username
      })
      res.json({msg: 'Update Successful'})
    } catch (error) {
      return res.status(500).json({msg: error.message})
    }
 },
   history: async (req, res)=> {
     try {
       const history = await Payment.find({user_id: req.user.id})
       res.json(history)
     } catch (error) {
       return res.status(500).json({msg: error.message})
     }
   },
   deleteUser: async (req, res)=> {
    try {
      const user = await User.findOneAndDelete({email: req.body.email})
      res.status(200).json({msg: `${email} deleted...`})
    } catch (error) {
      return res.status(500).json({msg: error.message})
    }
  },
  //socials
  googleLogin: async (req, res)=> {
      const {tokenId} = req.body
      try {
        const verify = await client.verifyIdToken({idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID})
        const {email, picture, name, email_verified} = verify.payload
        const password = email + process.env.GOOGLE_PASSWORD
        const passHash = await bcrypt.hash(password, 10)
        // console.log(verify.payload.email_verified)
        if(!email_verified) return res.status(400).json({msg: 'Email not verified.'})
        
        const user = await User.findOne({email})
          if(user){
            console.log(user)
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: 'Password incorrect'})
            const rf_token = getRefreshToken({id: user._id})
            res.cookie('refreshtoken', rf_token, {
              httpOnly: true,
              path: "/user/refresh_token",
              maxAge: 7*24*60*60*1000
            })
           // res.cookie('token', token)
           res.json({msg: "Login successful"})
          }else{
            const newUser = new User({username: name, password: passHash, email, avatar: picture})
            await newUser.save()
            console.log(newUser)
            const rf_token = getRefreshToken({id: newUser._id})
            res.cookie('refreshtoken', rf_token, {
              httpOnly: true,
              path: "/user/refresh_token",
              maxAge: 7*24*60*60*1000
            })
           // res.cookie('token', token)
           res.json({msg: "Login successful"})
          }
      } catch (error) {
          return res.status(500).json({msg: error.message})
      }
  },
}
 
const getAccessToken = (payload)=> {
  return jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn: '11m'})
}
const getRefreshToken = (payload)=> {
  return jwt.sign(payload, process.env.REFRESH_TOKEN, {expiresIn: '7d'})
}

module.exports = userCtrl