import { ParserError } from "../error/ParserError";

export class Chuncks {
    constructor(baseLen, chuncks, sign) {
        this.baseLen = baseLen;
        this.chuncks = chuncks;
        this.sign = sign;
    }
}

export class ChuncksParser {
    constructor(baseLen) {
        this._baseLen = baseLen;
    }

    parse(s) {
        let sign = this._parseSign(s);
        if (sign === 0) {
            return new Chuncks(this._baseLen, [0], 0);
        }
        if (sign < 0) {
            s = s.slice(1);
        }
        let chuncks = this._parseChuncks(s);
        if (chuncks[chuncks.length - 1] === 0) { //  0 === -0
            sign = 0;
        }
        return new Chuncks(this._baseLen, chuncks, sign);
    }

    _parseChuncks(s) {
        const base = this._baseLen;
        let chuncks = [];

        for (let i = s.length; i > 0; i -= base) {
            const chunckStartIdx = i < base ? 0 : i - base;
            const chunck = +(s.slice(chunckStartIdx, i));
            if (!Number.isInteger(chunck)) {
                throw new ParserError('Parse error');
            }
            chuncks.push(chunck);
        }
        // удаляем ведущие нули
        while (chuncks.length > 1 && chuncks[chuncks.length - 1] === 0) {
            chuncks.pop();
        }
        return chuncks;
    }

    _parseSign(s) {
        if (!s) {
            return 0;
        }
        let sign = s[0] === '-' ? -1 : 1;
        if (sign < 0 && !(s.length > 1 && s[1] >= '0' && s[1] <= '9')) { // после '-' должна быть цифра
            throw new ParserError('Sign parse error');
        }
        return sign;
    }
}
