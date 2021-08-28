const Payment = require('../models/paymentModel')
const User = require('../models/User')
const Product = require('../models/Product')

const paymentCtrl = {
   getPayment: async (req, res)=>{
       try {
           const payments = await Payment.find()
           res.status(200).json(payment)
       } catch (error) {
           return res.status(500).json({msg: error.message})
       }
   },
   createPayment: async(req, res)=>{
       try {
           const user = await User.findById(req.user.id).select('name email')
           if(!user) return res.status(400).json({msg: 'User does not exist'})
           const {cart, paymentID, address} = req.body
           const {_id, name, email} = user
           const newPayment = new Payment({
               user_id: _id, name, email, cart, paymentID, address
           })

           cart.filter(item=>{
               return sold(item._id, item.quantity, item.sold)
           })
        //    console.log(newPayment)
           const pay = await newPayment.save()
           res.status(200).json({msg: 'Payment Success'})
           console.log(pay)

       } catch (error) {
           console.log(error )
           return res.status(500).json({msg: error.mesage})
       }
   }
}

const sold = async(id, quantity, oldSold)=>{
    await Product.findOneAndUpdate({_id: id}, {sold: quantity + oldSold})
}

module.exports = paymentCtrl