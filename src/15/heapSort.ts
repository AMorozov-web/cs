const heapSort = <T>(arr: T[], comparator: (left: T, right: T) => number): void => {
    const swap = (left: number, right: number): void => {
        const buffer = arr[left];
        arr[left] = arr[right];
        arr[right] = buffer;
    }

    const calcLeftChildIndex = (index: number) => index * 2 + 1;
    const calcRightChildIndex = (index: number) => index * 2 + 2;
    const calcParentIndex = (index: number) => Math.floor((index - 1) / 2);

    let lastIndex = arr.length - 1;
    let lastParentIndex = calcParentIndex(lastIndex);

    while (lastParentIndex >= 0 && lastParentIndex < lastIndex) {
        let cursor = lastParentIndex;

        while (cursor >= 0) {
            const leftIndex = calcLeftChildIndex(cursor);
            const rightIndex = calcRightChildIndex(cursor);

            //Проверяем по очереди правый, затем левый элемент
            //Правый индекс может уйти за длину массива, поэтому проверяем его дополнительно
            if (rightIndex <= lastIndex && comparator(arr[rightIndex], arr[cursor]) > 0) {
                swap(cursor, rightIndex);
            }

            if (comparator(arr[leftIndex], arr[cursor]) > 0) {
                swap(cursor, leftIndex);
            }

            cursor--;
        }

        swap(0, lastIndex);
        lastIndex--;
        lastParentIndex = calcParentIndex(lastIndex);
    }
}

const array = [1, 11, 10, 4, 7, 1, 8, 9, 3, 6, 5, 8, 9, 15];

heapSort(array, (a, b) => b - a);

