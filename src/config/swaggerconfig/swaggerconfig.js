const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');
const path = require('path');

const swaggerConfig = (app) => {
    const swaggerOptions = {
        definition:{
            openapi: '3.0.0',
            info:{
                title: 'Documentacion API eComerse mexaRacing.',
                description: 'Dcoumentacion sobre los endPoints de la API.'
            }
        },
        apis:[`src/docs/**/*.yaml`],
    }

    console.log(swaggerOptions);
    const specs = swaggerJsdoc(swaggerOptions);
    
    app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
}

module.exports = swaggerConfig;