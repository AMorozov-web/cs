interface StructureApi<T> {
    get(): T,
    set(value: T): void,
}

interface StructureType<T = unknown> {
    /**
     * @param buffer - массив байт (буфер)
     * @param offset - офсет в байтах
     */
    api(buffer: ArrayBuffer, offset: number): StructureApi<T>;
    /** Сколько байт занимает значение свойства в буфере */
    length: number,
}

interface StringEncoding {
    ASCII(maxLength: number): StructureType<string>;
}

type CreatedStructure<T extends Record<string, unknown> | unknown[]> = T & {
    buffer: ArrayBuffer;
    size: number;
}

class Structure {
    private readonly scheme: Record<string, StructureType>;
    readonly size: number;

    constructor(scheme: Record<string, Structure | StructureType>) {
        const flatScheme: Record<string, StructureType> = {};
        let size = 0;

        Object.entries(scheme).forEach(([key, type]) => {
            const value = type instanceof Structure ? type.toStructureType() : type;

            flatScheme[key] = value;
            size += value.length;
        })

        this.scheme = flatScheme;
        this.size = size;
    }

    create<T extends Record<string, unknown> | unknown[]>(data: T, buffer = new ArrayBuffer(this.size), offset = 0): CreatedStructure<T> {
        const size = this.size;
        let currentOffset = offset;

        const result = {
            buffer,
            size,
        } as CreatedStructure<T>;

        Object.entries(this.scheme).forEach(([key, {api, length}]) => {
            const {get, set} = api(buffer, currentOffset);

            const value = data[key as keyof T];
            set(value);

            Object.defineProperty(result, key, {
                enumerable: true,
                configurable: true,
                get,
                set,
            })

            currentOffset += length;
        })


        return result;
    }

    from<T extends Record<string, unknown>>(buffer: ArrayBuffer, offset = 0): CreatedStructure<T> {
        const size = this.size;
        let currentOffset = offset;

        const result = {
            buffer,
            size,
        } as CreatedStructure<T>;

        Object.entries(this.scheme).forEach(([key, {api, length}]) => {
            const {get, set} = api(buffer, currentOffset);

            Object.defineProperty(result, key, {
                enumerable: true,
                configurable: true,
                get,
                set,
            })

            currentOffset += length;
        })


        return result;
    }

    toStructureType(): StructureType {
        const that: Structure = this;

        return {
            api(buffer: ArrayBuffer, offset: number): StructureApi<unknown> {
                let result = that.from(buffer, offset);

                return {
                    get() {
                        return result;
                    },
                    set<T extends Record<string, unknown>>(value: T): void {
                        result = that.create(value, buffer, offset);
                    },
                }
            },
            get length(): number {
                return that.size;
            }
        }
    }


    static get U8(): StructureType<number> {
        const SIZE = 1;
        return {
            api(buffer: ArrayBuffer, offset: number): StructureApi<number> {
                return {
                    get(): number {
                        return new Uint8Array(buffer, offset, SIZE)[0];
                    },

                    set(value: number): void {
                        new Uint8Array(buffer, offset, SIZE)[0] = value;
                    },
                }
            },
            get length(): number {
                return SIZE;
            }

        }
    }

    static U(bits: number): StructureType<number> {
        if (bits > 32) {
            throw new RangeError('Bits must be lower than 32');
        }

        const bytesNeeded = Math.ceil(bits / 8);

        return {
            api(buffer: ArrayBuffer, offset: number): StructureApi<number> {
                return {
                    get(): number {
                        const view = new Uint8Array(buffer, offset, bytesNeeded);

                        return view.reduce((total, current, index) => total += (current << (index * 8)), 0);
                    },

                    set(value: number): void {
                        const createMask = (shift: number) => {
                            return ~0 >>> 24 << shift;
                        }

                        const view = new Uint8Array(buffer, offset, bytesNeeded);

                        for (let i = 0; i < bytesNeeded; i++) {
                            const shift = i * 8;

                            view[i] = value & createMask(shift) >>> shift;
                        }
                    },
                }
            },
            get length(): number {
                return bytesNeeded;
            }
        }
    }

    static get String(): StringEncoding {
        return {
            ASCII(maxLength: number): StructureType<string> {
                return {
                    api(buffer: ArrayBuffer, offset: number): StructureApi<string> {
                        return {
                            get(): string {
                                const view = new Uint8Array(buffer, offset, maxLength);

                                return view.reduce((total, current) => total += String.fromCharCode(current), '');
                            },

                            set(value: string): void {
                                const view = new Uint8Array(buffer, offset, maxLength);

                                for (let i = 0; i < maxLength; i++) {
                                    view[i] = value.charCodeAt(i);
                                }
                            },
                        }
                    },

                    get length(): number {
                        return maxLength;
                    }
                }
            }
        }
    }

    static Tuple(...values: StructureType[]): Structure {
        const scheme = values.reduce<Record<string, StructureType>>((total, current, index) => {
            total[String(index)] = current;

            return total;
        }, {});

        return new Structure(scheme);
    }
}


const Skills = new Structure({
    singing: Structure.U8, // Unsigned число 8 бит
    dancing: Structure.U8,
    fighting: Structure.U8
});

// Кортеж из 3-х чисел
const Color = Structure.Tuple(Structure.U8, Structure.U8, Structure.U8);

const Person = new Structure({
    firstName: Structure.String.ASCII(3) , // Строка в кодировке ASCII
    lastName: Structure.String.ASCII(4),
    age: Structure.U(7),                  // Unsigned число 7 бит,
    skills: Skills,
    color: Color
});

const bob = Person.create({
    firstName: 'Bob', // Тут придется сконвертировать UTF-16 в ASCII
    lastName: 'King',
    age: 42,
    skills: Skills.create({singing: 100, dancing: 100, fighting: 50}),
    color: Color.create([255, 0, 200])
});

console.log(bob.size); // Количество занимаемых байт конкретной структурой

// "Свойства" структуры реализуются через геттеры/сеттеры.
// Сама структура работает как View над данными в ArrayBuffer.

console.log(bob.buffer);         // ArrayBuffer
console.log(bob.firstName);      // Тут идет обратная конвертация в UTF-16 из ASCII
console.log(bob.skills.singing); // 100

const bobClone = Person.from(bob.buffer.slice(0));
console.log(bobClone.firstName === bob.firstName);
