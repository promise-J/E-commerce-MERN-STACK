const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  user_id: {
      type: String,
      required: true
  },
  name: {
      type: String,
      required: true
  },
  email: {
      type: String,
      required: true
  },
  paymentID: {
      type: String,
      required: true
  },
  address: {
      type: String,
      required: true
  },
  cart: {
      type: Array,
      default: []
  },
  status: {
      type: Boolean,
      required: false
  },
}, {timestamps: true})

const Payment = mongoose.model('Payments', paymentSchema)
module.exports = Payment