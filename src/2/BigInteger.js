import { DivideByZeroError } from "../error/DivideByZeroError.js";
import { InvalidArgumentError } from "../error/InvalidArgumentError.js";
import { ChuncksParser } from "./BigIntegerParser.js";

export class BigInteger {
    // Размер мантиссы - 52 бита, 2^52 = 4503599627370496.  16 цифр
    // Т.е. это гарантирует представление 15 десятичных цифр
    static _POWER = 7; // чтобы при перемножении не выйти за пределы
    static _BASE = 10 ** BigInteger._POWER;

    constructor(sign, chuncks) {
        this._sign = sign;
        this._chuncks = chuncks;
    }

    static create(s = '', parser = new ChuncksParser(BigInteger._POWER)) {
        try {
            const { sign, chuncks } = parser.parse(s);
            return new BigInteger(sign, chuncks);
        }
        catch (error) {
            throw new InvalidArgumentError(`Bad string: "${s}"`);
        }
    }

    clone() {
        return new BigInteger(this._sign, [...this._chuncks]);
    }

    get sign() {
        return this._sign;
    }

    changeSign(value) {
        const res = this.clone();
        if (value !== 0 && res._sign !== 0) { // для нуля не изменяем знак, и нулевой знак можно задать только для нуля
            res._sign = Math.sign(value);
        }
        return res;
    }

    toString() {
        let result = this._sign === -1 ? '-' : '';
        const ch = this._chuncks;
        // последний элемент становится первым, оставляем его, как есть
        result += ch.length ? ch[ch.length - 1] : 0;
        // остальные элементы добиваем нулями до длины base
        for (let i = ch.length - 2; i >= 0; --i) {
            result += ch[i].toString().padStart(BigInteger._POWER, '0');
        }
        return result;
    }

    compare(other) {
        return this.sign !== other.sign
            ? this.sign || -other.sign
            : this.sign * this.compareABS(other);
    }

    compareABS(other) {
        const a = this._chuncks;
        const b = other._chuncks;
        if (a.length !== b.length) {
            return Math.sign(a.length - b.length);
        }
        for (let i = a.length - 1; i >= 0; --i) {
            if (a[i] !== b[i]) {
                return Math.sign(a[i] - b[i]);
            }
        }
        return 0;
    }

    add(b) {
        if (this.sign === 0 || b.sign === 0) {
            return this.sign === 0 ? b.clone() : this.clone();
        }
        let a = this;
        if (a.sign !== b.sign && a.compareABS(b) < 0) {
            [a, b] = [b, a];
        }
        return a.sign !== b.sign
            ? a.clone().subABS(b)
            : a.clone().addABS(b);
    }

    // сложить по ABS
    addABS(other) {
        const a = this._chuncks;
        const b = other._chuncks;
        const maxLength = Math.max(a.length, b.length);
        const base = BigInteger._BASE;
        let carry = 0;
        for (let i = 0; i < maxLength || carry; ++i) {
            if (i === a.length) {
                this._chuncks.push(0);
            }
            a[i] += carry + (i < b.length ? b[i] : 0);
            carry = a[i] >= base ? 1 : 0;
            if (carry) {
                a[i] -= base;
            };
        }
        return this;
    }

    sub(b) {
        return this.add(b.changeSign(-b.sign));
    }

    subABS(other) {
        const base = BigInteger._BASE;
        let carry = 0;
        const a = this._chuncks;
        const b = other._chuncks;

        for (let i = 0; i < b.length || carry; ++i) {
            a[i] -= carry + (i < b.length ? b[i] : 0);
            carry = a[i] < 0 ? 1 : 0;
            if (carry) {
                a[i] += base
            };
        }
        return this.removeLeadingZeros();
    }

    mulShort(short) {
        const base = BigInteger._BASE;
        const res = this.changeSign(this.sign * Math.sign(short));
        const a = res._chuncks;
        const b = Math.abs(short);
        let carry = 0;
        for (let i = 0; i < a.length || carry; ++i) {
            if (i === a.length) {
                a.push(0);
            }
            let cur = carry + a[i] * b;
            a[i] = cur % base;
            carry = Math.trunc(cur / base);
        }
        return res.removeLeadingZeros();
    }

    mul(other) {

        // p = base
        // number = number[0] * p^0 + number[1] * p^1 * ...
        // a * b
        // (a[0] * p^0) * (b[0] * p^0) + (a[0] * p^0) * (b[1] * p^1) + ...
        // => ab[i + j] += a[i] * b[j]

        // a[i] * p^i * b[j] * p^j = ad[i + j] * p^(i + j)

        // если base = 10
        // 154 = 4 * 10^0  +  5 * 10^1  +  1 * 10^2

        const base = BigInteger._BASE;
        const a = this._chuncks;
        const b = other._chuncks;
        if (b.length === 1 && b[0] < base) {
            return this.mulShort(b[0]);
        }
        const resChuncks = new Array(a.length + b.length).fill(0);
        const res = new BigInteger(this._sign * other._sign, resChuncks);
        for (let i = 0; i < a.length; ++i) {
            let carry = 0;
            for (let j = 0; j < b.length || carry; ++j) {
                let cur = resChuncks[i + j] + a[i] * (j < b.length ? b[j] : 0) + carry; // (j < b.length ? b[j] : 0) если типа 99 + 1, то надо все занулить?
                resChuncks[i + j] = cur % base;
                carry = Math.trunc(cur / base);
            }
        }
        return res.removeLeadingZeros();
    }

    divShort(short) {
        const base = BigInteger._BASE;
        const res = this.changeSign(this.sign * Math.sign(short));
        let carry = 0;
        const a = res._chuncks;
        const b = Math.abs(short);

        for (let i = a.length - 1; i >= 0; --i) {
            let cur = a[i] + carry * base;
            a[i] = Math.trunc(cur / b);
            carry = cur % b;
        }
        return res.removeLeadingZeros();
    }

    div(other) {
        if (other._sign === 0) {
            throw new DivideByZeroError();
        }
        if (this._sign === 0) {
            return new BigInteger(0, [0]);
        }
        const absCompare = this.compareABS(other);
        if (absCompare === 0) {
            return new BigInteger(this.sign * other.sign, [1]);
        }
        if (absCompare < 0) {
            return new BigInteger(0, [0]);
        }
        if (other._chuncks.length === 1) {
            return this.divShort(other._chuncks[0]);
        }
        const one = BigInteger.create('1');
        let L = one.clone();
        let R = this.changeSign(1);
        while (L.compare(R.sub(one)) < 0) {
            const middle = L.add(R).divShort(2);
            const compare = other.mul(middle).compareABS(this);
            if (compare > 0) {
                R = middle;
            }
            else {
                L = middle;
                if (compare === 0) { break; }
            }
        }
        return L.removeLeadingZeros().changeSign(this.sign * other.sign);
    }

    // удалить ведущие нули
    removeLeadingZeros() {
        const chuncks = this._chuncks;
        while (chuncks.length > 1 && chuncks[chuncks.length - 1] === 0) {
            chuncks.pop();
        }
        return this;
    }
}
