interface String {
    capitalize(): string;
}

String.prototype.capitalize = function () {
    const segmented = new Intl.Segmenter('en', {granularity: 'word'}).segment(this.toString())

    let result: string = '';

    for (const {segment, isWordLike} of segmented) {
        result += isWordLike ? segment.replace(/^\w/, (value) => value.toUpperCase()) : segment;
    }

    return result;
}


console.log("foo bar baz. boom!".capitalize()); // Foo
