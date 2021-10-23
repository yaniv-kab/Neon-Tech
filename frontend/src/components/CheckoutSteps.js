import React, { useState } from 'react'
import { Nav } from 'react-bootstrap'
import Message from './Message'
import { LinkContainer } from 'react-router-bootstrap'
const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    const [signed, setSigned] = useState(false)
    const [addedShipped, setAddedShipped] = useState(false)

    return (

        <Nav justify className='justify-content-center mb-4'>
            <Nav.Item>
                {step1 ? (
                    <Nav.Link onClick={() => { setSigned(!signed) }} className='neonStyled' >Signed In <i class="fa-regular fa-user"></i> </Nav.Link>
                ) : <Nav.Link className='neonStyled' disabled>Signed In</Nav.Link>}
            </Nav.Item>
            <Nav.Item>
                {step2 ? (
                    <LinkContainer to='/shipping' onSelect={() => { setAddedShipped(!addedShipped) }} >
                        <Nav.Link className='neonStyled'>Shipping <i class="fas fa-home"></i></Nav.Link>
                    </LinkContainer>
                ) : <Nav.Link className='neonStyled' disabled>Shipping <i class="fas fa-home"></i></Nav.Link>}
            </Nav.Item>
            <Nav.Item>
                {step3 ? (
                    <LinkContainer to='/payment'>
                        <Nav.Link className='neonStyled'>Payment <i class="fa-regular fa-credit-card"></i></Nav.Link>
                    </LinkContainer>
                ) : <Nav.Link className='neonStyled' disabled>Payment <i class="fa-solid fa-credit-card"></i></Nav.Link>}
            </Nav.Item>
            <Nav.Item>
                {step4 ? (
                    <LinkContainer to='/placeorder'>
                        <Nav.Link className='neonStyled'>place order <i class="fa-solid fa-hand-holding-dollar"></i></Nav.Link>
                    </LinkContainer>
                ) : <Nav.Link className='neonStyled' disabled>place order <i class="fa-solid fa-hand-holding-dollar"></i></Nav.Link>}
            </Nav.Item>
            {addedShipped && <Message variant='success'>You already filled your shipping address <i class="fas fa-check"></i> </Message>}
            {signed && <Message variant='success'>You already signed in <i class="fas fa-check"></i> </Message>}
        </Nav>
    )
}

export default CheckoutSteps
