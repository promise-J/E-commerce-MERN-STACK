const dotenv  = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookies = require('cookie-parser')
const expImg = require('express-fileupload')
const cors = require('cors')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/category')
const upload = require('./routes/upload')
const paymentRoute = require('./routes/paymentRoute')

const app = express()

//middle ware here
app.use(express.json())
app.use(cors())
app.use(cookies())
app.use(expImg({
    useTempFiles: true
}))


//routes here
app.use('/user', authRoute)
app.use('/api', productRoute)
app.use('/api', upload)
app.use('/api', cartRoute)
app.use('/api', paymentRoute)

const port = 5000 || process.env.PORT

app.listen(port, ()=> {
   console.log('Server is running on port '+port)
   mongoose.connect(`mongodb+srv://${process.env.USER_NAME}:${process.env.DB_PASSWORD}@real.jme6j.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
       useNewUrlParser: true,
       useCreateIndex: true,
       useUnifiedTopology: true,
       useFindAndModify: false
   })
   .then(()=> console.log('Mongoose DB is running...'))
   .catch(err=> console.log(err))
})