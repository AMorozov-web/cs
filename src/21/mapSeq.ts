// Необходимо написать функцию, которая принимала бы любой Iterable объект и Iterable с функциями и возвращала итератор где каждому элементу левого Iterable последовательно применяются все функции из правого
const mapSeq = <T>(values: Iterable<T>, cbs: Iterable<(arg: T) => T>): IterableIterator<T> => {
    const valuesIter = values[Symbol.iterator]();

    const applyCbs = (value: T): T => {
        let result = value;

        for (const cb of cbs) {
            result = cb(result);
        }

        return result;
    }

    return {
        [Symbol.iterator]() {
            return this;
        },

        next() {
            const current = valuesIter.next();
            let value = current.value;

            if (!current.done) {
                value = applyCbs(value);
            }

            return {
                value,
                done: current.done,
            }
        }
    }
}

console.log(...mapSeq([1, 2, 3], [(el) => el * 2, (el) => el - 1])); // [1, 3, 5]
