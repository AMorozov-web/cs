type DequeueArrayTypes =
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

type DequeueArrayConstructor<T extends DequeueArrayTypes> = new (capacity: number) => T;

type DequeueArrayValue<T extends DequeueArrayTypes> = T extends (BigUint64Array | BigInt64Array) ? bigint : number;

class DoubleLinkedListNode<T> {
    value: T;
    next: DoubleLinkedListNode<T> | null;
    prev: DoubleLinkedListNode<T> | null;

    constructor(value: T) {
        this.value = value
        this.next = null;
        this.prev = null;
    }
}

class DoubleLinkedList<T> {
    head: DoubleLinkedListNode<T> | null;
    tail: DoubleLinkedListNode<T> | null;
    length: number;

    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    clear(): void {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    push(value: T): number {
        const node = new DoubleLinkedListNode<T>(value);

        if (!this.tail) {
            this.setFirstNode(node);
        } else {
            const prev = this.tail;

            prev.next = node;
            node.prev = prev;
            this.tail = node;
        }

        this.length++;

        return this.length;
    }


    unshift(value: T): number {
        const node = new DoubleLinkedListNode<T>(value);

        if (!this.head) {
            this.setFirstNode(node);
        } else {
            const next = this.head;

            next.prev = node;
            node.next = next;
            this.head = node;
        }

        this.length++;

        return this.length;
    }

    pop(): T | null {
        if (!this.tail) {
            return null;
        }

        const el = this.tail;

        if (!el.prev) {
            this.clear();
        } else {
            this.tail = el.prev;
            el.prev.next = null;
        }

        this.length--;

        return el.value;
    }

    shift(): T | null {
        if (!this.head) {
            return null;
        }

        const el = this.head;

        if (!el.next) {
            this.clear();
        } else {
            this.head = el.next;
            el.next.prev = null;
        }

        this.length--;

        return el.value;
    }

    private setFirstNode(node: DoubleLinkedListNode<T>): void {
        this.head = node;
        this.tail = node;
    }
}

class Dequeue<T extends DequeueArrayTypes> {
    private readonly TypedArrayConstructor: DequeueArrayConstructor<T>;
    private readonly capacity: number;
    private readonly list: DoubleLinkedList<T>;

    private leftIndex: number | null;
    private rightIndex: number | null;

    length: number;

    constructor(TypedArrayConstructor: DequeueArrayConstructor<T>, capacity: number) {
        if (capacity < 0 || capacity % 1 !== 0) {
            throw new TypeError('Invalid capacity');
        }

        this.TypedArrayConstructor = TypedArrayConstructor;
        this.capacity = capacity;
        this.length = 0;
        this.list = new DoubleLinkedList<T>();
        this.list.push(new this.TypedArrayConstructor(this.capacity));
        this.leftIndex = null;
        this.rightIndex = null;
    }

    pushLeft(value: DequeueArrayValue<T>): number {
        if (this.leftIndex === null) {
            this.initIndexes();
        } else {
            this.leftIndex--;

            if (this.leftIndex < 0) {
                this.leftIndex = this.capacity - 1;

                this.list.unshift(new this.TypedArrayConstructor(this.capacity));
            }
        }

        this.list.head!.value[this.leftIndex!] = value;
        this.length++;

        return this.length;
    }

    pushRight(value: DequeueArrayValue<T>): number {
        if (this.rightIndex === null) {
            this.initIndexes();
        } else {
            this.rightIndex++;

            if (this.rightIndex >= this.capacity) {
                this.rightIndex = 0;

                this.list.push(new this.TypedArrayConstructor(this.capacity));
            }
        }

        this.list.tail!.value[this.rightIndex!] = value;
        this.length++;

        return this.length;
    }

    popLeft(): DequeueArrayValue<T> | undefined  {
        if (this.leftIndex === null || this.rightIndex === null) {
            return undefined;
        }

        const value = this.list.head!.value[this.leftIndex];

        this.leftIndex++;

        if (this.list.head === this.list.tail && this.leftIndex > this.rightIndex) {
            this.dropIndexes();
        }

        if (this.leftIndex >= this.capacity) {
            this.leftIndex = 0;
            this.list.shift();
        }

        return value as DequeueArrayValue<T>;
    }

    popRight(): DequeueArrayValue<T> | undefined {
        if (this.leftIndex === null || this.rightIndex === null) {
            return undefined;
        }

        const value = this.list.tail!.value[this.rightIndex];

        this.rightIndex--;

        if (this.list.head === this.list.tail && this.rightIndex < this.leftIndex) {
            this.dropIndexes();
        }

        if (this.rightIndex < 0) {
            this.rightIndex = this.capacity - 1;
            this.list.pop();
        }

        return value as DequeueArrayValue<T>;
    }

    private initIndexes(): void  {
        const newIndex = Math.floor(this.capacity / 2);

        this.leftIndex = newIndex;
        this.rightIndex = newIndex;
    }

    private dropIndexes(): void  {
        this.leftIndex = null;
        this.rightIndex = null;
    }
}

// Тип массива и его емкость
const dequeue = new Dequeue(Uint8Array, 4);

dequeue.pushLeft(1); // Возвращает длину - 1
dequeue.pushLeft(2); // 2
dequeue.pushLeft(3); // 3

console.log(dequeue.length); // 3
dequeue.popLeft();           // Удаляет с начала, возвращает удаленный элемент - 3

dequeue.pushRight(4);
dequeue.pushRight(5);
dequeue.pushRight(6);

dequeue.popRight();           // Удаляет с конца, возвращает удаленный элемент - 6
