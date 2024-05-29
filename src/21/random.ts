// Необходимо написать итератор для генерации случайных чисел по заданным параметрам

const random = (min: number, max: number): IterableIterator<number> => {
    const get = (): number => {
        return Math.floor(Math.random() * (max - min) + min);
    }

    return {
        [Symbol.iterator]() {
            return this;
        },

        next(): IteratorResult<number> {
            return {
                done: false,
                value: get(),
            }
        }
    }
}


const randomInt = random(0, 100);

console.log(randomInt.next());
console.log(randomInt.next());
console.log(randomInt.next());
console.log(randomInt.next());
