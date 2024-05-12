type MatrixArrayTypes =
    | Uint8ClampedArray
    | Uint8Array
    | Int8Array
    | Uint16Array
    | Int16Array
    | Uint32Array
    | Int32Array
    | Float32Array
    | Float64Array
    | BigUint64Array
    | BigInt64Array;

type MatrixArrayConstructor<T extends MatrixArrayTypes> = new (capacity: number) => T;

type MatrixArrayValue<T extends MatrixArrayTypes> = T extends (BigUint64Array | BigInt64Array) ? bigint : number;

interface ChangeMultiplyOrderFunction {
    (prevOrder: number[]): number[];
}

export class Matrix<T extends MatrixArrayTypes> {
    private readonly array: T;
    private multiply: number[];
    dimensions : number[];


    constructor(TypedArrayConstructor: MatrixArrayConstructor<T>, ...dimensions: number[]) {
        if (dimensions.some((value) => value < 1 || value % 1 > 0)) {
            throw new TypeError('Each dimension must be greater or equal than 1 and no contain fractional values');
        }

        const capacity = dimensions.reduce((result, current) => result * current, 1);

        this.array = new TypedArrayConstructor(capacity);
        this.dimensions = dimensions;
        //Заранее рассчитываем множители для каждой из координат по порядку - каждая координата, кроме первой,
        //будет умножаться на произведение размеров предшествующих ей осей. Множитель первой - 1
        this.multiply = dimensions.map((_, index) => index ? dimensions.slice(0, index).reduce((a, b) => a * b, 1) : 1);
    }

    /**
     * Позволяет изменить порядок множителей, что в конечном итоге меняет расположение элементов в памяти,
     * соответственно и их порядок обхода итератором
     */
    setMultiplyOrder(func: ChangeMultiplyOrderFunction): void {
        this.multiply = func(this.multiply);
    }

    set(...args: [...coords: number[], value: MatrixArrayValue<T>]): void {
        const coords = args.slice(0, -1) as number[];
        const value = args.pop() as MatrixArrayValue<T>;

        const index = this.getIndex(coords);

        this.array[index] = value;
    }

    get(...coords: number[]): MatrixArrayValue<T> {
        const index = this.getIndex(coords);

        return this.array[index] as MatrixArrayValue<T>;
    }

    get buffer(): ArrayBuffer {
        return this.array.buffer;
    }

    *values(): IterableIterator<MatrixArrayValue<T>> {
        for (const value of this.array) {
            yield value as MatrixArrayValue<T>;
        }
    }

    private getIndex(coords: number[]): number {
        if (coords.length !== this.dimensions.length) {
            throw new RangeError('Extra coordinates found');
        }

        return coords.reduce((result, current, index) => result + current * this.multiply[index], 0);
    }
}

// const matrix2n2n2 = new Matrix(Int32Array, 2, 2, 2);
//
// matrix2n2n2.setMultiplyOrder(([a, b, c]) => [c, a, b]); // Меняем множители таким образом, чтобы значения шли подряд в итераторе
//
// matrix2n2n2.set(0, 0, 0, 1);
// matrix2n2n2.set(0, 1, 0, 2);
// matrix2n2n2.set(0, 0, 1, 3);
// matrix2n2n2.set(0, 1, 1, 4);
//
// matrix2n2n2.set(1, 0, 0, 5);
// matrix2n2n2.set(1, 1, 0, 6);
// matrix2n2n2.set(1, 0, 1, 7);
// matrix2n2n2.set(1, 1, 1, 8);
//
// matrix2n2n2.get(0, 0, 0); // 1
// matrix2n2n2.get(0, 1, 0); // 2
// matrix2n2n2.get(0, 0, 1); // 3
// matrix2n2n2.get(0, 1, 1); // 4
//
// matrix2n2n2.get(1, 0, 0); // 5
// matrix2n2n2.get(1, 1, 0); // 6
// matrix2n2n2.get(1, 0, 1); // 7
// matrix2n2n2.get(1, 1, 1); // 8
//
// console.log('matrix buffer', matrix2n2n2.buffer);  // Ссылка на ArrayBuffer
// console.log('matrix values', Array.from(matrix2n2n2.values()));
