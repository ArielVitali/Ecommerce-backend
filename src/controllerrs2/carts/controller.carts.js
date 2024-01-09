const { v4: uuidv4 } = require("uuid");

const ticketsModel = require("../../dao/models/tickets.model");
const userModel = require("../../dao/models/user.model");
const {
  MongoCartManager,
} = require("../../dao/mongoClassManagers/cartsClass/cartMongoManager");
const cartsMongo = new MongoCartManager();
const {
  MongoProductManager,
} = require("../../dao/mongoClassManagers/productsClass/productMongoManager");
const productsMongo = new MongoProductManager();
const Route = require("../../router/Class.Router");
const {
  UserManager,
} = require("../../dao/mongoClassManagers/userClass/userMongoManager");
const userManager = new UserManager();

class CartRouter extends Route {
  init() {
    this.get("/", ["PUBLIC"], async (req, res) => {
      try {
        const carts = await cartsMongo.getCarts();
        res.sendSuccess(carts);
      } catch (error) {
        return res.sendServerError(`something went wrong ${error}`);
      }
    });

    this.post("/", ["USER", "PREMIUM", "ADMIN"], async (req, res) => {
      try {
        let cid;
        const id = req.body.id;
        const existenceCart = await cartsMongo.findUserID(id);
        let response;
        if (!existenceCart) {
          const carrito = {
            owner: id,
          };
          const createdCart = await cartsMongo.addCart(carrito);
          cid = createdCart.id;
          const addCartToUser = await userManager.addCartToUser(id, cid);
          response = {
            response: 1,
            cart: cid,
          };
        } else {
          cid = existenceCart.id;
          response = {
            response: 0,
            cart: cid,
          };
        }
        return res.sendSuccess(response);
      } catch (error) {
        return res.sendServerError(`something went wrong ${error}`);
      }
    });

    this.get("/:id", ["PUBLIC"], async (req, res) => {
      try {
        const cartId = req.params.id;
        const getById = await cartsMongo.getCartById(cartId);
        res.sendSuccess(getById);
      } catch (error) {
        return res.sendServerError(`something went wrong ${error}`);
      }
    });

    this.get(
      "/:cid/purchase",
      ["USER", "PREMIUM", "ADMIN"],
      async (req, res) => {
        try {
          const { cid } = req.params;
          const cart = await cartsMongo.getCartById(cid);
          const productsToPurchase = cart.products;
          let products = [];
          const currentUser = cart.owner;

          const purchaseFilterAvailable = productsToPurchase.filter(
            (p) => p.product.stock !== 0 && p.product.stock > p.quantity
          );
          const purchaseFilterUnavailable = productsToPurchase.filter(
            (p) => p.product.stock === 0 || p.product.stock < p.quantity
          );
          if (purchaseFilterUnavailable.length == 0) {
            try {
              await Promise.all(
                purchaseFilterAvailable.map(async (p) => {
                  const productToSell = await productsMongo.getProductById(
                    p.product._id
                  );
                  productToSell.stock = productToSell.stock - p.quantity;

                  let product = {
                    title: productToSell.title,
                    quantity: p.quantity,
                  };
                  products.push(product);

                  await productsMongo.updateProduct(
                    p.product._id,
                    productToSell
                  );
                })
              );
            } catch (error) {
              return res.sendServerError(`something went wrong ${error}`);
            }
          } else {
            return res.sendSuccess("Hay productos no disponibles");
          }
          const newTicketInfo = {
            code: uuidv4(),
            purchase_datatime: new Date().toLocaleString(),
            amount: purchaseFilterAvailable.reduce(
              (acc, curr) => acc + curr.product.price * curr.quantity,
              0
            ),
            purchaser: currentUser.email,
            products: products,
          };

          const newTicket = await ticketsModel.create(newTicketInfo);

          res.sendSuccess("newTicket");
        } catch (error) {
          return res.sendServerError(`something went wrong ${error}`);
        }
      }
    );

    this.post(
      "/:cid/products/:pid",
      ["USER", "PREMIUM", "ADMIN"],
      async (req, res) => {
        try {
          const cartId = req.params.cid;
          const productId = req.params.pid;
          const getCartById = await cartsMongo.getCartById(cartId);
          const verifyExistence = getCartById.products.find(
            (e) => e.product.id == productId
          );

          if (verifyExistence) {
            const updateCartProducts = await cartsMongo.postCartProductsId(
              cartId,
              productId,
              true
            );
            res.sendSuccess(updateCartProducts);
          } else {
            const updateCartProducts = await cartsMongo.postCartProductsId(
              cartId,
              productId,
              false
            );
            res.sendSuccess(updateCartProducts);
          }
        } catch (error) {
          return res.sendServerError(`something went wrong ${error}`);
        }
      }
    );

    this.delete(
      "/:cid/products/:pid",
      ["USER", "PREMIUM", "ADMIN"],
      async (req, res) => {
        try {
          const cartId = req.params.cid;
          const productId = req.params.pid;
          const getCartById = await cartsMongo.getCartById(cartId);
          const verifyExistence = getCartById.products.find(
            (e) => e.product.id == productId
          );

          if (verifyExistence === undefined) {
            res.sendUserError({ mesagge: "not found" });
          } else {
            const productsArrayPosition = getCartById.products.findIndex(
              (item) => item.product.id === productId
            );
            getCartById.products.splice(productsArrayPosition, 1);
            let newArray = getCartById.products;
            const deleteCartProducts = await cartsMongo.deleteCartProductsId(
              cartId,
              newArray
            );
            res.sendSuccess(deleteCartProducts);
          }
        } catch (error) {
          return res.sendServerError(`something went wrong ${error}`);
        }
      }
    );

    this.delete("/:id", ["USER", "PREMIUM", "ADMIN"], async (req, res) => {
      try {
        const id = req.body.id;
        const cartId = req.params.id;
        const getById = await cartsMongo.deleteById(cartId);
        const carrito = {
          owner: id,
        };
        const createdCart = await cartsMongo.addCart(carrito);
        let cid = createdCart.id;
        const addCartToUser = await userManager.addCartToUser(id, cid);
        const response = {
          delete: getById,
          addCart: addCartToUser,
        };
        res.sendSuccess(response);
      } catch (error) {
        return res.sendServerError(`something went wrong ${error}`);
      }
    });

    this.put(
      "/:cid/products/:pid",
      ["USER", "PREMIUM", "ADMIN"],
      async (req, res) => {
        try {
          const { quantity } = req.body;
          const cartId = req.params.cid;
          const productId = req.params.pid;
          const getCartById = await cartsMongo.getCartById(cartId);

          const verifyExistence = getCartById.products.find(
            (e) => e.product.id == productId
          );
          if (verifyExistence) {
            const updateCartProducts = await cartsMongo.updateCartProductsId(
              cartId,
              productId,
              true,
              quantity
            );
            res.sendSuccess(updateCartProducts);
          } else {
            const updateCartProducts = await cartsMongo.updateCartProductsId(
              cartId,
              productId,
              false,
              quantity
            );
            res.sendSuccess(updateCartProducts);
          }
        } catch (error) {
          return res.sendServerError(`something went wrong ${error}`);
        }
      }
    );

    this.put("/:cid", ["PUBLIC"], async (req, res) => {
      try {
        const { products } = req.body;
        const cartId = req.params.cid;
        const getCartById = await cartsMongo.updateCartId(cartId, products);
        res.sendSuccess("cart updated");
      } catch (error) {
        return res.sendServerError(`something went wrong ${error}`);
      }
    });
  }
}

module.exports = CartRouter;
