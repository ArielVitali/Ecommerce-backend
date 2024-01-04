//const productModel = require("../../../dao/mongo/models/products.model")
const CustomError = require("../customErrors")
const enumErrors = require("../enumErrors")

require("colors")

const productError = (pid, obj) => {
    //const products = await productModel.count();
    /*if(typeof pid !== "number"){
        CustomError.createError({
            name: "Error al encontrar el producto",
            cause: `Se esperaba un número y se obtuvo un ${typeof pid}`,
            message: "Error por param no válido",
            code: enumErrors.INVALID_TYPES_ERROR
        })
    }*/


    /*if(pid>products){
        CustomError.createError({
            name: "Error al encontrar el producto",
            cause: `Se esperaba un número menor a ${products} y se obtuvo un ${pid}`,
            message: "Error por param no válido",
            code: enumErrors.INVALID_TYPES_ERROR
        })
    }*/

    if(!obj.title || !obj.description || !obj.price || !obj.thumbail || !obj.code || !obj.stock || !obj.category){
        CustomError.createError({
            name: "Error al agregar el producto",
            cause: `Alguno de los datos son inválidos:
            *Título: Se esperaba un string, se recibió: ${obj.title}
            *Description: Se esperaba un string, se recibió: ${obj.description}
            *Price: Se esperaba un number, se recibió: ${obj.price}
            *Thumbail: Se esperaba un string, se recibió: ${obj.thumbail}
            *Code: Se esperaba un string, se recibió: ${obj.code}
            *Stock: Se esperaba un number, se recibió: ${obj.stock}
            *Category: Se esperaba un string, se recibió: ${obj.category}`.red,
            message: "Error por datos inválidos",
            code: enumErrors.INVALID_TYPES_ERROR 
        })
    }
}

module.exports = productError