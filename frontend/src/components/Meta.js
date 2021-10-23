import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keyword' content={keywords} />

        </Helmet>
    )
}

Meta.defaultProps = {
    title: 'NeonTech - High Quality Shop ',
    description: "Computers , Electronics , Gadgets and a lot of tech products ! ",
    keywords: "Computers , Electronics , Gadgets and Mobile Products"
}

export default Meta
