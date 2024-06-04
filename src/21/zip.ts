// Необходимо написать функцию zip, которая бы принимала множество Iterable объектов и возвращала итератор по кортежам их элементов
const zip = (...iterables: Iterable<any>[]): IterableIterator<any> => {
    const sizes = iterables.map((it) => {
        if ('length' in it && typeof it.length === 'number') {
            return it.length;
        }

        if ('size' in it && typeof it.size === 'number') {
            return it.size;
        }

        return 0;
    });

    // Проверяем, чтобы размеры Iterable были одинаковые
    let firstSize: number;

    sizes.forEach((s) => {
        if (typeof firstSize === 'undefined') {
            firstSize = s;
        } else if (firstSize !== s) {
            throw new RangeError('All iterables sizes must be equal');
        }
    })

    const iterators = iterables.map((it) => it[Symbol.iterator]());

    return {
        [Symbol.iterator]() {
            return this;
        },

        next() {
            let done = false;
            const value = iterators.map((it) => {
                const current = it.next();

                if (current.done) {
                    done = current.done;
                }

                return current.value;
            });

            return {
                value: done ? undefined : value,
                done,
            }
        }
    }
};

console.log(...zip([1, 2], new Set([3, 4]), 'bl')); // [[1, 3, b], [2, 4, 'l']]
