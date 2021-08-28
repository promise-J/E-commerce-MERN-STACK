const router = require('express').Router()
const cloudinary = require('cloudinary')
const fs = require('fs')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/adminAuth')
const uploadImage = require('../middleware/uploadImage')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// router.post('/upload', uploadImage, auth, uploadCtrl.uploadAvatar )
router.post('/upload', (req, res)=> {
    
    try {
         if(!req.files || Object.keys(req.files).length === 0) 
         return res.status(400).json({msg: 'No file were uploaded'})
     
          const file = req.files.file
      
      if(file.size > 1024 * 1024){
          removeTmp(file.tempFilePath)  
          return res.status(400).json({msg: "Size too large"})
        }
        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: 'Invalid file format'})
        }
        // console.log(req.files)
        cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: 'commerce', width: 150, height: 150, crop: "fill"
        }, async(err, result)=> {
            if(err) throw err
                removeTmp(file.tempFilePath)
                
              console.log({url: result.secure_url, public_id: result.public_id})
              res.status(200).json({url: result.secure_url, public_id: result.public_id})

            })
        } catch (error) {
          res.status(500).json({msg: error.message})
        }
    
})
//delete uploaded images
router.post('/destroy', (req, res)=> {
    try {
        
        const {public_id} = req.body
        if(!public_id) return res.status(400).json({msg: 'No image selected'})
        
        cloudinary.v2.uploader.destroy(public_id, async(err, result)=> {
            if(err) throw err
            
            res.json({msg: 'Deleled image'})
        })
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
})


const removeTmp = (path)=> {
    fs.unlink(path, err=> {
        if(err) throw err
        console.log(path + ' has been deleted.')
    })
}


module.exports = router