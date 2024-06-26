import {random} from './random';

// Необходимо написать функцию take, которая принимает любой Iterable объект и возвращает итератор по заданному количеству его элементов

export const take = <T extends IterableIterator<any>>(iter: T, limit: number): T => {
    let counter = limit;

    return {
        [Symbol.iterator]() {
            return this;
        },

        next() {
            if (!counter) {
                return {
                    done: true,
                    value: undefined,
                }
            }

            const current = iter.next();
            const done = current.done;
            const value = done ? undefined : current.value;

            if (!done) {
                counter--;
            }

            return {
                value,
                done,
            }
        }
    } as T
}

const randomInt = random(0, 100);

console.log('take', [...take(randomInt, 5)]);
