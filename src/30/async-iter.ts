const on = <T extends HTMLElement, E extends keyof HTMLElementEventMap>(element: T, event: E) => {
    const promises = [];

    return {
        [Symbol.asyncIterator]() {
            return this;
        },

        next() {
            const {promise} = Promise.withResolvers();
            promises.push(promise);

            return promise;
        },

        return() {

        }
    }
}

//Необходимо написать функции on/once, которая бы принимала любой источник событий и событие и возвращала асинхронный итератор

(async () =>  {
    for await (const e of on(document.body, 'click')) {
        console.log(e);
    }
})()
