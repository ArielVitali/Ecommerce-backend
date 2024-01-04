const {faker} = require("@faker-js/faker")

faker.locale = "es";

const createMock = (number) => {

    const products = [];

    for(let i=0; i<number; i++){
        const product = {
            id: i+1,
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            thumbail: faker.image.abstract(),
            code: faker.datatype.number(),
            stock: faker.datatype.number(),
            status: true,
            category: faker.commerce.product()
        }

        products.push(product);
    };

    return products;
}

module.exports = createMock;