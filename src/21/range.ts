// Необходимо написать класс Range, который бы позволял создавать диапазоны чисел или символов, а также позволял обходить элементы Range с любого конца

class MyRange<T extends string | number> {
    private readonly start: number;
    private readonly end: number;
    private readonly type: string;

    constructor(start: T, end: T) {
        this.checkRange(start, end);

        this.start = this.resolve(start);
        this.end = this.resolve(end);
        this.type = typeof start;
    }

    [Symbol.iterator]() {
        const that = this;

        let current = this.start;

        return {
            next() {
                const done = current > that.end;

                return {
                    value: done ? undefined : that.from(current++),
                    done,
                }
            }
        }
    }

    reverse() {
        const that = this;

        let current = this.end;

        return {
            [Symbol.iterator]() {
                return this;
            },

            next() {
                const done = current === that.start;

                return {
                    value: done ? undefined : that.from(current--),
                    done,
                }
            }
        }
    }

    private from(value: number): T {
        switch (this.type) {
            case 'string':
                return String.fromCodePoint(value) as T;
            default:
                return value as T;
        }
    }

    private resolve(value: T): number {
        switch (typeof value) {
            case 'number':
                return value;
            case 'string':
                return value.codePointAt(0)!;
            default:
                throw new TypeError(`This type - ${typeof value} - not supported`);
        }
    }

    private checkRange(start: T, end: T) {
        const startType = typeof start;
        const endType = typeof end;

        if (startType !== endType) {
            throw new TypeError(`Types of start and end values must be equal`);
        }
    }
}


const symbolRange = new MyRange('a', 'f');

console.log(Array.from(symbolRange)); // ['a', 'b', 'c', 'd', 'e', 'f']

const numberRange = new MyRange(-5, 1);

console.log(Array.from(numberRange.reverse())); // [1, 0, -1, -2, -3, -4, -5]
