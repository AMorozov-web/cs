// Необходимо написать функцию sleep, которая бы принимала заданное количество миллисекунд и возвращала Promise

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

sleep(100).then(() => {
    console.log(`I'm awake!`);
});

// Необходимо написать функцию timeout, которая бы принимала Promise и заданное количество миллисекунд и возвращала Promise

const timeout = <T extends Promise<any>>(promise: T, ms: number): T => {
    return Promise.race([promise, new Promise((_, reject) => setTimeout(reject, ms, 'Timeout'))]) as T
};

// Через 200 мс Promise будет зареджекчен
timeout(fetch('//my-data'), 200).then(console.log).catch(console.error);

// Необходимо написать функцию setImmediate/clearImmediate по аналогии с node.js

const mySetImmediate = (task: () => void) => {
    let canceled = false;

    const wrapper = () => {
        if (canceled) {
            return;
        }

        task();
    }

    queueMicrotask(wrapper);

    return {
        cancel() {
            canceled = true;
        }
    };
}

const myClearImmediate = (task:  { cancel(): void }) => {
    task.cancel();
}

const sub = mySetImmediate(() => console.log('I awake!'));
myClearImmediate(sub);

////////////////////////

const promisify = (fn: (...args: [...unknown[], (err: unknown, content: unknown) => void]) => void) => {
    return function (...args: unknown[]) {
        return new Promise((res, rej) => {
            if (args.length !== fn.length - 1) {
                rej(new TypeError('Invalid args'));
            }

            const cb = (err: unknown, content: unknown) => {
                if (err) {
                    rej(err);
                } else {
                    res(content);
                }
            }

            fn(...args, cb);
        });
    }
}


function readFile(_file: unknown, cb: (err: unknown, content: unknown) => void) {
    cb(null, 'fileContent');
}

// @ts-ignore
const readFilePromise = promisify(readFile);
readFilePromise('my-file.txt').then(console.log).catch(console.error);

/////////////////////////

const allLimit = (iterable: Iterable<() => any | PromiseLike<any>>, limit: number): Promise<any[]> => {
    let rejected = false;

    if (limit <= 0 || !Number.isInteger(limit)) {
        throw new TypeError('Limits must be a positive integer');
    }

    return new Promise((resolve, rej) => {

        const promises = Array.from(iterable);
        const promiseIter = promises.entries();
        const res = new Array(promises.length);
        let resolved = 0;

        const cb = () => {
            if (rejected) {
                return;
            }

            const {value} = promiseIter.next()

            if (!value) {
                return;
            }

            const [index, fn] = value;

            Promise.resolve(fn()).then((value) => {
                res[index] = value;
                resolved++;

                if (resolved === promises.length) {
                    resolve(res);
                } else {
                    cb();
                }

            }).catch((err) => {
                rejected = true;
                rej(err);
            });
        }

        while (limit > 0 && !rejected) {
            limit--;
            cb();
        }
    })


}


allLimit([], 2).then(console.log).catch(console.error);

