// Wrap the request in a promise and catch any errors that occur during the request.

// If an error occurs, pass it to the next middleware function.

const asyncHandler = (requestHandler) => {

    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch( (err) => next(err))
    }
}

// const asyncHandler = (requestHandler) => async (req, res, next) => {
//     try {
//         await requestHandler(req, res, next)
//         .catch(next);
//     } catch (error) {
//         res.status(error.status || 500).json({
//             message: error.message,
//             success: false
//         })
//     }
// }

export {
    asyncHandler
}