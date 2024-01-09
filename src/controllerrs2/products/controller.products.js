const Route = require("../../router/Class.Router");

const {
  MongoProductManager,
} = require("../../dao/mongoClassManagers/productsClass/productMongoManager");
const productsMongo = new MongoProductManager();
const {
  UserManager,
} = require("../../dao/mongoClassManagers/userClass/userMongoManager");
const userManager = new UserManager();
const createMock = require("../../utils/mocks/productsMock");
const productError = require("../../utils/errors/product/product.error");

const privateAcces = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

class ProductsRouter extends Route {
  init() {
    this.get("/", ["PUBLIC"], async (req, res) => {
      try {
        const { user } = req.session;

        let linkMold = "/products/";
        let limit;
        let page;
        let sort;
        let prevSort;
        let filter;

        if (req.query.category == undefined && req.query.stock == undefined) {
          filter = {};
        } else if (
          req.query.category == undefined &&
          req.query.stock != undefined
        ) {
          filter = {
            stock: { $gte: req.query.stock },
          };
        } else if (
          req.query.category != undefined &&
          req.query.stock == undefined
        ) {
          filter = {
            category: { $regex: req.query.category },
          };
        } else {
          filter = {
            category: { $regex: req.query.category },
            stock: { $gte: req.query.stock },
          };
        }

        if (req.query.limit == undefined) {
          limit = 10;
        } else {
          limit = req.query.limit;
        }

        if (req.query.page == undefined) {
          page = 1;
        } else {
          page = req.query.page;
        }

        if (req.query.sort == "asc") {
          prevSort = "asc";
          sort = 1;
        } else if (req.query.sort == "desc") {
          prevSort = "desc";
          sort = -1;
        } else {
          sort = undefined;
        }

        const condicionesQery = {
          page: page,
          limit: limit,
          sort: { price: sort },
        };

        const products = await productsMongo.getProducts(
          filter,
          condicionesQery
        );
        let nextLink;
        let prevLink;
        if (products.hasPrevPage == false) {
          prevLink = null;
        } else {
          prevLink =
            "/products" +
            "?" +
            `page=${products.prevPage}` +
            `&limit=${limit}&sort=${prevSort}`;
        }

        if (products.hasNextPage == false) {
          nextLink = null;
        } else {
          nextLink =
            "/products" +
            "?" +
            `page=${products.nextPage}` +
            `&limit=${limit}&sort=${prevSort}`;
        }

        const respuestaInfo = {
          status: "success",
          playload: products.docs,
          totalPges: products.totalDocs,
          prevPage: products.prevPage,
          nextPage: products.nextPage,
          page: products.page,
          hasPrevPage: products.hasPrevPage,
          hasNextPage: products.hasNextPage,
          prevLink: prevLink,
          nextLink: nextLink,
          linkMold: linkMold,
          user: user,
        };
        res.sendSuccess(respuestaInfo);
      } catch (error) {
        return res.sendServerError(`something went wrong ${error}`);
      }
    });

    this.get("/mockingproducts", ["PUBLIC"], (req, res) => {
      const products = createMock(100);

      res.sendSuccess(products);
    });

    this.get("/:id", ["USER", "PREMIUM", "ADMIN"], async (req, res) => {
      try {
        const productId = req.params.id;
        const getById = await productsMongo.getProductById(productId);
        res.sendSuccess(getById);
      } catch (error) {
        return res.sendServerError(`something went wrong ${error}`);
      }
    });

    this.post("/", ["ADMIN"], async (req, res) => {
      try {
        const {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          status,
          category,
        } = req.body;
        const newProduct = {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          status,
          category,
        };
        const verifyExistenceUndefined =
          Object.values(newProduct).indexOf(undefined);
        if (verifyExistenceUndefined === -1) {
          const createdProduct = await productsMongo.addProduct(newProduct);
          const products = await productsMongo.getProducts();
          global.io.emit("statusProductsList", products);
          res.sendSuccess(createdProduct);
        } else {
          res.sendUserError({ mesagge: "Product with missing information" });
          return productError(null, {
            title,
            description,
            price,
            thumbail,
            code,
            stock,
            category,
          });
        }
      } catch (error) {
        return res.sendServerError(`something went wrong ${error}`);
      }
    });

    this.put("/:id", ["ADMIN"], async (req, res) => {
      try {
        const productId = req.params.id;
        const {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          status,
          category,
        } = req.body;
        const newUpdatedProduct = {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          status,
          category,
        };
        const verifyExistenceUndefined =
          Object.values(newUpdatedProduct).indexOf(undefined);

        if (verifyExistenceUndefined === -1) {
          const UpdatedProduct = await productsMongo.updateProduct(
            productId,
            newUpdatedProduct
          );
          const products = await productsMongo.getProducts();
          global.io.emit("statusProductsList", products);
          res.sendSuccess(UpdatedProduct);
        } else {
          res.sendUserError({ mesagge: "Product with missing information" });
          return productError(null, {
            title,
            description,
            price,
            thumbail,
            code,
            stock,
            category,
          });
        }
      } catch (error) {
        return res.sendServerError(`something went wrong ${error}`);
      }
    });

    this.delete("/:id", ["ADMIN, PREMIUM"], async (req, res) => {
      try {
        const productId = req.params.id;
        const getById = await productsMongo.deleteById(productId);
        const products = await productsMongo.getProducts();
        global.io.emit("statusProductsList", products);
        res.sendSuccess(getById);
      } catch (error) {
        return res.sendServerError(`something went wrong ${error}`);
      }
    });

    this.delete("/", ["ADMIN"], async (req, res) => {
      try {
        const { id } = req.body;

        await productsMongo.deleteById(id);

        res.sendSuccess(`El usuario ${id} fue eliminado con éxito`);
      } catch (error) {
        return res.sendServerError(`something went wrong ${error}`);
      }
    });
  }
}

module.exports = ProductsRouter;
