import express from 'express'
import { getProducts, getProductById, deleteProduct, updateProduct, createProduct, createProductReview, getTopProducts } from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleward.js'

const router = express.Router()

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.get('/top', getTopProducts)
router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct)
router.route('/:id/reviews').post(protect, createProductReview)


export default router