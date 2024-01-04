const enumErrors = require("./enumErrors");

require("colors")

const generateErrorInfo = (code, obj) => {
    if(code === enumErrors.INVALID_TYPES_ERROR){
        const response = `Algunos de los datos son inválidos o inexistentes.
        Lista de datos requeridos:
            *first_name: debe ser un string, se recibió ${obj.first_name}.
            *last_name: debe ser un string, se recibió ${obj.last_name}.
            *email: debe ser un string, se recibió ${obj.email}.
            *age: debe ser un number, se recibió ${obj.age}
        `
        return response.red;
    }
    
    if(code === enumErrors.DATABASE_ERROR){
        const response = `Algunos de los datos son inválidos o inexistentes.
        Lista de datos requeridos:
            *User: debe ser un string, se recibió ${obj.dbUser}.
            *Password: debe ser un string, se recibió ${obj.dbPassword}.
            *Host: debe ser un string, se recibió ${obj.dbHost}.
            *Name: debe ser un string, se recibió ${obj.dbName}.
        `
        return response.red;
    }

    if(code === enumErrors.ROUTING_ERROR){
        const response = `Algunos de los datos son inválidos o inexistentes.
        La ruta buscada no existe.
        `
        return response.red;
    }
    
}

module.exports = generateErrorInfo;