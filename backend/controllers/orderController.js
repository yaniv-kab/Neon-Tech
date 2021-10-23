import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
//@desc    create new Order
//@route   POST /api/orders
//@access  private
const addOrderItems = asyncHandler(async (req, resp) => {
    const { orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice } = req.body
    if (orderItems && orderItems.length === 0) {
        resp.status(400)
        throw new Error('No order items')
        return
    } else {
        const order = new Order(
            {
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice
            }
        )
        const createdOrder = await order.save()
        resp.status(201).json(createdOrder)
    }
})
//@desc    get Order by id
//@route   get /api/orders/:id
//@access  private
const getOrderById = asyncHandler(async (req, resp) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (order) {
        resp.json(order)
    } else {
        resp.status(404)
        throw new Error('Order not found')
    }
})

//@desc    Update order to paid
//@route   get /api/orders/:id/pay
//@access  private
const updateOrderToPaid = asyncHandler(async (req, resp) => {
    const order = await Order.findById(req.params.id)
    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }

        const updatedOrder = await order.save()
        resp.json(updatedOrder)
    } else {
        resp.status(404)
        throw new Error('Order not found')
    }
})

//@desc    Update order to delivered
//@route   get /api/orders/:id/deliver
//@access  private/Admin
const updateOrderToDelivered = asyncHandler(async (req, resp) => {
    const order = await Order.findById(req.params.id)
    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updatedOrder = await order.save()
        resp.json(updatedOrder)
    } else {
        resp.status(404)
        throw new Error('Order not found')
    }
})

//@desc    get logged in user orders
//@route   get /api/orders/myorders
//@access  private
const getUserOrders = asyncHandler(async (req, resp) => {
    const orders = await Order.find({ user: req.user._id })
    resp.json(orders)
})

//@desc    get all orders
//@route   get /api/orders
//@access  private/Admin
const getOrders = asyncHandler(async (req, resp) => {
    const orders = await Order.find({}).populate('user', 'id name')
    resp.json(orders)
})




export { addOrderItems, getOrderById, updateOrderToPaid, getUserOrders, getOrders, updateOrderToDelivered }