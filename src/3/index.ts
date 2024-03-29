class FizzBuzz {
  private currentValue: bigint = 1n;
  private delay: number = 10;

  async *[Symbol.asyncIterator]() {
    let lastTime = Date.now();

    while(true) {
      yield this.get();
      this.currentValue++

      const diff = Date.now() - lastTime;

      if (diff > this.delay) {
        await this.wait();
        lastTime = Date.now();
      }
    }

  }

  *[Symbol.iterator]() {
    while(true) {
      yield this.get();
      this.currentValue++
    }
  }

  get iterator() {
    return this[Symbol.iterator]();
  }

  reset(): void {
    this.currentValue = 1n;
  }

  private wait(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.delay) )
  }

  private get(): string | bigint {
    switch(true) {
      case this.isFizz(this.currentValue):
        return 'Fizz';
      case this.isBuzz(this.currentValue):
        return 'Buzz';
      case this.isBuzz(this.currentValue) && this.isFizz(this.currentValue):
        return 'Buzz';
      default:
        return this.currentValue.toString();
    }
  }

  private isFizz(value: bigint): boolean {
    return value % 3n === 0n || value % 5n === 0n;
  }

  private isBuzz(value: bigint): boolean {
    return value % 4n === 0n;
  }
}


const myFizzBazz = new FizzBuzz().iterator;

console.log(myFizzBazz.next()); // 1n
console.log(myFizzBazz.next()); // 2n
console.log(myFizzBazz.next()); // Fizz
console.log(myFizzBazz.next()); // Buzz
console.log(myFizzBazz.next()); // Fizz

(async function get () {
  for await (const value of new FizzBuzz()) {
    console.log(value);
  }
})()
