// Необходимо написать функцию seq, которая бы принимала множество Iterable объектов и возвращала итератор по их элементам
const seq = (...iterables: Iterable<any>[]): IterableIterator<any> => {
    const iterators = iterables.map((it) => it[Symbol.iterator]());

    let cursor = 0;

    return {
        [Symbol.iterator]() {
            return this;
        },

        next() {
            while (cursor < iterators.length) {
                const current = iterators[cursor].next();

                if (current.done) {
                    cursor++;
                    continue;
                }

                return current;
            }

            return {value: undefined, done: true};
        }
    }
};

console.log(...seq([1, 2], new Set([3, 4]), 'bla')); // 1, 2, 3, 4, 'b', 'l', 'a'
