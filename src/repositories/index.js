const UsersDao = require("../dao/factory");
const UserRepository = require("./User.repositorie");

const userRepository = new UserRepository(new UsersDao())

module.exports = userRepository;
