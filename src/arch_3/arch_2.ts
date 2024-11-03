class MyEvent<T> {
    stopPropagated = false;
    data: T;
    target: EventEmitter;

    constructor(target: EventEmitter, payload: T) {
        this.data = payload;
        this.target = target;
    }

    stopPropagation() {
        this.stopPropagated = true;
    }
}

class EventEmitter {
    #buffer = new Map<string, any[]>();
    #parent: EventEmitter | null = null;

    constructor(parent?: EventEmitter) {
        if (parent) {
            this.#parent = parent;
        }
    }

    on(e: string, cb: (e: any) => void) {
        if (this.#buffer.has(e)) {
            this.#buffer.get(e)?.push(cb);
            return;
        }
        this.#buffer.set(e, [cb]);
    }

    off(e: string) {
        if (this.#buffer.has(e)) {
            this.#buffer.delete(e);
        }
    }

    emit(e: string, evt: MyEvent<any>): void
    emit(e: string, ...args: any[]): void
    emit(e: string, ...args: any[] | [MyEvent<any>]) {
        let evt: MyEvent<any>;

        if (args[0] instanceof MyEvent) {
            evt = args[0];
        } else {
            evt = new MyEvent(this, args);
        }


        if (this.#buffer.has(e)) {
            this.#buffer.get(e)?.forEach(cb => cb(evt));
        }

        if (this.#parent && !evt.stopPropagated) {
            this.#parent.emit(e, evt);
        }
    }
}



const parentEE = new EventEmitter();
const ee = new EventEmitter(parentEE);

parentEE.on('someEvent', (e) => {
    console.log(e.data);
});

ee.on('someEvent', (e) => {
    e.stopPropagation();
    console.log(e.data);
});

ee.emit('someEvent', 42);
