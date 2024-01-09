const { persistence } = require("../config/index");

switch (persistence) {
  case "memory":
    module.exports = require("../dao/fsClassManagers/productsClass/");
    break;

  case "mongo":
    mongoConnect();
    module.exports = require("../dao/mongoClassManagers/userClass/userMongoManager");
    break;
}
