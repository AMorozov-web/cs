interface InnerStorage {
    get(key: string): number
    set(key: string, value: number): boolean
}

abstract class SyncKVStorage {
    abstract storage: InnerStorage;

    get(key: string) {
        return this.storage.get(key);
    }

    set(key: string, value: number): boolean {
        return this.storage.set(key, value);
    }
}

// @ts-ignore
class LocalStorage extends SyncKVStorage {
}

// @ts-ignore
class CookieStorage extends SyncKVStorage {
}

const ls = new LocalStorage();

ls.set('a', 42);
console.log(ls.get('a')) // 42;

const cookie = new CookieStorage();

cookie.set('a', 42);
console.log(cookie.get('a')) // 42;
