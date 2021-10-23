import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductsDetails, updateProduct } from '../actions/productActions'
import { Link } from 'react-router-dom'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'


const EditProductScreen = ({ match, history }) => {
    const productId = match.params.id
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [rating, setRating] = useState('')
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState(false)



    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate

    useEffect(() => {
        if (successUpdate) {
            dispatch({
                type: PRODUCT_UPDATE_RESET
            })
            history.push('/admin/productlist')
        } else {
            if (!product.name || product._id !== productId) {
                dispatch(listProductsDetails(productId))
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
                setRating(product.rating)
            }
        }
    }, [product, dispatch, productId, history, successUpdate])

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)
        console.log(uploading);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post('/api/upload', formData, config)

            setImage(data)
            console.log(uploading);
            setUploading(false)
            setUploadError(false)
        } catch (error) {
            setUploadError(true)
            console.log(error);
            setUploading(false)
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
            _id: productId,
            name,
            price,
            image,
            brand,
            category,
            description,
            countInStock,
            rating
        }))
    }
    return (
        <>
            <Link to='/admin/productlist' className='btn btn-outline-dark my-3'><i className="far fa-hand-point-left"></i> Go Back</Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {successUpdate && <Message variant='success'>Product Updated successfuly<i className='fas fa-check'></i></Message>}
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate} <i className="fas fa-exclamation-triangle"></i> </Message>}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error} <i className="fas fa-exclamation-triangle"></i></Message> : (
                    <Form onSubmit={submitHandler}>

                        <Form.Group controlId='name'>
                            <Form.Label> Product Name</Form.Label>
                            <Form.Control required type='name' placeholder='Enter your full name' value={name} onChange={e => setName(e.target.value)}>
                            </Form.Control>
                        </Form.Group><br />

                        <Form.Group controlId='price'>
                            <Form.Label> Price </Form.Label>
                            <Form.Control required type='number' placeholder='Enter price' value={price} onChange={e => setPrice(e.target.value)}>
                            </Form.Control>
                        </Form.Group><br />

                        <Form.Group controlId='image'>
                            <Form.Label> Image </Form.Label>
                            <Form.Control required type='text' placeholder='Enter image url' value={image} onChange={e => setImage(e.target.value)}>
                            </Form.Control ><br />
                            <Form.File id='image-file' label={uploading === false && <Message variant='info'><i className="fas fa-exclamation-circle"></i> Only jpg/jpeg/png Files <i className="fas fa-exclamation-circle"></i></Message>} custom onChange={uploadFileHandler}></Form.File>
                            {uploading && <Loader />}
                            {uploadError && <Message variant='danger'>Sorry <i className="far fa-sad-tear"></i> , the file has to be a jpg/jpeg/png <i className="fas fa-bomb"></i></Message>}
                        </Form.Group><br />

                        <Form.Group controlId='brand'>
                            <Form.Label> Brand </Form.Label>
                            <Form.Control required type='text' placeholder='Enter brand' value={brand} onChange={e => setBrand(e.target.value)}>
                            </Form.Control>
                        </Form.Group><br />

                        <Form.Group controlId='countInStock'>
                            <Form.Label> countInStock </Form.Label>
                            <Form.Control required type='number' placeholder='Enter countInStock' value={countInStock} onChange={e => setCountInStock(e.target.value)}>
                            </Form.Control>
                        </Form.Group><br />

                        <Form.Group controlId='category'>
                            <Form.Label> Category </Form.Label>
                            <Form.Control type='text' required placeholder='Enter category' value={category} onChange={e => setCategory(e.target.value)}>
                            </Form.Control>
                        </Form.Group><br />

                        <Form.Group controlId='description'>
                            <Form.Label> Description </Form.Label>
                            <Form.Control type='text' required placeholder='Enter description' value={description} onChange={e => setDescription(e.target.value)}>
                            </Form.Control>
                        </Form.Group><br />


                        <Button type='submit' variant='primary'>
                            Update  <i className="fas fa-user-edit"></i>
                        </Button>
                    </Form>
                )}

            </FormContainer>
        </>

    )
}

export default EditProductScreen
