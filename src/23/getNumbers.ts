// Необходимо КА, который считывает дробные числа из потока входных данных
// Если поток данных иссяк, то КА должен выбрасывать исключение и переходить в состояние ожидания новых данных.

// @ts-ignore
const numbers = getNumbers(someString);

try {
  console.log(...numbers);

} catch (e) {
  // Expect new input
  console.log(e);

  // @ts-ignore
  numbers.next(newString);
}
