class Result<T, E = unknown> {
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

    static reject<T>(value: T): Result<any, T> {
        return new Result(() => {
            throw value
        });
    }

    static unwrap<T, E>(value: T | Result<T, E>):  T {
        return value instanceof Result ? value.unwrap()! : value;
    }

    then(cb: (data: T) => void) {
        if (this.state === 'OK') {
            cb(this.result!)
        }

        return this;
    }

    catch<TRes, TErr>(cb: (err: E) => Result<TRes, TErr> | TRes): Result<TRes, TErr> | Result<T> {
        if (this.state === 'OK') {
            return Result.resolve(this.result!)
        }

        return new Result<TRes, TErr>(() => Result.unwrap(cb(this.error!)));
    }

    unwrap() {
        if (this.state === 'OK') {
            return this.result;
        }

        throw this.error;
    }

    flatMap<R>(func: (value: T) => Result<R> | R): Result<R> | Result<never, E> {
        if (this.state === 'ERR') {
            return Result.reject(this.error!)
        }

        return new Result<R>(() => Result.unwrap(func(this.result!)));
    }
}

const res = new Result(() => 42);

res.flatMap((_value) => Result.reject('Boom')).catch(console.error);
