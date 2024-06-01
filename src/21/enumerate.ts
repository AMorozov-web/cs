import {random} from './random';
import {take} from './take';

// Необходимо написать функцию enumerate, которая принимает любой Iterable объект и возвращает итератор по парам (номер итерации, элемент)

const enumerate = <T>(iter: IterableIterator<T>): IterableIterator<[number, T]> => {
    let counter = 0;

    return {
        [Symbol.iterator]() {
            return this;
        },

        next() {
            const {done, value} = iter.next();

            return {
                value: [done ? counter : counter++, value],
                done,
            }
        }
    }
}

const randomInt = random(0, 100);

console.log([...take(enumerate(randomInt), 3)]); // [[0, ...], [1, ...], [2, ...]]
