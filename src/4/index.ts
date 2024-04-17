const binary = (num: number): string => {
    const str = new Uint32Array([num])[0].toString(2);
    return '0b' + str.padStart(32, '0').replace(/(.{4})(?!$)/g, '$1_');
}

class BCD {
    static BITS_PER_DIGIT = 4;
    static MAX_CONTAINER_BITS = 31;
    static MAX_DIGITS_SLOTS = Math.floor(this.MAX_CONTAINER_BITS / this.BITS_PER_DIGIT);
    static SIGN_SLOT = this.MAX_DIGITS_SLOTS - 1;
    static SIZE_SLOT = this.MAX_DIGITS_SLOTS;

    static MASK = 0b1111;

    static PLUS = 0b1100;
    static MINUS = 0b1101;

    static VALID_BCD = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    static TO_NINE = this.VALID_BCD.toReversed();
    static NORMALIZE = 0b0110;

    private numbers: number[] = [0];

    // Во избежание переполнение Double чисел на вход используем BigInt
    constructor(num: bigint) {
        const isNegative = num < 0n;
        let value = num;

        if (isNegative) {
            value *= -1n;
        }

        let currentIndex = 0;

        while (value > 0) {
            let currentDigit = value % 10n;

            const [digit] = this.getDigit(Number(currentDigit), isNegative);

            this.numbers[this.numbers.length - 1] |= digit << this.getShift(currentIndex);
            currentIndex++;

            if (currentIndex >= BCD.MAX_DIGITS_SLOTS) {
                currentIndex = 0;
                this.numbers.push(0);
            }

            value /= 10n;
        }

        //Знак
        this.numbers[this.numbers.length - 1] |= (isNegative && BCD.MINUS || BCD.PLUS) << this.getShift(BCD.SIGN_SLOT);
        //Оставшиеся слоты в последнем контейнере, -1 с учетом обязательности знака
        this.numbers[this.numbers.length - 1] |= (BCD.MAX_DIGITS_SLOTS - currentIndex - 1) << this.getShift(BCD.SIZE_SLOT);
    }

    get length(): number {
        //-1 с учетом знака
        return this.numbers.length * BCD.MAX_DIGITS_SLOTS - this.getUnusedSlots() - 1;
    }

    // Во избежание переполнение Double чисел на выход используем BigInt
    valueOf(): bigint {
        let result = 0n;
        let currentIndex = 0;

        this.numbers.forEach((container, index) => {
            const freeSlotsMask = this.getMask(this.getShift(BCD.SIZE_SLOT));
            const freeSlots = (container & freeSlotsMask) >>> this.getShift(BCD.MAX_DIGITS_SLOTS);
            //Извлекаем только числа, размер и знак не трогаем, поэтому -2
            const border = index === this.numbers.length - 1 ? BCD.MAX_DIGITS_SLOTS - freeSlots - 2 : BCD.MAX_DIGITS_SLOTS;
            let cursor = 0;

            while (cursor <= border) {
                const mask = BCD.MASK << this.getShift(cursor)
                const digit = (container & mask) >>> this.getShift(cursor);

                result |= BigInt(digit) << BigInt(this.getShift(currentIndex));

                cursor++;
                currentIndex++;
            }
        })


        return result;
    }

    // Возвращает разряд BCD числа по заданной позиции.
    // Отрицательная позиция означает разряд "с конца".
    get(index: number): number {
        const length = this.length;

        if (index < 0) {
            index += length;
        }

        if (index < 0 || index > length - 1) {
            throw new RangeError('Invalid index value');
        }

        const containerIndex = Math.floor(index / BCD.MAX_DIGITS_SLOTS);
        const digitIndex =  index % BCD.MAX_DIGITS_SLOTS;
        // Сдвигаем вправо до нужного числа на нулевой позиции и обнуляем остальное маской
        return this.numbers[containerIndex] >>> this.getShift(digitIndex) & BCD.MASK;
    }

    private getDigit(value: number, isNegative: boolean): [number, boolean] {
        let hasOverflow = false;
        let digit = value;

        if (isNegative) {
            digit = BCD.TO_NINE[value];
        }

        if (!this.isValidBCD(digit)) {
            const normalized = this.binaryAdd(digit, BCD.NORMALIZE);
            digit = normalized & BCD.MASK;
            // Если после применения инвертированной маски что-то осталось, ставим true
            hasOverflow = (normalized & ~BCD.MASK) > 0;
        }

        return [digit, hasOverflow];
    }

    private isValidBCD(value: number): boolean {
        return typeof BCD.VALID_BCD[value] === 'number';
    }

    private getShift(index: number): number {
        return index * BCD.BITS_PER_DIGIT;
    }

    private getMask(shift: number): number {
        return BCD.MASK << shift;
    }

    private getUnusedSlots(): number {
        const sizeMask = this.getMask(this.getShift(BCD.SIZE_SLOT));
        return (this.numbers.at(-1)! & sizeMask) >>> this.getShift(BCD.MAX_DIGITS_SLOTS);
    }

    private binaryAdd(x: number, y: number): number {
        while (y) {
            // Достаем переполнения
            const overflows = x & y;
            // Складываем без учета переполнений
            x = x ^ y;
            // Переносим переполнения во второй аргумент, сдвигая на разряд влево
            y = overflows << 1;
        }

        return x;
    }
}

const n = new BCD(65536n);

console.log(n.valueOf()); // 0b01100101010100110110 или 415030n

console.log(n.get(0)); // 6
console.log(n.get(1)); // 3

console.log(n.get(-1)); // 6
console.log(n.get(-2)); // 5
