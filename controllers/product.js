const { query } = require('express-validator')
const Product = require('../models/Product')


const productCtrl = {
    getProducts: async (req, res) => {
        try {
            let queryObj = { ...req.query }
            // console.log(queryObj)
            const excludedFields = ['sort', 'limit', 'page']
            excludedFields.forEach(f => {
                delete (queryObj[f])
            })

            let queryStr = JSON.stringify(queryObj)
            queryStr = queryStr.replace(/\b(regex|lte|gte|lt|gt)\b/g, match => `$${match}`)
            // console.log(queryStr)
            let sortBy;
            if (req.query.sort) {
                sortBy = req.query.sort.split(',').join(' ')
            } else {
                sortBy = '-createdAt'
            }
            const limit = req.query.limit || 20
            let page = req.query.page || 1
            let skip = (page - 1) * limit


            const products = await Product.find(JSON.parse(queryStr)).sort(sortBy).skip(skip).limit(limit)
            res.json({ status: 'Available', length: products.length, products })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id)
            res.status(200).json({ msg: product })

        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    createProduct: async (req, res) => {
        try {
            const { images, product_id, description, title, content, price, category } = req.body
            if (!images) return res.status(400).json({ msg: 'Image must be selected' })
            const existProduct = await Product.findOne({ product_id })
            if (existProduct) return res.status(400).json({ msg: 'Product already exists' })
            const newProduct = new Product({
                images, product_id, description, content, title, price, category
            })
            await newProduct.save()
            res.status(200).json({msg: 'Created a product.'})
        } catch (error) {
            return res.status(500).json({msg: error.message, error: ' nonsense'})
        }
    },
    updateProduct: async (req, res) => {
        const { id } = req.params
        await Product.findOneAndUpdate(req.params.id, req.body, { new: true })

        res.json({ msg: 'Product updated successfully' })
    },
    deleteProduct: async (req, res) => {
        try {      
            await Product.findOneAndDelete(req.params.id)
            res.send('Product deleted successfully...')
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }
}

module.exports = productCtrl