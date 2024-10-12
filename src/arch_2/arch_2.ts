type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;


// Необходимо написать типовую функцию Last, которая возвращает последний элемент переданного массива или кортежа.

const test1: Last<[1, 2, 3]> = 3;
const test2: Last<[1]> = 1;

// never
// @ts-ignore
const test3: Last<[]>;

////////////////////////

type Tail<T extends unknown[]> = T extends [unknown, ...infer L] ? L : [];
type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never;

type Drop<T extends number, A extends unknown[], R extends unknown[] = []> = A['length'] extends 0
    ? R
    : R['length'] extends T
        ? R
        : Drop<T, Tail<A>, [...R, Head<A>]>;

type Drop2<T extends number, A extends unknown[], R extends unknown[] = []> = {
    0: R;
    1: Drop2<T, Tail<A>, [...R, Head<A>]>;
}[A['length'] extends 0 ? 0 : R['length'] extends T ? 0 : 1]

// Необходимо написать типовую функцию Drop, которая удаляет первые N Элементов из заданного массива или кортежа и возвращает массив удалаенных элементов.

const drop1: Drop<2, [1, 2, 3]> = [1, 2];
const drop2: Drop<1, [1, 2, 3]> = [1];
const drop3: Drop<3, []> = [];


///Необходимо написать типовую функцию Reverse, которая возвращает переданный массив или кортеж в обратном порядке и возвращает массив удаленных элементов.

type Reverse<T extends unknown[], R extends unknown[] = []> = T['length'] extends 0 ? R : Reverse<Tail<T>, [Head<T>, ...R]>;

const rev1: Reverse<[1, 2, 3]> = [3, 2, 1];
const rev2: Reverse<[1]> = [1];
const rev3: Reverse<[]> = [];
