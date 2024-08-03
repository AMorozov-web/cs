function curry(fn: Function) {
    return function curried(this: unknown, ...args: unknown[]) {
        if (args.length >= fn.length && args.every((item) => item !== curry._)) {
            return fn.apply(this, args);
        }

        return function (this: unknown, ...newArgs: unknown[]) {
            const combinedArgs = [];
            let counter = 0;

            for (let i = 0; i < args.length; i++) {
                if (args[i] === curry._ && counter < newArgs.length) {
                    combinedArgs.push(newArgs[counter++]);
                } else {
                    combinedArgs.push(args[i]);
                }
            }

            return curried.apply(this, [
                ...combinedArgs,
                ...newArgs.slice(counter),
            ]);
        }
    }
}

curry._ = Symbol('placeholder');

const diff = curry((a: number, b: number) => a - b);

console.log(diff(curry._, 10)(15)); // 5
