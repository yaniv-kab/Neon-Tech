import asyncHandler from 'express-async-handler'
import { protect } from '../middleware/authMiddleward.js'
import Product from '../models/productModel.js'

//@desc    Fetch All Products
//@route   GET /api/products
//@access  Public
const getProducts = asyncHandler(async (req, resp) => {
    const pageSize = 8
    const page = Number(req.query.pageNumber) || 1
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}
    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1))
    resp.json({ products, page, pages: Math.ceil(count / pageSize) })
})
//@desc    Fetch Single Products
//@route   GET /api/products/:id
//@access  Public

const getProductById = asyncHandler(async (req, resp) => {
    const id = req.params.id
    const product = await Product.findById(id)
    if (product) {
        resp.json(product)
    } else {
        resp.status(404)
        throw new Error('Product not found')
    }
})
//@desc    delete Single Products
//@route   delete /api/products/:id
//@access  Private/Admin
const deleteProduct = asyncHandler(async (req, resp) => {
    const id = req.params.id
    const product = await Product.findById(id)
    if (product) {
        if (product) {
            await product.remove()
            resp.json({ message: 'Product removed' })
        } else {
            resp.status(404)
            throw new Error('Product not found')
        }
    }
})

//@desc    create Single Products
//@route   post /api/products/
//@access  Private/Admin
const createProduct = asyncHandler(async (req, resp) => {

    console.log(req.user);
    const product = new Product({
        name: 'Product name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Product brand',
        rating: 3,
        category: 'Product category',
        countInStock: 0,
        numReviews: 0,
        description: 'Describe the product'
    })

    const createdProduct = await product.save()
    resp.status(201).json(createdProduct)
})

//@desc    Update Single Products
//@route   put /api/products/:id
//@access  Private/Admin
const updateProduct = asyncHandler(async (req, resp) => {

    const { rating, name, price, description, image, brand, countInStock, numReviews, category } = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image,
            product.rating = rating,
            product.category = category
        product.brand = brand
        product.countInStock = countInStock

        const updatedProduct = await product.save()
        resp.json(updatedProduct)
    } else {
        description
        resp.status(404)
        throw new Error('Product not found')
    }
})


//@desc    create new review
//@route   POST /api/products/:id/reviews
//@access  Private
const createProductReview = asyncHandler(async (req, resp) => {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
        console.log(req.user);
        const alreadyReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString())
        if (alreadyReviewed) {
            resp.status(400)
            throw new Error('Product already reviewed')
        }


        console.log(req.user);
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        await product.save()
        resp.status(201).json({ message: 'Review added' })
    } else {
        description
        resp.status(404)
        throw new Error('Product not found')
    }
})


//@desc    get top rated products
//@route   POST /api/products/top
//@access  Public
const getTopProducts = asyncHandler(async (req, resp) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4)

    resp.json(products)
})
export { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts }