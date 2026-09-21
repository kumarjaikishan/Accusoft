
const asyncHandler = require('../utils/asyncHandler')
const {Worker}= require('node:worker_threads');

function delaye(n){
    let nowe = Date.now();
    let j = 0;
    for (let i = 0; Date.now() - nowe < n; i++) {
        j++
    }
    return j;
}

const stillslow = asyncHandler(async (req, res, next) => {
    const delay = req.body.delay;
    let count = delaye(delay);
        res.status(200).json({
            message: `Server Slow By ${delay}`
        }) 
})

const slow = asyncHandler(async (req, res, next) => {
    const delay = req.body.delay;
    // console.log(delay);
    const worker = new Worker('./thread/worker-thread.js');
    worker.postMessage({ delay });

    worker.on("message",(j)=>{
        res.status(200).json({
            message: `slow page by ${delay}`
        })
    })  
})



module.exports = {stillslow, slow } 