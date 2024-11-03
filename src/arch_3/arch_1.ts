class Fetch {
    static state = {
        query: {}
    };

    static method(method: string) {
        const nexState = {...this.state, method}

        return class extends this {
            static state = nexState;
        }
    }

    static get() {
        const nexState = {...this.state, method: 'GET'}

        return class extends this {
            static state = nexState;
        }
    }

    static url(url: string) {
        const nexState = {...this.state, url}

        return class extends this {
            static state = nexState;
        }
    }

    static query(key: string, value: number) {
        const nexState = {
            ...this.state,
            query: {
                ...this.state.query,
                [key]: value
            }
        }

        return class extends this {
            static state = nexState;
        }
    }

    static body(type: string, data: unknown) {
        const nexState = {...this.state, type, data}

        return class extends this {
            static state = nexState;
        }
    }

    static send() {
        // @ts-ignore
        const {url, ...rest} = this.state

         // @ts-ignore
        return fetch(url, rest)
    }
}


const myUrlReq = Fetch
    .method('POST')
    .url('//my-url');

myUrlReq.query('a', 1)
    .query('b', 2)
    .body('application/json', {myData: 42})
    .send()
    .then(console.log);
