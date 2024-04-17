type TypedArrayTypes =
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

type TypedArrayConstructor<T extends TypedArrayTypes> = new (capacity: number) => T;

type TypedArrayValue<T extends TypedArrayTypes> = T extends (BigUint64Array | BigInt64Array) ? bigint : number;

type Options = {
    capacity?: number;
}

class Vector<T extends TypedArrayTypes> {
    private DEFAULT_CAPACITY = 1;
    private INCREASE_CAPACITY_STEP = 2;
    private array: T;
    private readonly TypedArrayConstructor: TypedArrayConstructor<T>;

    capacity: number;
    length: number;

    constructor(TypedArrayConstructor: TypedArrayConstructor<T>, options?: Options) {
        this.TypedArrayConstructor = TypedArrayConstructor;

        if (options?.capacity && (options.capacity < 0 || options.capacity % 2)) {
            throw RangeError('Invalid capacity');
        }

        const capacity = options?.capacity ?? this.DEFAULT_CAPACITY;
        this.array = new TypedArrayConstructor(capacity);
        this.capacity = capacity;
        this.length = 0;
    }

    get buffer(): ArrayBuffer {
        return this.array.buffer;
    }

    *values(): IterableIterator<TypedArrayValue<T>> {
        for (let i = 0; i < this.length; i++) {
            yield this.array[i] as TypedArrayValue<T>;
        }
    }

    shrinkToFit(): number {
        const currentLength = this.length;

        if (currentLength === this.capacity) {
            return this.capacity;
        }

        this.changeArrayCapacity(currentLength);

        return this.capacity;
    }

    push(...values: TypedArrayValue<T>[]): number {
        let newLength = this.length + values.length;

        if (newLength > this.capacity) {
            let newCapacity = this.capacity;

            while (newCapacity <= newLength) {
                newCapacity *= this.INCREASE_CAPACITY_STEP;
            }

            this.changeArrayCapacity(newCapacity);
        }

        values.forEach((item) => {
            this.array[this.length] = item;
            this.length++;
        })

        return this.length;
    }

    pop(): TypedArrayValue<T> | undefined {
        if (!this.length) {
            return undefined;
        }

        this.length--;
        return this.array[this.length] as TypedArrayValue<T>;
    }

    private changeArrayCapacity(newCapacity: number): void {
        const newArray = new this.TypedArrayConstructor(newCapacity);

        this.array.forEach((item, i) => {
            newArray[i] = item;
        })

        this.array = newArray;
        this.capacity = newCapacity;
    }
}


const vec = new Vector(Int32Array, {capacity: 4});

vec.push(1); // Возвращает длину - 1
vec.push(2); // 2
vec.push(3); // 3
vec.push(4); // 4
vec.push(5); // 5 Увеличение буфера

console.log(vec.capacity); // 8
console.log(vec.length);   // 5

vec.pop(); // Удаляет с конца, возвращает удаленный элемент - 5

console.log(vec.capacity); // 8

vec.shrinkToFit();         // Новая емкость 4
console.log(vec.capacity); // 4

console.log(vec.buffer);   // Ссылка на ArrayBuffer
