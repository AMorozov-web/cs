const myRegExp1 = /^[\w$]+$/i;

const result1 = myRegExp1.test('привет'); // false
console.log({result1});

////////////////////

const myRegExp2 = /\,0\,\d{2};/g;

const result2 = '762120,0,22;763827,0,50;750842,0,36;749909,0,95;755884,0,41;'.split(myRegExp2); // ['762120', '763827', '750842', '749909', '755884']
//FIXME убрать пустую строку в конце
console.log({result2});

/////////////////////

const myRegExp3 = /([a-z"]+)\:\s([\d"]+)/g;
// [['"a": 1', 'a', '1'], ['"b": "2"', 'b', '"2"']]
console.log({result3: [...'{"a": 1, "b": "2"}'.matchAll(myRegExp3)]});

////////////////////

const myRegExp4 = /\$\{([\w]+?)\}/g;

const format = <T extends Record<string, unknown>>(str: string, params: T): string => {
    return str.replace(myRegExp4, (_, key) => {
        return String(params?.[key] ?? '');
    });
}
// Hello, Bob! Your age is 10.
const result4 = format('Hello, ${user}! Your age is ${age}.', {user: 'Bob', age: 10});
console.log({result4})

////////////////////

const myRegExp5 = /(\s)([\(\)\s+\-\d\*]+)(\s)/gm;

const calc = (str: string): string => {
    return str.replace(myRegExp5, (_, prev, expr, next) => {
        try {
            return `${prev}${new Function(`return ${expr}`)()}${next}`;
        } catch (e) {
            return 'Wrong expression';
        }
    });
};

const result5 = calc(`
Какой-то текст (10 + 15 - 24) ** 2
Еще какой-то текст 2 * 10
`) == `
Какой-то текст 1
Еще какой-то текст 20
`

console.log({result5});
