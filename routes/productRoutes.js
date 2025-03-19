import express from 'express'
import { getAllProducts,getProductById } from '../controllers/productController.js'
const router = express.Router()


router.get('/',getAllProducts)
router.get('/id',getProductById)
// router.post('/',productController.createProduct)
// router.put('/:id',productController.updateProduct)
// router.delete('/:id',productController.deleteProduct)


export default router
