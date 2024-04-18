class Matrix {
    buffer: any

    constructor(array: any, ...dimensions: number[]) {

    }

    set(...dimensions: number[], value: number) {

    }

    get(...dimensions: number[]) {

    }
}




const matrix2n2n2 = new Matrix(Int32Array, 2, 2, 2);

matrix2n2n2.set(0, 0, 0, 1);
matrix2n2n2.set(0, 1, 0, 2);
matrix2n2n2.set(0, 0, 1, 3);
matrix2n2n2.set(0, 1, 1, 4);

matrix2n2n2.set(1, 0, 0, 5);
matrix2n2n2.set(1, 1, 0, 6);
matrix2n2n2.set(1, 0, 1, 7);
matrix2n2n2.set(1, 1, 1, 8);

matrix2n2n2.get(0, 0, 0); // 1
matrix2n2n2.get(0, 1, 0); // 2
matrix2n2n2.get(0, 0, 1); // 3
matrix2n2n2.get(0, 1, 1); // 4

matrix2n2n2.get(1, 0, 0); // 5
matrix2n2n2.get(1, 1, 0); // 6
matrix2n2n2.get(1, 0, 1); // 7
matrix2n2n2.get(1, 1, 1); // 8

console.log(matrix2n2n2.buffer);  // Ссылка на ArrayBuffer
