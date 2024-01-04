const logger = require("../logger/factory.logger")

const loggerMiddleware = (req, res, next) => {
    req.logger = logger
    req.logger.http(
        `${req.method} en ${req.url} - ${new Date().toLocaleString()}`
    )

    next();
}

module.exports = loggerMiddleware