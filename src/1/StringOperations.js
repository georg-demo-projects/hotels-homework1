// 1. Написать модуль, который будет включать в себя следующие методы.
// 1.1. Преобразование строки к нижнему регистру, но первая буква большая. “Abscd”
// 1.2. Преобразование строки с целью правильно расстановки пробелов. “Вот пример строки,в которой     используются знаки препинания.После знаков должны стоять пробелы , а перед знаками их быть не должно .    Если есть лишние подряд идущие пробелы, они должны быть устранены.” =>
// “Вот пример строки,в которой используются знаки препинания. После знаков должны стоять пробелы, а перед знаками их быть не должно. Если есть лишние подряд идущие пробелы, они должны быть устранены.”
// 1.3. Посдчитывающие кол-во слов в строке.
// 1.4. Подсчитывающий, уникальные слова. “Текст, в котором слово текст несколько раз встречается и слово тоже” - в ответе, что “слово - 2 раза, текст - 2 раза, в - 1 раз, несколько - 1 раз“. Самостоятельно придумать наиболее удачную структуру данных для ответа.

import { InvalidArgumentError } from "../error/InvalidArgumentError.js";

// пунктуационным считается один из символов ['.', ',', '!', '?', ':', '-', '—']
// пробелом считается один из символов [' ', '\t]
// буквой считается любой символ, не относящийся к пунктуационным и пробельным
export class StringOperations {

    _punct = new Set(['.', ',', '!', '?', ':', '-', '—']);

    _isPunct(s) {
        return this._punct.has(s);
    }

    _isSpace(s) {
        return s === ' ' || s === '\t';
    }

    _isLetter(s) {
        return !this._isPunct(s) && !this._isSpace(s);
    }

    // 1.1. Преобразование строки к нижнему регистру, но первая буква большая.
    toUpperFirstOnly(s) {
        this._throwIfNotString(s);
        return s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '';
    }

    // 1.2. Преобразование строки с целью правильно расстановки пробелов.
    fixSpaces(s) {
        this._throwIfNotString(s);

        let afterPunct = false;
        return [...s].map((ch, idx) => {
            if (this._isSpace(ch)) {
                if (idx === s.length - 1 || this._isSpace(s[idx + 1]) || afterPunct) {
                    return '';
                }
            }
            afterPunct = false;
            if (this._isPunct(ch)) {
                afterPunct = true;
                return ch + ' ';
            }
            return ch;
        }).join('').trim();
    }

    // 1.3. Посдчитывающие кол-во слов в строке.
    wordCount(s) {
        this._throwIfNotString(s);

        // можно использовать метод this.fixSpaces, чтобы не было проблем со строками типа "Привет,Мир!!!!!"
        //
        // return this.fixSpaces(s)
        //     .split(' ')
        //     .filter(s => s.length > 1 || this._isLetter(s)) // чтобы отдельно стоящий знак препинания не считался словом
        //     .length;

        // Или (более быстрый вариант за один проход)
        return this._splitIntoWords(s).length;
    }

    // 1.4. Подсчитывающий, уникальные слова. “Текст, в котором слово текст несколько раз встречается и слово тоже” - в ответе, что “слово - 2 раза, текст - 2 раза, в - 1 раз, несколько - 1 раз“. Самостоятельно придумать наиболее удачную структуру данных для ответа.
    eachWordCount(s) {
        this._throwIfNotString(s);

        // Структура ответа зависит от того, как планируется использовать данные в дальнейшем
        // Если нужно определить, сколько раз встретилось слово "qwer", то можем вернуть Map< слово, количество_повторений >

        const map = new Map();
        for (let word of this._splitIntoWords(s)) {
            const count = (map.get(word) || 0) + 1;
            map.set(word, count);
        }
        return map;
    }

    _splitIntoWords(s) {
        const words = [];
        let inWord = false;
        for (let i = 0; i < s.length; ++i) {
            if (!inWord && this._isLetter(s[i])) {
                inWord = true;
                words.push('');
            }
            if (inWord && this._isLetter(s[i])) {
                words[words.length - 1] += s[i];
            }
            if (!this._isLetter(s[i])) {
                inWord = false;
            }
        }
        return words;
    }

    _throwIfNotString(s) {
        if (typeof s !== 'string') {
            throw new InvalidArgumentError('Argument must be a string');
        }
    }
}
