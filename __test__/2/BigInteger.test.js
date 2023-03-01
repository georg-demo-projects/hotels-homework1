import { BigInteger, ChuncksParser, Chuncks } from '../../src/2';
import { DivideByZeroError } from '../../src/error/DivideByZeroError.js';
import { ParserError } from '../../src/error/ParserError';

describe('BigInteger', () => {

    describe('toString method tests', () => {
        test('positive', () => {
            const nString = '123999999999999999994567';
            const n = BigInteger.create(nString);
            expect(n.toString()).toBe(nString);
        });
        test('negative', () => {
            const nString = '-123999999999999999994567';
            const n = BigInteger.create(nString);
            expect(n.toString()).toBe(nString);
        });
        test('should return the same result for negative zero and positive zero', () => {
            const posZero = BigInteger.create('0');
            const negZero = BigInteger.create('-0');
            expect(posZero.toString()).toBe('0');
            expect(negZero.toString()).toBe('0');
        });
    });
    describe('Leading zeros', () => {
        test('should remove leading zeros from positive', () => {
            const n = BigInteger.create('0000000000000001');
            expect(n.toString()).toBe('1');
        });
        test('should remove leading zeros from negative', () => {
            const n = BigInteger.create('-0000000000000001');
            expect(n.toString()).toBe('-1');
        });
        test('should remove leading zeros from zero', () => {
            const n = BigInteger.create('000000000000000');
            expect(n.toString()).toBe('0');
        });
    });
    describe('changeSign method tests', () => {
        test('should not affect zero', () => {
            const zero = BigInteger.create('0');
            const changedZero = zero.changeSign(-1);
            expect(changedZero.toString()).toBe(zero.toString());
        });
        test('zero cannot be set', () => {
            const n = BigInteger.create('1234567890123456789');
            const changed = n.changeSign(0);
            expect(changed.toString()).toBe(n.toString());
        });
        test('change sign for positive', () => {
            const nStr = '1234567890123456789';
            const n = BigInteger.create(nStr);
            const changed = n.changeSign(-1);
            expect(changed.toString()).toBe('-' + nStr);
        });
        test('change sign for negative', () => {
            const nStr = '1234567890123456789';
            const n = BigInteger.create('-' + nStr);
            const changed = n.changeSign(1);
            expect(changed.toString()).toBe(nStr);
        });
    });
    describe('sum method tests with native BigInt', () => {
        test('sum of two positive', () => {
            const an = 999989874977977749764517n;
            const bn = 9999879716518774976451n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const sum = a.add(b);
            expect((an + bn).toString()).toBe(sum.toString());
        });
        test('sum of two negative', () => {
            const an = -999989874977977749764517n;
            const bn = -9999879716518774976451n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const sum = a.add(b);
            expect((an + bn).toString()).toBe(sum.toString());
        });
        test('sum of positive and negative. positive result', () => {
            const an = 999989874977977749764517n;
            const bn = -9999879716518774976451n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const sum = a.add(b);
            expect((an + bn).toString()).toBe(sum.toString());
        });
        test('sum of positive and negative. negative result', () => {
            const an = -999989874977977749764517n;
            const bn = 9999879716518774976451n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const sum = a.add(b);
            expect((an + bn).toString()).toBe(sum.toString());
        });
        test('bigInteger length increasing', () => {
            const a = BigInteger.create('999999999999999');
            const b = BigInteger.create('1');
            const sum = a.add(b);
            expect(sum.toString()).toBe('1000000000000000');
        });
    });
    describe('diff method tests with native BigInt', () => {
        test('diff of two positive. positive result', () => {
            const an = 999989874977977749764517n;
            const bn = 9999879716518774976451n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const diff = a.sub(b);
            expect((an - bn).toString()).toBe(diff.toString());
        });

        test('diff of two positive. negative result', () => {
            const an = 9999879716518774976451n;
            const bn = 999989874977977749764517n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const diff = a.sub(b);
            expect((an - bn).toString()).toBe(diff.toString());
        });

        test('diff of two negative. positive result', () => {
            const an = -9999879716518774976451n;
            const bn = -999989874977977749764517n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const diff = a.sub(b);
            expect((an - bn).toString()).toBe(diff.toString());
        });

        test('diff of two negative. negative result', () => {
            const an = -999989874977977749764517n;
            const bn = -9999879716518774976451n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const diff = a.sub(b);
            expect((an - bn).toString()).toBe(diff.toString());
        });
    });
    describe('mul method tests', () => {
        test('mul long and short', () => {
            let an = 9999999999999999999999999999999999999999999999999999999999999999999999999999999n;
            let bn = 99n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const mul = a.mul(b);
            expect((an * bn).toString()).toBe(mul.toString());
        });
        test('mul two positive', () => {
            let an = 999999999999999999999999999999999999999999n;
            let bn = 47894891615165156n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const mul = a.mul(b);
            expect((an * bn).toString()).toBe(mul.toString());
        });
        test('mul two negative', () => {
            let an = -999999999999999999999999999999999999999999n;
            let bn = -47894891615165156n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const mul = a.mul(b);
            expect((an * bn).toString()).toBe(mul.toString());
        });
        test('mul positive and negative', () => {
            let an = 999999999999999999999999999999999999999999n;
            let bn = -47894891615165156n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const mul = a.mul(b);
            expect((an * bn).toString()).toBe(mul.toString());
        });
        test('mul negative and positive', () => {
            let an = -999999999999999999999999999999999999999999n;
            let bn = 47894891615165156n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const mul = a.mul(b);
            expect((an * bn).toString()).toBe(mul.toString());
        });
    });
    describe('div method tests', () => {
        test('div long / short', () => {
            let an = 99999999999999999999999999999999435354399999999n;
            let bn = 25n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const div = a.div(b);
            expect((an / bn).toString()).toBe(div.toString());
        });
        test('should return zero, when div smaller by larger', () => {
            const a = BigInteger.create('111111111111111111111111111111');
            const b = BigInteger.create('222222222222222222222222222222');
            const div = a.div(b);
            expect(div.toString()).toBe('0');
        });
        test('div positive / positive', () => {
            let an = 8948862612762652167670564684646867n;
            let bn = 8489899898984656565248949825n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const div = a.div(b);
            expect((an / bn).toString()).toBe(div.toString());
        });
        test('div negative / negative', () => {
            let an = -8948862612762652167670564684646867n;
            let bn = -8489899898984656565248949825n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const div = a.div(b);
            expect((an / bn).toString()).toBe(div.toString());
        });
        test('div positive / negative', () => {
            let an = 8948862612762652167670564684646867n;
            let bn = -8489899898984656565248949825n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const div = a.div(b);
            expect((an / bn).toString()).toBe(div.toString());
        });
        test('div negative / positive', () => {
            let an = -8948862612762652167670564684646867n;
            let bn = 8489899898984656565248949825n;
            const a = BigInteger.create(an.toString());
            const b = BigInteger.create(bn.toString());
            const div = a.div(b);
            expect((an / bn).toString()).toBe(div.toString());
        });
        test("should throw exception when div by zero", () => {
            const num = BigInteger.create('498498298295145439719439719729741');
            const zero = BigInteger.create('0');
            const f = () => num.div(zero);
            expect(f).toThrow(DivideByZeroError);
        });
        test("should return 0 when div zero by big integer", () => {
            const zero = BigInteger.create('0');
            const num = BigInteger.create('498498298295145439719439719729741');
            const div = zero.div(num);
            expect(div.toString()).toBe('0');
        });
        test("should return 1 when div equal numbers", () => {
            const a = BigInteger.create('498498298295145439719439719729741');
            const b = a.clone();
            const div = a.div(b);
            expect(div.toString()).toBe('1');
        });
    });
    describe('immutable tests', () => {
        test('add method', () => {
            const a = BigInteger.create('123123123123123123');
            const b = BigInteger.create('456456456456456456');
            a.add(b);
            expect(a.toString()).toBe('123123123123123123');
            expect(b.toString()).toBe('456456456456456456');
        });
        test('sub method', () => {
            const a = BigInteger.create('123123123123123123');
            const b = BigInteger.create('456456456456456456');
            a.sub(b);
            expect(a.toString()).toBe('123123123123123123');
            expect(b.toString()).toBe('456456456456456456');
        });
        test('mul method', () => {
            const a = BigInteger.create('123123123123123123');
            const b = BigInteger.create('456456456456456456');
            a.mul(b);
            expect(a.toString()).toBe('123123123123123123');
            expect(b.toString()).toBe('456456456456456456');
        });
        test('div method', () => {
            const a = BigInteger.create('123123123123123123');
            const b = BigInteger.create('456456456456456456');
            a.div(b);
            expect(a.toString()).toBe('123123123123123123');
            expect(b.toString()).toBe('456456456456456456');
        });
        test('changeSign method', () => {
            const a = BigInteger.create('123123123123123123');
            const b = a.changeSign(-1);
            expect(a.toString()).toBe('123123123123123123');
        });
    });
    describe('BugIntegerParser tests', () => {
        const baseMaxLen = 7;
        const parser = new ChuncksParser(baseMaxLen);

        test("parse positive number", () => {
            const res = parser.parse("1234567890");
            expect(res.sign).toBe(1);
            expect(res.chuncks.length).toBe(2);
        });
        test("parse negative number", () => {
            const res = parser.parse("-1234567890");
            expect(res.sign).toBe(-1);
            expect(res.chuncks.length).toBe(2);
        });
        test("parse zero number", () => {
            const res = parser.parse("0");
            expect(res.sign).toBe(0);
            expect(res.chuncks.length).toBe(1);
        });
        test("parse negative zero number", () => {
            const res = parser.parse("-0");
            expect(res.sign).toBe(0);
            expect(res.chuncks.length).toBe(1);
        });
        test('parse positive. should remove leading zeros', () => {
            const res = parser.parse('0000000000000001234567890');
            expect(res.sign).toBe(1);
            expect(res.chuncks.length).toBe(2);
        });
        test('parse negative. should remove leading zeros', () => {
            const res = parser.parse('-0000000000000001234567890');
            expect(res.sign).toBe(-1);
            expect(res.chuncks.length).toBe(2);
        });
        test('parse zero. should remove leading zeros', () => {
            const res = parser.parse('0000000000000000');
            expect(res.sign).toBe(0);
            expect(res.chuncks.length).toBe(1);
        });
        test("should throw exception when string is not an integer number", () => {
            const g = () => parser.parse('abc');
            const f = () => parser.parse('49849829829514.5439719439719729741');
            expect(g).toThrow(ParserError);
            expect(f).toThrow(ParserError);
        });
    });
});
