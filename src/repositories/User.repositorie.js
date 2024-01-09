class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createUser = async (newUser) => {
    try {
      const user = await this.dao.createUser(newUser);
      return user;
    } catch (error) {
      return error;
    }
  };

  findAll = async () => {
    try {
      const response = await this.dao.findAll();
      return response;
    } catch (error) {
      return error;
    }
  };

  findUser = async (email) => {
    try {
      const response = await this.dao.findUser(email);
      return response;
    } catch (error) {
      return error;
    }
  };

  findById = async (id) => {
    try {
      const result = await this.dao.findById(id);
      return result;
    } catch (error) {
      return error;
    }
  };

  updateUser = async (email, newPassword) => {
    try {
      await this.dao.updateUser(email, newPassword);
    } catch (error) {
      return error;
    }
  };
}

module.exports = UserRepository;
