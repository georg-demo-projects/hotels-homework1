import { InvalidArgumentError } from "../error/InvalidArgumentError";

// предикат, созданный по результатам парсера. (QueryItem -> Predicate)
export class Predicate {
    constructor(predicate) {
        this._predicate = predicate;
    }

    // возвращает true, если product удовлетворяет условию предиката
    // false - иначе
    check(product) {
        return this._predicate(product);
    }

    static _predicates = {
        '<': (queryArg, propValue) => propValue < queryArg,
        '=': (queryArg, propValue) => propValue === queryArg,
        '>': (queryArg, propValue) => propValue > queryArg,
        '<=': (queryArg, propValue) => propValue <= queryArg,
        '>=': (queryArg, propValue) => propValue >= queryArg,

        contains: (queryArg, propValue) => propValue.includes(queryArg),
        starts: (queryArg, propValue) => propValue.startsWith(queryArg),
        ends: (queryArg, propValue) => propValue.endsWith(queryArg),
    };

    // создает предикат из QueryItem, например:
    // query: "price->=20"
    // predicate: (product) => product.price >= 20
    static fromQueryItem({ prop, func, arg } = {}) {
        const predicate = Predicate._predicates[func];
        if (!predicate) {
            throw new InvalidArgumentError(`Predicate creation error. Operation "${func}" is not defined`);
        }
        return new Predicate(product => prop in product && predicate(arg, product[prop]))
    }
}
