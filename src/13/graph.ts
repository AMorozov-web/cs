import {Matrix} from '../8/matrix';

class Graph {
    private readonly matrix: Matrix<Uint8Array>;
    private readonly matrixX: number;
    private readonly matrixY: number;
    private readonly transitiveClosures = new Set<[number, number]>();

    static TRAVERSE_TYPE = {
        BFS: 'bfs',
        DFS: 'dfs',
    } as const;

    static LINE_TYPE = {
        EDGE: 'edge',
        ARC: 'arc',
    } as const;

    constructor(matrix: Matrix<Uint8Array>) {
        if (matrix.dimensions.length > 2) {
            throw new TypeError('Matrix dimensions length must be lower or equal than 2');
        }

        const [x, y] = matrix.dimensions;

        if (x !== y) {
            throw new TypeError('Matrix dimensions must be equal');
        }

        this.matrixX = x;
        this.matrixY = y;
        this.matrix = matrix;

    }

    checkAdjacency(ver0: number, ver1: number): number {
        return this.matrix.get(ver0, ver1);
    }

    createEdge(ver0: number, ver1: number, weight: number): boolean {
        if (weight <= 0) {
            throw new RangeError('Weight must be greater than 0');
        }

        this.matrix.set(ver0, ver1, weight);
        this.matrix.set(ver1, ver0, weight);

        return true;
    }

    removeEdge(ver0: number, ver1: number): boolean {
        this.matrix.set(ver0, ver1, 0);
        this.matrix.set(ver1, ver0, 0);

        return true;
    }

    createArc(ver0: number, ver1: number, weight: number): boolean {
        if (weight <= 0) {
            throw new RangeError('Weight must be greater than 0');
        }

        this.matrix.set(ver0, ver1, weight);

        return true;
    }

    removeArc(ver0: number, ver1: number): boolean {
        this.matrix.set(ver0, ver1, 0);

        return true;
    }

    traverse(start: number, type: Graph.TraverseType): IterableIterator<[number, number, number]> {
        switch (type) {
            case Graph.TRAVERSE_TYPE.DFS:
                return this.dfs(start);
            case Graph.TRAVERSE_TYPE.BFS:
            default:
                return this.bfs(start);
        }
    }

    applyTransitiveClosures(): void {
        for (let x = 0; x < this.matrixX; x++) {
            for (let y = 0; y < this.matrixY; y++) {
                const weight = this.checkAdjacency(x, y);
                // Идем по матрице, проверяем есть ли связи узлов
                if (weight) {
                    //Если связь есть - идем по столбцу и проверяем наличие связи для других узлов
                    for (let col = 0; col < this.matrixY; col++) {
                        if (col === y) {
                            continue;
                        }
                        const weight2 = this.checkAdjacency(y, col);
                        //Если связь нашлась, сохраняем транзитивное замыкание, если его до этого не было
                        const existingWeight = this.checkAdjacency(x, col);

                        if (weight2 && !existingWeight) {
                            this.matrix.set(x, col, 1);
                            this.transitiveClosures.add([x, col]);
                        }
                    }
                }
            }
        }
    }

    removeTransitiveClosures(): void {
        for (const [v1, v2] of this.transitiveClosures.values()) {
            this.matrix.set(v1, v2, 0);
        }
        this.transitiveClosures.clear();
    }
    //Выводит в консоль последовательность связей в dot
    toDot(): void {
        const lines = new Map<string, Graph.LogLine>();

        for (const [from, to, weight] of this.traverse(0, Graph.TRAVERSE_TYPE.BFS)) {
            const key = `${from}-${to}`;
            const line: Graph.LogLine = {
                from,
                to,
                type: Graph.LINE_TYPE.ARC,
                weight,
            };

            const checkAdjacency = this.checkAdjacency(to, from);
            const checkKey = `${to}-${from}`;

            if (checkAdjacency) {
                line.type = Graph.LINE_TYPE.EDGE;
            }

            if (!lines.has(checkKey)) {
                lines.set(key, line);
            }
        }

        for (const {from, to, type, weight} of lines.values()) {
            const noDir = type === Graph.LINE_TYPE.EDGE ? '[dir=none]' : '';

            const str = `${from} -> ${to} [label=\"${weight}\"] ${noDir}`;

            console.log(str);
        }
    }

    private *bfs(start: number): IterableIterator<[number, number, number]> {
        const queue: number[] = [start];
        const visited = new Set<number>();

        while (queue.length) {
            const current = queue.shift()!;

            for (let i = 0; i < this.matrixY; i++) {
                const weight = this.checkAdjacency(current, i);

                if (!weight || visited.has(current)) {
                    continue;
                }
                queue.push(i);
                yield [current, i, weight];
            }

            visited.add(current);
        }

    }

    private *dfs(start: number): IterableIterator<[number, number, number]> {
        const that = this;
        const visited = new Set<number>();

        function* innerDfs(value: number): IterableIterator<[number, number, number]> {
            for (let i = 0; i < that.matrixY; i++) {
                const weight = that.checkAdjacency(value, i);

                if (!weight || visited.has(value)) {
                    continue;
                }

                yield [value, i, weight];
                yield* innerDfs(i);
            }
        }

        yield* innerDfs(start);
    }
}

namespace Graph {
    export type TraverseType = 'bfs' | 'dfs';
    export type LogLineType = 'edge' | 'arc';
    export type LogLine = {
        from: number;
        to: number;
        type: Graph.LogLineType;
        weight: number;
    }
}


const adjacencyMatrix = new Matrix(Uint8Array, 10, 10);

// Заполняем матрицу смежности
adjacencyMatrix.set(0, 1, 1);
adjacencyMatrix.set(1, 6, 4);
adjacencyMatrix.set(2, 3, 6);
adjacencyMatrix.set(0, 8, 7);
adjacencyMatrix.set(1, 2, 8);

const graph = new Graph(adjacencyMatrix);

// Проверяем смежность двух узлов графа (с учетом направленности)
graph.checkAdjacency(1, 2);

// Добавляет ребро между двумя узлами и, опционально, вес.
// Если дуга уже есть, то просто меняется вес (если она задан).
graph.createEdge(7, 2, 1);

// graph.removeEdge(7, 2);

// Добавляет дугу между двумя узлами и, опционально, вес
graph.createArc(7, 2, 1);

// graph.removeArc(7, 2);

graph.toDot();


