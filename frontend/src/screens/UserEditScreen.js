import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'
import { Link } from 'react-router-dom'


const UserEditScreen = ({ match, history }) => {
    const userId = match.params.id
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)


    const dispatch = useDispatch()
    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate

    useEffect(() => {
        if (successUpdate) {
            dispatch({
                type: USER_UPDATE_RESET
            })
            history.push('/admin/userslist')
        } else {
            if (!user.name || user._id !== userId) {
                dispatch(getUserDetails(userId))
            } else {
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }
        }
    }, [user, dispatch, userId, successUpdate, history])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({
            _id: userId, name, email, isAdmin
        }))
    }
    return (
        <>
            <Link to='/admin/userslist' className='btn btn-outline-dark my-3'><i className="far fa-hand-point-left"></i> Go Back</Link>
            <FormContainer>
                <h1>Edit User</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error} <i class="fas fa-exclamation-triangle"></i></Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name'>
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type='name' required placeholder='Enter your full name' value={name} onChange={e => setName(e.target.value)}>
                            </Form.Control>
                        </Form.Group><br />
                        <Form.Group controlId='email'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type='email' required placeholder='Enter email' value={email} onChange={e => setEmail(e.target.value)}>
                            </Form.Control>
                        </Form.Group><br />
                        <Form.Group controlId='isAdmin'>
                            <Form.Check type='checkbox' label='Is Admin' checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)}>
                            </Form.Check>
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

export default UserEditScreen
