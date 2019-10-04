
/**
 * A semaphore class that runs a maximum number of Promises concurrently
 */
export default class Semaphore {
    constructor(maxConcurrentRequests=1) {
        this.currentRequests = [];
        this.runningRequests = 0;
        this.maxConcurrentRequests = maxConcurrentRequests;
    }    

    /**
     * Returns a Promise that will eventually return the result of the function passed in
     * Use this to limit the number of concurrent function executions
     * @param {*} fnToCall function that has a cap on the number of concurrent executions
     * @param  {...any} args any arguments to be passed to fnToCall
     */
    callFunction(fnToCall, ...args) {
        return new Promise((resolve, reject) => {
            this.currentRequests.push({
                resolve,
                fnToCall,
                args: [...args]
            });
            this.tryNext();
        })
    }

    tryNext() {
        if (!this.currentRequests.length) {
            return;
        } else if (this.runningRequests < this.maxConcurrentRequests) {
            let { resolve, fnToCall, args } = this.currentRequests.shift();
            this.runningRequests++;
            let req = fnToCall(...args);
            req.then((res) => {
                resolve(res);
            }).finally(() => {
                this.runningRequests--;
                this.tryNext()
            })
        } 
    }
}