const ProductsRouter = require("../controllerrs2/products/controller.products");
const AuthRouter = require("../controllerrs2/auth/controller.auth");
const CartRouter = require("../controllerrs2/carts/controller.carts");
const RealTimeRouter = require("../controllerrs2/realTime/controller.realTimeProducts");
const UsersRouter = require("../controllerrs2/users/controller.users");
const SessionRouter = require("../controllerrs2/sessions/controller.sessions");
const ViewsRouter = require("../controllerrs2/views/controller.views");

const productsRouter = new ProductsRouter();
const authRouter = new AuthRouter();
const cartRouter = new CartRouter();

const realTimeRouter = new RealTimeRouter();
const usersRouter = new UsersRouter();
const sessionRouter = new SessionRouter();
const viewsRouter = new ViewsRouter();

const router = (app) => {
  app.use("/api/sessions", sessionRouter.getRouter());
  app.use("/api/products", productsRouter.getRouter());
  app.use("/api/carts", cartRouter.getRouter());
  app.use("/api/auth", authRouter.getRouter());
  app.use("/api/realTimeProducts", realTimeRouter.getRouter());

  app.use("/", viewsRouter.getRouter());
  app.use("/api/users", usersRouter.getRouter());
};

module.exports = router;
