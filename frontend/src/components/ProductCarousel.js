import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import Loader from './Loader'
import Message from './Message'
import { listTopProducts } from '../actions/productActions'

const ProductCarousel = () => {
    const dispatch = useDispatch()

    const topRatedProducts = useSelector(state => state.topRatedProducts)
    const { loading, error, products } = topRatedProducts

    useEffect(() => {
        dispatch(listTopProducts())
    }, [dispatch])
    return loading ? <Loader /> : error ? <Message variant='error'>{error}</Message> : (
        <Carousel pause='hover' fade interval='1500' style={{ backgroundImage: 'url("https://cdn.pixabay.com/photo/2017/02/12/12/42/wall-2059909_640.png")' }} keyboard>
            {products.map((product, i) => (
                <Carousel.Item key={product._id} id={i}>
                    <Link to={`/product/${product._id}`}>
                        <Image className='carousel-img' src={`https://web-production-d618.up.railway.app${product.image}`} alt={product.name} fluid />
                        <Carousel.Caption className='carousel-caption'>
                            <h2>{product.name} (${product.price})</h2>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default ProductCarousel
