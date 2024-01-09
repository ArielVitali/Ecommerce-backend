const userModel = require("../../models/user.model");

class UserManager {
  createUser = async (newUser) => {
    try {
      const user = await userModel.create(newUser);
      return user;
    } catch (error) {
      return error;
    }
  };

  addCartToUser = async (uid, cid) => {
    try {
      const response = await userModel.findOneAndUpdate(
        { _id: uid },
        { cart: cid }
      );
      return response;
    } catch (error) {
      return error;
    }
  };

  findUser = async (user) => {
    try {
      const response = await userModel.findOne({ email: user });
      return response;
    } catch (error) {
      return error;
    }
  };

  findByID = async (id) => {
    try {
      const response = await userModel.findById(id);
      return response;
    } catch (error) {
      return error;
    }
  };

  updatePassword = async (email, newPassword) => {
    try {
      const response = await userModel.findOneAndUpdate(
        { email },
        { password: newPassword }
      );
      return response;
    } catch (error) {
      return error;
    }
  };

  updateRole = async (email, newRole) => {
    try {
      const response = await userModel.findOneAndUpdate(
        { email },
        { role: newRole }
      );
      return response;
    } catch (error) {
      return error;
    }
  };

  updateConnection = async (_id, new_connection) => {
    try {
      const response = await userModel.findOneAndUpdate(
        { _id },
        { last_connection: new_connection }
      );
      return response;
    } catch (error) {
      return error;
    }
  };

  findAll = async () => {
    try {
      const response = await userModel.find(
        {},
        { first_name: 1, email: 1, role: 1, last_connection: 1, _id: 1 }
      );
      return response;
    } catch (error) {
      return error;
    }
  };

  delete = async (_id) => {
    try {
      const response = await userModel.deleteOne({ _id });
      return response;
    } catch (error) {
      return error;
    }
  };
}

module.exports = { UserManager };
