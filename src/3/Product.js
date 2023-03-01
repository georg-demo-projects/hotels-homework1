import { ProductQueryParser } from "./QueryParser.js";
import { Predicate } from "./Predicate.js";

// класс "Товар"
export class Product {
    constructor({ name, price, quantity, description }) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
    }
}

// репозиторий товаров
export class ProductRepository {
    constructor(products, quertParser = new ProductQueryParser()) {
        this._products = products;
        this._parser = quertParser;
    }

    // выбирает товары по запросу query
    getProducts(query) {
        try {
            // распарсить query
            const queryItems = this._parser.parse(query);
            // преобразовать queryItems в предикаты
            const predicates = queryItems.map(Predicate.fromQueryItem);
            // выбрать товары, которые удовлетворяют всем предикатам
            return this._products.filter(
                product => predicates.every(predicate => predicate.check(product))
            );
        }
        catch (e) {
            // console.debug(e.message);
            throw error;
        }
    }
}
