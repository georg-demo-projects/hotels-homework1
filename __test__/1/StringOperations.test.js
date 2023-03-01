import { StringOperations } from '../../src/1';

describe('StringOperations', () => {

    const stringOperations = new StringOperations();

    describe('toUpperFirstOnly method tests', () => {
        test('String with lowercase and uppercase letters', () => {
            const result = stringOperations.toUpperFirstOnly('aBCd');
            expect(result).toBe('Abcd');
        });
        test('Empty string', () => {
            const result = stringOperations.toUpperFirstOnly('');
            expect(result).toBe('');
        });
        test('String without letters', () => {
            const result = stringOperations.toUpperFirstOnly('75165468');
            expect(result).toBe('75165468');
        });
        test('Uppercase string', () => {
            const result = stringOperations.toUpperFirstOnly('ABCD');
            expect(result).toBe('Abcd');
        });
        test('Lowercase string', () => {
            const result = stringOperations.toUpperFirstOnly('abcd');
            expect(result).toBe('Abcd');
        });
        test('Single letter string', () => {
            const result = stringOperations.toUpperFirstOnly('a');
            expect(result).toBe('A');
        });
    });

    describe('fixSpaces method tests', () => {
        test('fixSpaces test 1', () => {
            const result = stringOperations.fixSpaces('a:b:c,d.e!f?p');
            expect(result).toBe('a: b: c, d. e! f? p');
        });
        test('fixSpaces test 2', () => {
            const result = stringOperations.fixSpaces('a:b:c,d.e!f?p.');
            expect(result).toBe('a: b: c, d. e! f? p.');
        });
        test('fixSpaces test 3', () => {
            const result = stringOperations.fixSpaces('a:b:c,    d.e!   f?p.   ');
            expect(result).toBe('a: b: c, d. e! f? p.');
        });
        test('fixSpaces test 4', () => {
            const result = stringOperations.fixSpaces('ab cd ef ');
            expect(result).toBe('ab cd ef');
        });
        test('fixSpaces test 5', () => {
            const result = stringOperations.fixSpaces('a,   a');
            expect(result).toBe('a, a');
        });
        test('fixSpaces test 6', () => {
            const result = stringOperations.fixSpaces('Hello,World!!!!!');
            expect(result).toBe('Hello, World! ! ! ! !');
        });
    });

    describe('wordCount method tests', () => {
        test('wordCount test 1', () => {
            const result = stringOperations.wordCount('abcd - efgh');
            expect(result).toBe(2);
        });
        test('wordCount test 2', () => {
            const result = stringOperations.wordCount('abcd');
            expect(result).toBe(1);
        });
        test('wordCount test 3', () => {
            const result = stringOperations.wordCount('  abcd  ');
            expect(result).toBe(1);
        });
        test('wordCount test 4', () => {
            const result = stringOperations.wordCount('abcd,, qwert');
            expect(result).toBe(2);
        });
        test('wordCount test 5', () => {
            const result = stringOperations.wordCount(',,,,,,');
            expect(result).toBe(0);
        });
        test('wordCount test 6', () => {
            const result = stringOperations.wordCount('Hello,World!!!!!');
            expect(result).toBe(2);
        });
    });

    describe('eachWordCount method tests', () => {
        test('eachWordCount test 1', () => {
            const result = stringOperations.eachWordCount('aaa bbb ccc ddd');
            expect(result.size).toBe(4);
            expect([...result.values()].every(count => count === 1)).toBe(true);
        });
        test('eachWordCount test 2', () => {
            const result = stringOperations.eachWordCount('abc&#d bbb ccc abc&#d');
            expect(result.size).toBe(3);
            expect(result.get('abc&#d')).toBe(2);
            expect(result.get('bbb')).toBe(1);
            expect(result.get('ccc')).toBe(1);
        });
        test('eachWordCount test 3', () => {
            const result = stringOperations.eachWordCount('aaa aaa aaa aaa');
            expect(result.size).toBe(1);
            expect(result.get('aaa')).toBe(4);
        });
        test('eachWordCount empty string test', () => {
            const result = stringOperations.eachWordCount('');
            expect(result.size).toBe(0);
        });
    });

    // describe('groupWordsByCount method tests', () => {
    //     test('groupWordsByCount test 1', () => {
    //         const result = stringOperations.groupWordsByCount('aaa bbb ccc ddd');
    //         expect(result.get(1).length).toBe(4);
    //     });
    //     test('groupWordsByCount test 2', () => {
    //         const result = stringOperations.groupWordsByCount('abc&#d bbb ccc abc&#d');
    //         expect(result.get(1).length).toBe(2);
    //         expect(result.get(2).length).toBe(1);
    //     });
    //     test('groupWordsByCount test 3', () => {
    //         const result = stringOperations.groupWordsByCount('aaa aaa aaa aaa');
    //         expect(result.get(1)).toBe(undefined);
    //         expect(result.get(2)).toBe(undefined);
    //         expect(result.get(3)).toBe(undefined);
    //         expect(result.get(4).length).toBe(1);
    //         expect(result.get(5)).toBe(undefined);
    //     });
    // });

    // describe('getUniqueWords method tests', () => {
    //     test('getUniqueWords test 1', () => {
    //         const result = stringOperations.getUniqueWords('aaa bbb ccc ddd');
    //         expect(result.length).toBe(4);
    //     });
    //     test('getUniqueWords test 2', () => {
    //         const result = stringOperations.getUniqueWords('abc&#d bbb ccc abc&#d');
    //         expect(result.length).toBe(2);
    //     });
    //     test('getUniqueWords test 3', () => {
    //         const result = stringOperations.getUniqueWords('aaa aaa aaa aaa');
    //         expect(result.length).toBe(0);
    //     });
    //     test('getUniqueWords test 4', () => {
    //         const result = stringOperations.getUniqueWords('Hello,World!!!!!');
    //         expect(result.length).toBe(2);
    //     });
    //     test('getUniqueWords test 5', () => {
    //         const result = stringOperations.getUniqueWords('aa,bbb,aaa,ttt!!!ppp-ppp    aa');
    //         expect(result.length).toBe(3);
    //     });
    //     test('getUniqueWords test 6', () => {
    //         const result = stringOperations.getUniqueWords('');
    //         expect(result.length).toBe(0);
    //     });
    //     test('getUniqueWords test 7', () => {
    //         const result = stringOperations.getUniqueWords('aaaa');
    //         expect(result.length).toBe(1);
    //     });
    // });
});
