const winston =require("winston");

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors:{
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "gray"
    }
}

const logger = winston.createLogger({
    transports:[
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: `${process.cwd()}/src/files/logs/errors.log`,
            level: "error",
            format: winston.format.simple()
        }),
    ]
})

module.exports = logger;