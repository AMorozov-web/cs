interface ValuesList<K = unknown, T = unknown> {
    value: [K, T];
    next: ValuesList<K, T> | null;
}

const GET_OBJECT_HASH_SYMBOL = Symbol('GetHash');

class HashMap<K, V> {
    private buffer: (ValuesList<K, V> | null)[];
    size: number = 0;

    constructor(maxSize: number) {
        this.buffer = Array.from({length: maxSize}, () => null);
    }

    has(key: K): boolean {
        let result = false;

        const index = this.getIndex(key);
        const item = this.buffer[index];

        if (!item) {
            return result;
        }

        let current: ValuesList<K, V> | null = item;

        while (current) {
            const {value: [itemKey]} = current;

            if (itemKey === key) {
                result = true;
                break;
            }

            current = current.next;
        }

        return result;
    }

    get(key: K): V | undefined {
        let result: V | undefined = undefined;

        const index = this.getIndex(key);
        const item = this.buffer[index];

        if (!item) {
            return result;
        }

        let current: ValuesList<K, V> | null = item;

        while (current) {
            const {value: [itemKey, itemValue]} = current;

            if (itemKey === key) {
                result = itemValue;
                break;
            }

            current = current.next;
        }

        return result;
    }

    set(key: K, value: V): HashMap<K, V> {
        if (this.size >= this.buffer.length / 2) {
            this.rehash();
        }

        const index = this.getIndex(key);
        const item = this.buffer[index];

        if (!item) {
            this.buffer[index] = {value: [key, value], next: null};
            this.size++;

            return this;
        }

        let current: ValuesList<K, V> | null = item;

        while (current) {
            const currentKey = current.value[0];

            if (currentKey === key) {
                current.value[1] = value;
                break;
            }

            if (!current.next) {
                current.next = {value: [key, value], next: null};
                this.size++;
                break;
            }

            current = current.next;
        }

        return this;
    }

    delete(key: K): boolean {
        let result = false;

        const index = this.getIndex(key);
        const item = this.buffer[index];

        if (!item) {
            return result;
        }

        if (item.value[0] === key && !item.next) {
            this.buffer[index] = null;
            result = true;
            this.size--;

            return result;
        }

        let prev = item;
        let current = item.next;

        while (current) {
            const {value: [itemKey]} = current;

            if (itemKey !== key) {
                prev = current;
                current = prev.next;
            } else {
                prev.next = current.next;
                result = true;
                this.size--;

                break;
            }
        }

        return result;
    }

    *entries(): IterableIterator<[K, V]> {
        for (const item of this.buffer) {
            if (!item) {
                continue;
            }

            let current: ValuesList<K, V> | null = item;

            while (current) {
                const {value: [itemKey, itemValue]} = current;
                current = current.next;
                yield [itemKey, itemValue];
            }
        }
    }

    private rehash() {
        const oldEntries = [...this.entries()];
        const length = this.buffer.length * 2;
        this.buffer = Array.from({length}, () => null);

        oldEntries.forEach(([key, value]) => {
            this.set(key, value);
        });
    }

    private getIndex(key: K): number {
        let hash: number;

        switch (typeof key) {
            case 'number':
                hash = this.getNumberHash(key);
                break;
            case 'string':
                hash = this.getStringHash(key);
                break;
            case 'object':
            case 'function':
                hash = this.getObjectHash(key);
                break;
            default:
                hash = this.getStringHash(String(key));
        }

        return hash % this.buffer.length;
    }

    private getStringHash(key: string): number {
        let hash = 0x811C9DC5;

        for (let i = 0; i < key.length; i++) {
            hash ^= key.charCodeAt(i);
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        }

        return hash >>> 0;
    }

    private getNumberHash(key: number): number {
        return key;
    }

    private getObjectHash(key: object | null): number {
        if (key === null) {
            return 0;
        }

        if (GET_OBJECT_HASH_SYMBOL in key) {
            return key[GET_OBJECT_HASH_SYMBOL] as number;
        }

        const hash = (Math.random() * (Number.MAX_SAFE_INTEGER - 1) + 1) >>> 0;

        Object.defineProperty(key, GET_OBJECT_HASH_SYMBOL, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: hash,
        })

        return hash;
    }
}


// Задаем ёмкость внутреннего буфера
//FIXME needed correct typings for get method
const randomObj = performance;

const map = new HashMap(120);

map.set('foo', 1);
map.set(42, 10);
map.set(randomObj, 100);

console.log(map.get('foo'));          // 1
console.log(map.get(42));          // 10
console.log(map.has(randomObj));    // true
console.log(map.delete(randomObj)); // 10
console.log(map.has(randomObj));    // false
