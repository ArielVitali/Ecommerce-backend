const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const session = require("express-session");

const { dbConnect } = require("./db.config");

const mongoConfig = (app) => {
  const mongooseConnection = mongoose.createConnection(dbConnect, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Check if connect-mongo exports a function (for versions 4 and above)
  const mongoStore = MongoStore.create({
    mongoUrl: dbConnect,
    mongoOptions: { useNewUrlParser: true },
  });

  app.use(
    session({
      store: mongoStore,
      secret: "C0ntr4",
      resave: false,
      saveUninitialized: false,
    })
  );

  mongoose.set("strictQuery", false);
  console.log("dbConnect", dbConnect);

  mongooseConnection.on("open", () => {
    console.log("db connected");
  });

  mongooseConnection.on("error", (error) => {
    console.log(`Cannot connect to db. Error: ${error}`);
  });
};

module.exports = mongoConfig;
