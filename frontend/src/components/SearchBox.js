import React, { useState } from 'react'
import { Form } from 'react-bootstrap'

const SearchBox = ({ history }) => {

    const [keyword, setKeyWord] = useState('')

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            history.push(`/search/${keyword}`)
        } else {
            history.push('/')
        }
    }

    return (
        <Form onSubmit={submitHandler} inline className='webdesigntuts-workshop'>
            <Form.Control
                type='text'
                name='q'
                onChange={e => setKeyWord(e.target.value)}
                placeholder='What are you looking for?'
                className='search mr-sm-2 ml-sm-5'
            ></Form.Control>
            <button type='submit'>Search <i className="fas fa-search"></i></button>
        </Form>
    )
}

export default SearchBox
