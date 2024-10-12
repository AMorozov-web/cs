
const READONLY = Symbol('readonly');

const readonly = <T extends object>(obj: T): Readonly<T> => {
    const newObj = {};

    Object.defineProperty(newObj, READONLY, {
        value: new Map(),
    })

    Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(([key, desc]) => {
        Object.defineProperty(newObj, key, {
            enumerable: desc.enumerable,
            configurable: desc.configurable,
            get() {
                let a;

                if (desc?.get) {
                    a = desc.get.call(newObj);
                } else {
                    a = desc.value
                }

                if (a !== null && typeof a === 'object') {
                    // @ts-ignore
                    const map =  newObj[READONLY]

                    if (!map.has(key)) {
                        map.set(key, readonly(a));
                    }

                    return map.get(key);
                }

                return a;
            },
        })
    })

    return newObj as Readonly<T>;
}

const obj = {
    a: 1,
    b: [1, 2, 3],
    mutate() {
       this.a++;
    },
    get c() {
      return this.a++;
    }
};

const readonlyObj = readonly(obj);

readonlyObj.b[0]++;
console.log(readonlyObj.b[0]);
/// true
console.log(readonlyObj.a === 1);

readonlyObj.mutate();

/// true
console.log(readonlyObj.a === 1);

readonlyObj.b.push(10);

// [1, 2, 3]
console.log(readonlyObj.b);

obj.a++;

/// true
console.log(readonlyObj.a === 2);
