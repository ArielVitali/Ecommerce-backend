const { MongoProductManager } = require('../../dao/mongoClassManagers/productsClass/productMongoManager');
const productsMongo = new MongoProductManager();

const Route = require("../../router/Class.Router");

class RealTimeRouter extends Route {
  init() {
    this.get('/', ['PUBLIC'], async (req, res) => {
      try {
        const products = await productsMongo.getProducts();
        const getAll = products;
    
        global.io.emit('productsList', products);
        res.sendSuccess(getAll);  
      } 
      catch (error) {
        res.sendServerError(`something went wrong ${error}`)
      }
    })
  }
}

module.exports = RealTimeRouter;