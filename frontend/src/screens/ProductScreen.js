import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import { listProductsDetails, createProductReview } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'
import { addToCart } from '../actions/cartActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

const ProductScreen = ({ match }) => {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [reviewAdded, setReviewAdded] = useState(false)
    const [addedToCart, setAddedToCart] = useState(false)

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const { success: successProductReview, error: errorProductReview } = productReviewCreate
    useEffect(() => {
        if (successProductReview) {
            setReviewAdded(true)
            setTimeout(() => {
                setReviewAdded(false)
            }, 3000)
            setRating(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }
        dispatch(listProductsDetails(match.params.id))
    }, [dispatch, match, successProductReview])


    const addToCartHandler = () => {
        dispatch(addToCart(product._id, Number(qty)))
        setAddedToCart(true)
        setTimeout(() => {
            setAddedToCart(false)
        }, 3000)
    }

    const submitHandler = (e) => {

        e.preventDefault()
        dispatch(createProductReview(match.params.id, {
            rating,
            comment
        }))

    }
    return (
        <>
            <Link className='btn btn-outline-dark my-3' to='/'><i className="far fa-hand-point-left"></i> Go Back</Link>
            {loading ? <Loader /> : error ? <Message variant='danger' /> : (
                <>
                    <Meta title={product.name} />
                    <Row>
                        <Col md={6}>
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={3}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                                </ListGroup.Item>
                                <ListGroup.Item variant='success'>
                                    Price: ${product.price}
                                </ListGroup.Item>
                                <ListGroup.Item >
                                    Description: {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                Price:
                                            </Col>
                                            <Col>
                                                <strong>${(product.price * qty).toFixed(2)}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                Status:
                                            </Col>
                                            <Col>
                                                {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>
                                                    Qty
                                                </Col>
                                                <Col>
                                                    <Form.Control as='select' value={qty} onChange={(e) => setQty(e.target.value)}>
                                                        {[...Array(product.countInStock).keys()].map(x => (
                                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                        ))}
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}

                                    <ListGroup.Item>
                                        <Button onClick={addToCartHandler} variant='outline-primary' type='button' disabled={product.countInStock === 0}>
                                            Add To Cart  <i class="fas fa-cart-plus"></i>
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                            {addedToCart && <Message variant='success'>Added to cart successfully <i className='fas fa-check'></i> <Link to='/cart'>To cart</Link> </Message>}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <h2>Reviews</h2>
                            {product.reviews.length === 0 && <Message>No reviews</Message>}
                            <ListGroup variant='flush'>
                                {product.reviews.map(review => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} />
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    {reviewAdded && <Message variant='success'> Review added successfully <i className="fas fa-check"></i></Message>}
                                    <h2>Add a customer review</h2>
                                    {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}
                                    {userInfo ? (<Form onSubmit={submitHandler}>
                                        <Form.Group controlId='rating'>
                                            <Form.Label>Rating</Form.Label>
                                            <Form.Control required as='select' value={rating} onChange={e => setRating(e.target.value)}>
                                                <option value=''>Select...</option>
                                                <option value='1'>1 - Poor</option>
                                                <option value='2'>2 - Fair</option>
                                                <option value='3'>3 - Good</option>
                                                <option value='4'>4 - Very Good</option>
                                                <option value='5'>5 - Excellent</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId='comment'>
                                            <Form.Label>Comment</Form.Label>
                                            <Form.Control required as='textarea' row={3} value={comment} onChange={e => setComment(e.target.value)}></Form.Control>
                                        </Form.Group><br />
                                        <Button type='submit' variant='outline-primary'>Add Review <i className="fas fa-plus"></i></Button>
                                    </Form>
                                    ) : <Message>Please <Link to='/login'> Sign In</Link> to add a review</Message>}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            )
            }
        </>
    )
}

export default ProductScreen
