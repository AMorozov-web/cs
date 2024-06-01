import {random} from './random';
import {take} from './take';

// Необходимо написать функцию filter, которая принимает любой Iterable объект и функцию-предикат. И возвращает итератор по элементам которые удовлетворяют предикату.
type IterValue<T> = T extends IterableIterator<infer V> ? V : never;

const filter = <T extends IterableIterator<any>>(iter: T, predicate: (value: IterValue<T>) => boolean) => {
    return {
        [Symbol.iterator]() {
            return this;
        },

        next() {
            let current = iter.next();

            while (!current.done) {
                if (predicate(current.value)) {
                    break;
                }

                current = iter.next();
            }

            return current;
        }
    } as T
}

const randomInt = random(0, 100);

console.log('filter', [...take(filter(randomInt, (el) => el > 30), 5)]);
