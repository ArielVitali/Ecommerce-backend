const Route = require("../../router/Class.Router");
const { MongoProductManager } = require('../../dao/mongoClassManagers/productsClass/productMongoManager');
const productsMongo = new MongoProductManager();

const publicAcces = (req, res, next) => {
    if (req.session.user) {
        return res.redirect("/products")
    }
    next();
}

const privateAcces = (req, res, next) => {
    if (!req.session.user) {
        return res.status(200).redirect("/login")
    }
    next();
}

class ViewsRouter extends Route {
    init() {
        this.get('/', ['PUBLIC'], (req, res) => {
            try {
                res.status(200).redirect('/login')
            }
            catch (error) {
                res.sendServerError(`something went wrong ${error}`)
            }
        })

        this.get('/signup', ['PUBLIC'], (req, res) => {
            try {
                res.status(200).render("signup")
            }
            catch (error) {
                res.sendServerError(`something went wrong ${error}`)
            }
        })

        this.get('/login', ['PUBLIC'], (req, res) => {
            try {
                if (req.session.user) {
                    return res.status(200).redirect('/products')
                }
                res.status(200).render("login")
            }
            catch (error) {
                res.sendServerError(`something went wrong ${error}`)
            }
        })

        this.get('/products', ['USER'], (req, res) => {
            try {
                res.status(200).render('products');
            }
            catch (error) {
                res.sendServerError(`something went wrong ${error}`)
            }
        })

        this.get('/products/:pid', ['USER'], (req, res) => {
            try {
                const productId = req.params.id;
                res.status(200).render('productID');
            }
            catch (error) {
                res.sendServerError(`something went wrong ${error}`)
            }
        })

        this.get('/chat', ['USER'], (req, res) => {
            try {
                res.status(200).render('chat.handlebars', {})
            }
            catch (error) {
                res.sendServerError(`something went wrong ${error}`)
            }
        })

        this.get('/realTimeProducts', ['USER'], (req, res) => {
            try {
                res.status(200).render('realTimeProducts.handlebars', {});
            }
            catch (error) {
                res.sendServerError(`something went wrong ${error}`)
            }
        })

        this.get('/cart/:id', ['USER'], (req, res) => {
            try {
                const cartId = req.params.id;
                res.status(200).render('cart', { cartId });
            }
            catch (error) {
                res.sendServerError(`something went wrong ${error}`)
            }
        })

        this.get('/carts', ['USER'], (req, res) => {
            try {
                res.status(200).render('carts');
            }
            catch (error) {
                res.sendServerError(`something went wrong ${error}`)
            }
        })

        this.get('/profile', ['USER'], (req, res) => {
            try {
                res.status(200).render('profile');
            }
            catch (error) {
                res.sendServerError(`something went wrong ${error}`)
            }
        })

        this.get('/waitting', ['PUBLIC'], (req, res) => {
            try {
                res.status(200).render('waitting');
            }
            catch (error) {
                res.sendServerError(`something went wrong ${error}`)
            }
        })

        this.get('/passwordForget', ['PUBLIC'], (req, res) => {
            try {
                res.status(200).render('passwordForget');
            }
            catch (error) {
                res.sendServerError(`something went wrong ${error}`)
            }
        })

        this.get('/passwordReset/:id', ['PUBLIC'], (req, res) => {
            try {
                const productId = req.params.id;
                const currentTimestamp = new Date().getTime();

                if (req.session && req.session.expirationTime && currentTimestamp > req.session.expirationTime) {
                    res.status(200).redirect('/passwordForget')
                  } else {
                    res.status(200).render('passwordReset');
                  }
            }
            catch (error) {
                res.sendServerError(`something went wrong ${error}`)
            }
        })

        this.get('/loggerTest/:tipo', ['PUBLIC'], (req, res) => {
            try {
                const loggerType = req.params.tipo;
                switch (loggerType) {
                    case 'fatal':
                        req.logger.fatal("logger fatal")
                        break;
                    case 'error':
                        req.logger.error("logger error")
                        break;

                    case 'warning':
                        req.logger.warning("logger warning")
                        break;

                    case 'info':
                        req.logger.info("logger info")
                        break;

                    case 'http':
                        req.logger.http("logger http")
                        break;

                    case 'debug':
                        req.logger.debug("logger debug")
                        break;
                    default:
                        break;
                }
                res.status(200).json({message: 'succes'});
            }
            catch (error) {
                res.sendServerError(`something went wrong ${error}`)
            }
        })
    }
}

module.exports = ViewsRouter;