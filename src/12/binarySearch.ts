const indexOf = <T>(arr: T[], predicate: (value: T) => number): number => {
    let result = -1;

    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        const value = arr[mid];

        const compare = predicate(value);

        if (compare === 0) {
            result = mid;
            right = mid;
        } else if (compare > 0) {
            right = mid;
        } else if (compare < 0) {
            left = mid + 1;
        }
    }

    return result;
}

const lastIndexOf = <T>(arr: T[], predicate: (value: T) => number) => {
    let result = -1;

    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        const value = arr[mid];

        const compare = predicate(value);

        if (compare === 0) {
            result = mid;
            left = mid + 1;
        } else if (compare > 0) {
            right = mid;
        } else if (compare < 0) {
            left = mid + 1;
        }
    }

    return result;
}


// Ожидается, что исходный массив должен быть отсортирован
const arr: {age: number, name: string}[] = [
    {age: 12, name: 'Bob'},
    {age: 42, name: 'Ben'},
    {age: 42, name: 'Jack'},
    {age: 42, name: 'Sam'},
    {age: 56, name: 'Bill'},
];

// Если число положительное, то значит надо идти налево.
// Если число 0, то значит надо запомнить позицию и идти налево.
// Если число отрицательное, то значит идти налево.

console.log(indexOf(arr, ({age}) => age - 42));     // 1
console.log(lastIndexOf(arr, ({age}) => age - 42)); // 3

// Не найдено
console.log(lastIndexOf(arr, ({age}) => age - 82)); // -1
