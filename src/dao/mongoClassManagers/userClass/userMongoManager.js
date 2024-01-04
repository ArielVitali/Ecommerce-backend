const userModel = require("../../models/user.model");


class UserManager{
    createUser = async (newUser) => {
        try {
            const user = await userModel.create(newUser);

            return user;

            //return newUser;
        } catch (error) {
            throw new Error(error)
        }
    }

    findUser = async(user) => {
        try {
            const response = await userModel.findOne({email: user})
            return response;
        } catch (error) {
            throw new Error(error)
        }
    }

    findByID = async(id) => {
        try {
            const response = await userModel.findById(id)
            return response;
        } catch (error) {
            throw new Error(error)
        }
    }

    updatePassword = async(email, newPassword) => {
        try {
            const response = await userModel.findOneAndUpdate({ email }, { password: newPassword })
            return response;
        } catch (error) {
            throw new Error(error)
        }
    }

    updateRole = async(email, newRole) => {
        try {
            const response = await userModel.findOneAndUpdate({ email }, { role: newRole })
            return response;
        } catch (error) {
            throw new Error(error)
        }
    }
    updateConnection = async(email, new_connection) => {
        try {
            const response = await userModel.findOneAndUpdate({ email }, { last_connection: new_connection })
            return response;
        } catch (error) {
            throw new Error(error)
        }
    }

}

module.exports = {UserManager};