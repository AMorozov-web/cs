class ListNode<T> {
    value: T;
    next: ListNode<T> | null;
    prev: ListNode<T> | null;

    constructor(value: T) {
        this.value = value
        this.next = null;
        this.prev = null;
    }
}

class LinkedList<T> {
    head: ListNode<T> | null;
    tail: ListNode<T> | null;
    length: number;

    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    *[Symbol.iterator]() {
        let cursor = this.head;

        while (cursor) {
            yield cursor.value;
            cursor = cursor.next;
        }
    }

    clear(): void {
        this.head = null;
        this.tail = null;
    }

    push(value: T): number {
        const node = new ListNode<T>(value);

        if (!this.tail) {
            this.setFirstNode(node);
        } else {
            const prev = this.tail;

            prev.next = node;
            node.prev = prev;
            this.tail = node;
        }

        this.length++;

        return this.length;
    }


    unshift(value: T): number {
        const node = new ListNode<T>(value);

        if (!this.head) {
            this.setFirstNode(node);
        } else {
            const next = this.head;

            next.prev = node;
            node.next = next;
            this.head = node;
        }

        this.length++;

        return this.length;
    }

    pop(): T | null {
        if (!this.tail) {
            return null;
        }

        const el = this.tail;

        if (!el.prev) {
            this.clear();
        } else {
            this.tail = el.prev;
            el.prev.next = null;
        }

        this.length--;

        return el.value;
    }

    shift(): T | null {
        if (!this.head) {
            return null;
        }

        const el = this.head;

        if (!el.next) {
            this.clear();
        } else {
            this.head = el.next;
            el.next.prev = null;
        }

        this.length--;

        return el.value;
    }

    insertBefore(value: T, target: ListNode<T>): number {
        if (!this.length) {
            throw new RangeError('List is empty');
        }

        const newNode = new ListNode(value);
        const prev = target.prev;

        if (prev) {
            prev.next = newNode;
        }
        newNode.next = target;
        newNode.prev = prev;
        target.prev = newNode;

        if (this.head === target) {
            this.head = newNode;
        }

        this.length++

        return this.length;
    }

    insertAfter(value: T, target: ListNode<T>): number {
        if (!this.length) {
            throw new RangeError('List is empty');
        }

        const newNode = new ListNode(value);
        const next = target.next;

        if (next) {
            next.prev = newNode;
        }
        newNode.prev = target;
        newNode.next = next;
        target.next = newNode;

        if (this.tail === target) {
            this.tail = newNode;
        }

        this.length++

        return this.length;
    }

    findByValue(value: T): ListNode<T> | null {
        let cursor = this.head;
        let counter = this.length;

        while (counter > 0) {
            if (cursor?.value && cursor.value === value) {
                break;
            } else if (cursor?.next) {
                cursor = cursor.next
                counter--
            } else {
                cursor = null;
            }
        }

        return cursor;
    }

    delete(el: ListNode<T>): boolean {
        if (this.length === 1 && el === this.head) {
            this.head = null;
            this.tail = null;
            this.length = 0;

            return true;
        }

        if (el === this.head) {
            this.shift();

            return true;
        }

        if (el === this.tail) {
            this.pop();

            return true;
        }

        const {prev: prevEl, next: nextEl} = el;

        if (nextEl && prevEl) {
            nextEl.prev = prevEl;
            prevEl.next = nextEl;

            return true;
        }


        return false;
    }

    private setFirstNode(node: ListNode<T>): void {
        this.head = node;
        this.tail = node;
    }
}

const list = new LinkedList();

list.push(1);
list.push(2);

const el1 = list.findByValue(1);
const el2 = list.findByValue(2);

if (el1) {
    list.insertBefore(4, el1);
    list.insertAfter(8, el1);
    list.delete(el1);
}

if (el2) {
    list.insertBefore(5, el2);
    list.insertAfter(10, el2);
    list.delete(el2);
}

for (const el of list) {
    console.log(el); //4, 8, 5, 10
}
