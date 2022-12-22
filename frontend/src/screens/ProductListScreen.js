import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { PRODUCT_DELETE_RESET, PRODUCT_CREATE_RESET } from '../constants/productConstants'
const ProductListScreen = ({ history, match }) => {
    const [deleteSucceded, setDeleteSucceded] = useState(false)
    const pageNumber = match.params.pageNumber || 1
    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages } = productList

    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productCreate = useSelector(state => state.productCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate



    useEffect(() => {
        dispatch({
            type: PRODUCT_CREATE_RESET
        })
        if (!userInfo.isAdmin) {
            history.push('/login')
        }
        if (successCreate) {
            history.push(`/admin/product/${createdProduct._id}/edit`)
        } else {
            dispatch(listProducts('', pageNumber))
        }
    }, [dispatch, history, userInfo, successDelete, successCreate, createdProduct, pageNumber])

    const createProductHandler = () => {
        dispatch(createProduct())
        dispatch(
            {
                type: PRODUCT_DELETE_RESET
            }
        )
    }

    const deleteHandler = (id) => {
        if (window.confirm('Are you Sure')) {
            dispatch(deleteProduct(id))
        }
        if (successDelete) {
            setDeleteSucceded(true)
            setTimeout(() => {
                setDeleteSucceded(false)
            }, 3000)
        }
    }
    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products Details</h1>
                </Col>
                <Col sm={2} >
                    <Button variant='outline-primary' className='' onClick={createProductHandler}>
                        Create Product <i className='fas fa-plus'></i>
                    </Button>
                </Col>
            </Row>
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate} <i class="fas fa-exclamation-triangle"></i></Message>}
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete} <i class="fas fa-exclamation-triangle"></i></Message>}
            {deleteSucceded && <Message variant='success'>Product deleted successfuly <i className="fas fa-check"></i></Message>}
            {loading ? <Loader /> : error ? <Message variant='danger'>{error} <i className="fas fa-exclamation-triangle"></i></Message> : (
                <>
                    <Table variant='dark' striped bordered hover responsive size='sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Count In Stock</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.countInStock > 0 ? `${product.countInStock} Pieces` : 'No pieces left'} </td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant='light' className='btn-sm'>
                                                <i className='fas fa-edit'></i>
                                            </Button>
                                        </LinkContainer>
                                        <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </Button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} isAdmin={true} />
                </>
            )}

        </>
    )
}

export default ProductListScreen
