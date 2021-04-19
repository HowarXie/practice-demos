const PromiseStatus = {
    pending: "pending",
    fulfilled: "fulfilled",
    rejected: "rejected"
}

class MyPromise {
    constructor(excutor) {
        this.status = PromiseStatus.pending;
        this.value = void 0;
        this.reason = void 0;
        this.resolves = [];
        this.rejects = [];

        try {
            excutor((value) => this.onResolve(value), () => this.onReject());
        } catch (e) {
            this.onReject(e);
        }
    }

    static all(promises) {
        return new MyPromise((resolve, reject) => {
            let count = 0;
            const allValues = [];
            
            promises.forEach((promise, index) => {
                promise.then((value) => {
                    allValues[index] = value;
                    count++;

                    if (count === promises.length) {
                        resolve(allValues);
                    }
                }, (reason) => {
                    reject(reason);
                })
            })
        })
    }

    static resolve(value) {
        return new MyPromise((onResolve) => {
            onResolve(value);
        })
    }

    static reject(reason) {
        return new MyPromise((onResolve, onRejected) => {
            onRejected(reason)
        })
    }

    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            onFulfilled = typeof onFulfilled === "function" ? onFulfilled : function (value) { return value; };
            onRejected = typeof onRejected === "function" ? onRejected : function (reason) { return reason; };

            if (this.status === PromiseStatus.pending) {
                this.resolves.push((value) => resolve(onFulfilled(value)));
                this.rejects.push((reason) => reject(onRejected(reason)))
            }

            if (this.status === PromiseStatus.fulfilled) {
                setTimeout(() => {
                    resolve(onFulfilled(this.value));
                });
            }

            if (this.status === PromiseStatus.rejected) {
                setTimeout(() => {
                    reject(onRejected(this.reason));
                });
            }
        });
    }

    onResolve(value) {
        if (this.status === PromiseStatus.pending) {
            this.status = PromiseStatus.fulfilled;
            this.value = value;

            this.resolves.forEach(resolve => resolve(this.value));
            this.resolves = [];
        }
    }

    onReject(reson) {
        if (this.status === PromiseStatus.pending) {
            this.status = PromiseStatus.rejected;
            this.reason = reson;

            this.rejects.forEach(reject => reject(ths.reason));
            this.rejects = [];
        }
    }

    catch(errorFun) {
        this.then(null, errorFun);
    }
}


console.log("start");

new MyPromise((resolve, reject) => {
    console.log("excuting");
    resolve("aa");
}).then(value => {
    console.log(value);
})

console.log("end");