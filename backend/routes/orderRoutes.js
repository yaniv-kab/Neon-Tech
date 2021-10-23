import express from 'express'
import { addOrderItems, getOrderById, updateOrderToPaid, getUserOrders, getOrders, updateOrderToDelivered } from '../controllers/orderController.js'
const router = express.Router()
import { admin, protect } from '../middleware/authMiddleward.js'

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)
router.route('/myorders').get(protect, getUserOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)



export default router