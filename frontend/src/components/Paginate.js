import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
    return pages > 1 && (
        <Pagination>
            {[...Array(pages).keys()].map(currentPage => (
                <LinkContainer key={currentPage + 1} to={
                    !isAdmin ? keyword ? `/search/${keyword}/page/${currentPage + 1}` : `/page/${currentPage + 1}` : `/admin/productlist/${currentPage + 1}`}>
                    <Pagination.Item active={currentPage + 1 === page}>{currentPage + 1}</Pagination.Item>
                </LinkContainer>
            ))}
        </Pagination>
    )
}

export default Paginate
