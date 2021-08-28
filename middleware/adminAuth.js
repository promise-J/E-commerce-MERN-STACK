const User = require('../models/User')

const adminAuth = async (req, res, next)=> {
    try {      
        const user = await User.findById(req.user.id)
        if(user.role === 0) return res.status(400).json({msg: "Available to only admin"})
        next()
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}

module.exports = adminAuth