

const indexedWrapper = <K extends string | number, V>(arg: Map<K, V>) => {
    return new Proxy(arg, {
        get(target, prop, receiver) {
            if (Number.isInteger(prop)) {
                let counter = Number(prop)

                for (const elem of target.values()) {
                    if (!counter) {
                        return elem;
                    }

                    counter--;
                }
            }

            const result = Reflect.get(target, prop, receiver);

            if (typeof result === 'function') {
                return result.bind(target);
            }

            return result;
        }
    }) as Map<K, V> & {[K: number]: V}
}


new Array(length).fill(0);


// Необходимо написать функцию, которая принимает Map/Set объект и возвращает обертку,
// которая может получать значение по числовым индексам

const indexedMap = indexedWrapper(new Map([
    ['key1', 'foo'],
    ['key2', 'bar'],
]));

console.log(indexedMap.get('key1') === indexedMap[0]);
