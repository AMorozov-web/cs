const match = (template: string, strArr: string[]): string[] => {
    const SEPARATOR = '.';
    const ANY = '*';
    const ANY_TO_END = '**';

    const matched: string[] = [];

    const templateArr = template.split(SEPARATOR);
    const anyToEndIndex = templateArr.indexOf(ANY_TO_END);

    if (anyToEndIndex > 0 && anyToEndIndex !== templateArr.length - 1) {
        throw new SyntaxError('Invalid template');
    }

    for (const str of strArr) {
        const currStr = str.split(SEPARATOR);

        if (templateArr.length > currStr.length) {
            break;
        }

        if (anyToEndIndex < 0 && templateArr.length !== currStr.length) {
            break;
        }

        for (const [index, item] of currStr.entries()) {
            const templateFragment = templateArr[index];

            if (templateFragment !== item && templateFragment !== ANY) {
                break;
            }

            if (templateFragment === ANY_TO_END && index !== strArr.length - 1) {
                matched.push(str);
                break;
            }

            if (index === strArr.length - 1 && templateFragment === item) {
                matched.push(str);
            }
        }
    }

    return matched;
}


console.log(match('foo.*.bar.**', ['foo', 'foo.bla.bar.baz', 'foo.bag.bar.ban.bla'])); // ['foo.bla.bar.baz', 'foo.bag.bar.ban.bla']
