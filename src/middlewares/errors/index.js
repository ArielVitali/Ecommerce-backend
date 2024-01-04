const enumErrors = require("../../utils/errors/enumErrors");


const errorHandler = (error, req, res, next) => {
    
    
    console.log(error.cause);
    
    switch (error.code) {
        case enumErrors.INVALID_TYPES_ERROR:
            res.json({status: "error", error: error.name})
            break;
        case enumErrors.DATABASE_ERROR:
            res.json({status: "error", error: error.name})
            break;
        case enumErrors.ROUTING_ERROR:
            res.json({status: "error", error: error.name})
            break;
            
        default:
            res.json({status: "error", error: "Error desconocido"})
                
            break;
    }
    
    next();
    
}

module.exports = errorHandler;