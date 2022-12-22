import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import connectDB from './config/DataBase.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import orderRouter from './routes/orderRoutes.js'
import morgan from 'morgan'
import colors from 'colors'
import productRouter from './routes/productRoutes.js'
import userRouter from './routes/userRoutes.js'
import uploadRouter from './routes/uploadRoutes.js'


dotenv.config()

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(cors())
app.use(express.json())

app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.use('/api/upload', uploadRouter)

app.get('/api/config/paypal', (req, resp) =>
    resp.send(process.env.PAYPAL_CLIENT_ID))

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', (req, resp) => resp.sendFile(path.resolve(__dirname, 'fronetnd', 'build', 'index.html')))
} else {
    app.get('/', (req, resp) => {
        resp.send('API is running....')
    })
}



app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT} `.yellow.bold))