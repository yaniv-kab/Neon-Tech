import e from 'express'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
//@desc    Auth user & get token
//@route   POST /api/users/login
//@access  Public
const authUser = asyncHandler(async (req, resp) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        resp.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        resp.status(401)
        throw new Error('Invalid email or password')
    }
})
//@desc    Register a new user
//@route   POST /api/users
//@access  Public
const registerUser = asyncHandler(async (req, resp) => {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
        resp.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        resp.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        resp.status(400)
        throw new Error('Invalid user data')
    }
})
//@desc    get user profile
//@route   GET /api/users/profile
//@access  Private
const getUserProfile = asyncHandler(async (req, resp) => {
    const user = await User.findById(req.user._id)
    if (user) {
        resp.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        resp.status(404)
        throw new Error('user not found')
    }
})

//@desc    Update user profile
//@route   PUT /api/users/profile
//@access  Private
const updateUserProfile = asyncHandler(async (req, resp) => {
    const user = await User.findById(req.user._id)
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()
        resp.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
    } else {
        resp.status(404)
        throw new Error('user not found')
    }
})

//@desc    get all users
//@route   GET /api/users
//@access  Private/Admin
const getAllUsers = asyncHandler(async (req, resp) => {
    const users = await User.find({})
    resp.json(users)

})

//@desc    delete a user
//@route   DELETE /api/user/:id
//@access  Private/Admin
const deleteUser = asyncHandler(async (req, resp) => {
    const id = req.params.id
    const user = await User.findById(id)
    if (user) {
        await user.remove()
        resp.json({ message: 'User Removed' })
    } else {
        resp.status(404)
        throw new Error('User Not Found')
    }

})
//@desc    get user by ID
//@route   GET /api/users/:id
//@access  Private/Admin
const getUserById = asyncHandler(async (req, resp) => {
    const id = req.params.id
    const user = await User.findById(id).select('-password')
    if (user) {
        resp.json(user)
    } else {
        resp.status(404)
        throw new Error('User Not Found')
    }


})

//@desc    Update user
//@route   PUT /api/users/:id
//@access  Private/Admin
const updateUser = asyncHandler(async (req, resp) => {
    const id = req.params.id
    const user = await User.findById(id)
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin

        const updatedUser = await user.save()

        resp.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        resp.status(404)
        throw new Error('user not found')
    }
})

export { authUser, getUserProfile, registerUser, updateUserProfile, getAllUsers, deleteUser, getUserById, updateUser }