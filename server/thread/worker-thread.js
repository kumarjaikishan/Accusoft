const { parentPort } = require('node:worker_threads');

parentPort.on("message", (data)=>{
    const {delay} = data;
    function delaye(n){
        let nowe = Date.now();
        let j = 0;
        for (let i = 0; Date.now() - nowe < n; i++) {
            j++
        }
        return j;
    }
    let count = delaye(delay);
    
parentPort.postMessage(count);
})


