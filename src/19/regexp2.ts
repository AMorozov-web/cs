const zipStr = (str: string): string => {
    const regexp = /(.+)\1+/;

    let result: string = str;

    while (true) {
        const newStr = result.replace(regexp, '$1');

        if (newStr === result) {
            break;
        }

        result = newStr;
    }

    return result;
}

console.log(zipStr('abbaabbafffbezza')); // abafbeza

////////////////////////

const unique = (str: string): string => {
    const regexp = /(.)(?:.*)(\1)/g;

    return str.replace(regexp, (subStr, value) => subStr.replaceAll(value, ''));
}

console.log(unique('abaceffgw')); // bcegw

///////////////////////

const findMoney = (str: string): string[] => {
    const regexp = /((\d+)( \d+?)?(\,\d+)?(\$|₽))/g;

    return [...str.matchAll(regexp)].map(([subStr]) => subStr);
}

// ['100 00,53$', '500₽']
console.log(findMoney(`20.10.2020 Федор взял у меня 100 00,53$ и обещался вернуть не поздее 25 числа, но уже через 2 дня, он занял еще 500₽`));
