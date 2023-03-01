
import { ParserError } from "../error/ParserError.js";
import { isNumeric } from "../common/numbers.js";

// Парсит query и возвращает массив QueryItem[]
// Например:
// для query = "name-contains-Excepteur&price->=20" вернет
// [
//     { prop: "name", func: "contains", arg: "Excepteur" },
//     { prop: "price", func: ">=", arg: "20" }
// ]
// класс QueryParser содержит метод parse и не содержит конкретных парсеров
// по свойствам объекта, их можно добавить при помощи addPropParser
export class QueryParser {
    _parsers = {};

    // можем зарегистрировать парсер для какого-то нового свойства
    // (для каждого свойства объекта может быть свой парсер)
    // например, для "name" нужно парсить выражения типа "contains-abc"
    addPropParser(prop, parser) {
        this._parsers[prop] = parser;
    }

    parse(query) {
        return query.split('&').map(propQuery => {
            const prop = this._parseProp(propQuery);
            if (!prop) {
                throw new ParserError(`Parser error. Failed to parse property. Query part: "${propQuery}"`);
            }
            const predicateQuery = propQuery.slice(prop.length + 1);
            const predicateParser = this._parsers[prop];
            if (!predicateParser) {
                throw new ParserError(`Parser error. Failed to parse predicate for property "${prop}". Query part: "${predicateQuery}"`);
            }
            const { func, arg } = predicateParser(predicateQuery) || {};
            return new QueryItem(prop, func, arg);
        });
    }

    _parseProp(query) {
        const propLen = query.indexOf('-');
        return propLen > 1 ? query.slice(0, propLen) : null
    }
}

export class QueryItem {
    get prop() { return this._prop; }
    get func() { return this._func; }
    get arg() { return this._arg; }

    constructor(prop, func, arg) {
        this._prop = prop;
        this._func = func;
        this._arg = arg;
    }
}


// класс ProductQueryParser добавляет парсеры выражений для каждого свойства
// и делегирует парсинг объекту класса QueryParser
export class ProductQueryParser {
    constructor() {
        const queryParser = new QueryParser();
        // для каждого свойства объекта может быть свой парсер
        queryParser.addPropParser('name', this._parseStringQuery);
        queryParser.addPropParser('price', this._parseNumberQuery);
        queryParser.addPropParser('quantity', this._parseNumberQuery);
        queryParser.addPropParser('description', this._parseStringQuery);
        this._queryParser = queryParser;
    }

    parse(query) {
        return this._queryParser.parse(query);
    }

    // парсит часть запроса для строкового свойства, например "contains-abc"
    _parseStringQuery(query) {
        const funcLen = query.indexOf('-');
        const func = funcLen > 1 ? query.slice(0, funcLen) : null
        const arg = query.slice(funcLen + 1);
        return func && arg ? { func, arg } : null;
    }

    // парсит часть запроса для числового свойства, например ">=20" или "<50"
    _parseNumberQuery(query) {
        if (!query || query.length < 2) {
            return null;
        }
        const funcLen = query[1] === '=' ? 2 : 1; // например ">=" или "<"
        const func = query.slice(0, funcLen);
        const argStr = query.slice(funcLen);
        if (!isNumeric(argStr)) {
            throw new ParserError(`Argument of predicate "${query}" must be a number`);
        }
        const arg = +argStr;
        return func && arg ? { func, arg } : null;
    }
}
