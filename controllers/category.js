const Category = require('../models/Category')

const cartCtrl = {
    createCategory: async(req, res)=>{
        try {
            
            const {name} = req.body
            const existingCart = await Category.findOne({name})
            if(existingCart) return res.status(400).json({msg: `${existingCart.name} already exists...`})
            const newCart = {name}
            const cart = await new Category(newCart).save()
            res.status(200).json({msg: `Cart ${cart.name} created successfully`})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    getCategory: async(req, res)=> {
        try {
            const all = await Category.find()
            res.status(200).json(all)
        } catch (error) {
            res.status(500).json({msg: error.message})
        }
    },
    deleteCat: async(req, res)=> {
        try {
            const cart = await Category.findByIdAndDelete(req.params.id)
            res.status(200).json({msg: `${cart.name} category deleted`})
        } catch (error) {
            res.status(500).json({msg: error.message})
        }
    },
    updateCat: async(req, res)=>{
        try {
            const {name} = req.body
            await Category.findOneAndUpdate({_id: req.params.id}, {name})
            res.status(200).json({msg: 'Category updated...'})
        } catch (error) {
            res.status(500).json({msg: error.message})
        }
    }
}

module.exports = cartCtrl