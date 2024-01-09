const passport = require("passport");
const {
  UserManager,
} = require("../../dao/mongoClassManagers/userClass/userMongoManager");
const userBD = new UserManager();
const Route = require("../../router/Class.Router");

const fs = require("fs");
const uploader = require("../../utils/multer.utils");

class UsersRouter extends Route {
  init() {
    this.post(
      "/",
      ["PUBLIC"],
      passport.authenticate("register", {
        failureRedirect: "/api/users/failRegister",
      }),
      async (req, res) => {
        try {
          req.logger.info("Nuevo usuario registrado");
          res.send({ message: "Usuario registrado" });
        } catch (error) {
          if (error.code === 11000)
            return res.status(400).json({ error: "El usuario ya existe" });
          res.status(500).json({ error: "Internal server error" });
        }
      }
    );

    this.get("/", ["PUBLIC"], async (req, res) => {
      try {
        const users = await userBD.findAll();
        res.json(users);
      } catch (error) {
        return res.sendServerError(`something went wrong ${error}`);
      }
    });

    this.delete("/", ["PREMIUM", "ADMIN"], async (req, res) => {
      try {
        const users = await userBD.findAll();

        const filterDate = new Date();
        filterDate.setMinutes(filterDate.getMinutes() - 1);

        const usersToDelete = users.filter(
          (user) => new Date(user.last_connection) < filterDate
        );

        if (usersToDelete.length !== 0) {
          usersToDelete.forEach(async (user) => {
            await userBD.delete(user.email);
            const mensaje = {
              message: `<div> <h1>Hola!</h1> <h2>Su cuenta se elimino por inactividad</h2> </div>`,
              subject: "Cuenta eliminada de MexaRacing",
            };
            SendMail.inactiveUser(user.email, mensaje);
          });
          return res.sendSuccess("Los usuarios inactivos fueron borrados");
        }

        return res.sendSuccess("No hay usuarios inactivos");
      } catch (error) {
        return res.sendServerError(`something went wrong ${error}`);
      }
    });

    this.get("/failRegister", ["PUBLIC"], (req, res) => {
      res.send({ error: "Falló el registro" });
    });

    this.get("/premium/:email", ["PUBLIC"], async (req, res) => {
      try {
        const email = req.params.email;
        const user = await userBD.findUser(email);
        if (user.role == "USER") {
          await userBD.updateRole(email, "PREMIUM");
          res.send({ message: "Usuario actualizado" });
        } else if (user.role == "PREMIUM") {
          await userBD.updateRole(email, "USER");
          res.send({ message: "Usuario actualizado" });
        } else {
          res.send({ message: "Usuario No actualizado" });
        }
      } catch (error) {
        return res.sendServerError(`something went wrong ${error}`);
      }
    });

    this.put("/premium", ["ADMIN"], async (req, res) => {
      try {
        const id = req.body.id;
        const user = await userBD.findByID(id);
        const email = user.email;
        const role = user.role;

        const rolesChanger = {
          USER: "PREMIUM",
          PREMIUM: "USER",
        };

        const newRole = rolesChanger[role];
        const response = await userBD.updateRole(email, newRole);
        res.sendSuccess(response);
      } catch (error) {
        return res.sendServerError(`something went wrong ${error}`);
      }
    });

    this.delete("/deleteOne", ["ADMIN"], async (req, res) => {
      try {
        const { id } = req.body;

        await userBD.delete(id);

        res.sendSuccess(`El usuario ${id} fue eliminado con éxito`);
      } catch (error) {
        return res.sendServerError(`something went wrong ${error}`);
      }
    });

    this.post(
      "/documents",
      ["USER", "ADMIN", "PREMIUM"],
      uploader.any(),
      async (req, res) => {
        try {
          const currentUser = req.user;

          if (currentUser.role === "PREMIUM") {
            return res.sendSuccess("Ya eres Premium");
          }
          const files = req.files;

          res.sendSuccess(
            `Tus archivos ${files[0].filename} se cargaron correctamente`
          );
        } catch (error) {
          return res.sendServerError(`something went wrong ${error}`);
        }
      }
    );
  }
}

module.exports = UsersRouter;
