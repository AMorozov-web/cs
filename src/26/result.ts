export class Result<T, E> {
    result?: T;
    error?: E;
    state: 'OK' | 'ERR';

    constructor(executor: () => T) {
        try {
            this.result = executor();
            this.state = 'OK';
        } catch (e) {
            this.error = e as E;
            this.state = 'ERR';
        }
    }

    static resolve<T, E>(value: T | Result<T, E>): Result<T, E> {
        return value instanceof Result ? value : new Result(() => value);
    }

    then(cb: (data: T) => void) {
        if (this.state === 'OK') {
            cb(this.result!)
        }

        return this;
    }

    catch(cb: (err: E) => void) {
        if (this.state === 'ERR') {
            cb(this.error!)
        }

        return this;
    }
}

// const res1 = new Result(() => 42);
//
// res1.then((data) => {
//     console.log(data);
// });
//
// const res2 = new Result(() => { throw 'Boom!'; });
//
// res1.then((data) => {
//     // Этот callback не вызовется
//     console.log(data);
//
// // А этот вызовется
// }).catch(console.error);

const exec = <T, E>(gen: () => Generator<Result<T, E>>) => {
    const iterator = gen();
    let data;
    let returnValue;

    while (true) {
        if (returnValue) {
            return returnValue;
        }

        const {done, value} = iterator.next(data);
        const resolved = Result.resolve(value);

        if (done) {
            return resolved;
        }

        resolved.then((value) => {
            data = value;
        }).catch((err) => {
            try {
                data = iterator.throw(err).value;

            } catch (e) {
                returnValue = new Result(() => {
                    throw e;
                });
            }
        })
    }
}

exec(function* main() {
    const res1 = new Result(() => 42);
    console.log(yield res1);

    try {
        const res2 = yield new Result(() => { throw 'Boom!'; });
        console.log(res2);

    } catch (err) {
        console.error(err);
    }
});
