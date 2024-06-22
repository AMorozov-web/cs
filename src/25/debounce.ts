const debounce = <T extends (...args: any) => any>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout | number;

    return function (this: unknown, ...args: Parameters<T>) {
        return new Promise<T>((resolve, reject) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                try {
                    resolve(func.apply(this, args));
                } catch (e) {
                    reject(e);
                }
            }, wait);
        })

    }
}


function laugh() {
    console.log('Ha-ha!')
}

const debouncedLaugh = debounce(laugh, 300);

debouncedLaugh();
debouncedLaugh();
debouncedLaugh();
debouncedLaugh();
debouncedLaugh(); // Выполнится через 300 мс
