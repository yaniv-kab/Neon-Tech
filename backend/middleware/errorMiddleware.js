const notFound = (req, resp, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    resp.status(404)
    next(error)
}

const errorHandler = (err, req, resp, next) => {
    const statusCode = resp.statusCode === 200 ? 500 : resp.statusCode
    resp.status(statusCode)
    resp.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

export { notFound, errorHandler }