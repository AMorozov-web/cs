class Trie {
    private readonly buffer: Trie.Char[];

    constructor() {
        this.buffer = [{char: '', isWord: false, children: new Map()}];
    }

    addWord(word: string): void {
        let cursor = this.buffer[0];
        const strArr = [...word];

        for (const [index, char] of strArr.entries()) {
            if (cursor.children.has(char)) {
                const nextIndex = cursor.children.get(char)!;

                cursor = this.buffer[nextIndex];
            } else {
                const newChar: Trie.Char = {
                    char,
                    isWord: index === strArr.length - 1,
                    children: new Map(),
                };

                const newCharIndex = this.buffer.push(newChar) - 1;
                cursor.children.set(char, newCharIndex);

                cursor = newChar;
            }
        }
    }

    go(char: string): Trie.CharsSequence {
        return new Trie.CharsSequence(this.buffer).go(char);
    }
}

namespace Trie {
    export class CharsSequence {
        private readonly buffer: Trie.Char[];
        private cursor: Trie.Char | null;

        constructor(buffer: Trie.Char[]) {
            this.buffer = buffer;
            this.cursor = this.buffer[0];
        }


        go(char: string): CharsSequence {
            if (this.cursor?.children.has(char)) {
                const nextIndex = this.cursor!.children.get(char)!;
                this.cursor = this.buffer[nextIndex];
            } else {
                this.cursor = null;
            }

            return this;
        }

        isWord(): boolean {
            return this.cursor?.isWord ?? false;
        }
    }

    export type Char = {
        char: string;
        isWord: boolean;
        children: Map<string, number>;
    }
}

const trie = new Trie();

trie.addWord('мясо');
trie.addWord('мясорубка');
trie.addWord('мир');

console.log(trie.go('м').go('я').go('с').go('о').isWord()); // true
console.log(trie.go('м').go('а').go('с').go('о').isWord()); // false
