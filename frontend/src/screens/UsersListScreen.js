import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listUsers, deleteUser } from '../actions/userActions'
const UsersListScreen = ({ history }) => {
    const [deleteSucceded, setDeleteSucceded] = useState(false)

    const dispatch = useDispatch()

    const allUsers = useSelector(state => state.allUsers)
    const { loading, error, users } = allUsers

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete } = userDelete


    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers())
        } else {
            history.push('/login')
        }
    }, [dispatch, history, successDelete, userInfo])

    const deleteHandler = (id) => {
        if (window.confirm('Are you Sure')) {
            dispatch(deleteUser(id))
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
            <h1>Users Details</h1>
            {deleteSucceded && <Message variant='success'>User deleted successfuly <i className='fas fa-check'></i></Message>
            }
            {loading ? <Loader /> : error ? <Message variant='danger'>{error} <i class="fas fa-exclamation-triangle"></i></Message> : (
                <Table variant='secondary' striped bordered hover responsive size='sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Admin?</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                <td>{user.isAdmin ? (<i className="fas fa-check" style={{ color: 'green' }}></i>) : (<i className="fas fa-times" style={{ color: 'red' }}></i>)}</td>
                                <td><LinkContainer to={`/admin/user/${user._id}/edit`}>
                                    <Button variant='light' className='btn-sm'>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}>
                                        <i class="fas fa-trash-alt"></i>
                                    </Button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

        </>
    )
}

export default UsersListScreen
