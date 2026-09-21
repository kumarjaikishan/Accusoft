// this is suggested by Hitesh Choudhary and was Mine also
// const asyncHandler = (fn) => {
//     return async (req, res, next) => {
//         try {
//            await fn(req, res, next);
//         } catch (error) {
//             next(error)
//         }
//     }
// }

// this was using earlier
// const asyncHandler = (func)=>{
//     return (req,res,next)=>{
//         func(req,res,next).catch(err=> next(err));
//     }
// }

// this is with promise
const asyncHandler = (fn) => {
    return (req, res, next) => {
       Promise.resolve(fn(req, res, next)).catch(err=>next(err))   
    }
}

module.exports =  asyncHandler ;