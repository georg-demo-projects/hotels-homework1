import { ProductRepository, ProductQueryParser } from '../../src/3';
import products from './productList'
import { ParserError } from '../../src/error/ParserError';

describe('Products', () => {
    describe('ProductRepository tests', () => {
        products.forEach((p, index) => p.id = index + 1); // добавил id для тестов
        const repository = new ProductRepository(products);

        test('query1', () => {
            const query = "name-contains-Excepteur&price->=20&quantity->10";
            const products = repository.getProducts(query);
            expect(products.length).toBe(1);
            expect(products[0].id).toBe(4);
        });
        test('query2', () => {
            const query = "name-contains-Excepteur&quantity->=5";
            const products = repository.getProducts(query);
            expect(products.length).toBe(3);
            expect(products[0].id).toBe(1);
            expect(products[1].id).toBe(2);
            expect(products[2].id).toBe(4);
        });
        test('No matches', () => {
            const query = "name-starts-xxxxxx&quantity->=5";
            const products = repository.getProducts(query);
            expect(products.length).toBe(0);
        });
    });

    describe('ProductQueryParser tests', () => {
        const parser = new ProductQueryParser();

        const checkParsed = (parsedItem, expectedProp, expectedFunc, expectedArg) => {
            const { prop, func, arg } = parsedItem;
            return prop === expectedProp
                && func === expectedFunc
                && arg === expectedArg;
        }

        test('String property query', () => {
            const [res] = parser.parse("name-contains-qwer");
            expect(checkParsed(res, 'name', 'contains', 'qwer')).toBe(true);
        });
        test('Number propperty query', () => {
            const [res] = parser.parse("price->=20");
            expect(checkParsed(res, 'price', '>=', 20)).toBe(true);
        });
        test('Mix of string and number queries', () => {
            const res = parser.parse("name-contains-qwer&price->=-20&quantity-<10&description-starts-as-d-f");
            expect(res.length).toBe(4);
            expect(checkParsed(res[0], 'name', 'contains', 'qwer')).toBe(true);
            expect(checkParsed(res[1], 'price', '>=', -20)).toBe(true);
            expect(checkParsed(res[2], 'quantity', '<', 10)).toBe(true);
            expect(checkParsed(res[3], 'description', 'starts', 'as-d-f')).toBe(true);
        });
        test('Empty query', () => {
            const parse = () => parser.parse("");
            expect(parse).toThrow(ParserError);
        });
        test('Invalid query', () => {
            expect(() => parser.parse("price>=-20")).toThrow(ParserError);
            expect(() => parser.parse("price->=N_a_N")).toThrow(ParserError);
            expect(() => parser.parse("price->=")).toThrow(ParserError);
            expect(() => parser.parse("name-contains&price")).toThrow(ParserError);
            expect(() => parser.parse("a-b-c")).toThrow(ParserError);
        });
    });
});
