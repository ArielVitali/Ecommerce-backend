const passport = require('passport');
const { UserManager } = require('../../dao/mongoClassManagers/userClass/userMongoManager');
const userBD = new UserManager();
const Route = require("../../router/Class.Router");

const fs = require("fs");
const uploader = require("../../utils/multer.utils");

class UsersRouter extends Route {
  init() {
    this.post('/', ['PUBLIC'], passport.authenticate('register', { failureRedirect: '/user/failRegister' }), async (req, res) => {
      try {
        req.logger.info("Nuevo usuario registrado")
        res.send({ message: 'Usuario registrado' });
      } catch (error) {
        if (error.code === 11000) return res.status(400).json({ error: 'El usuario ya existe' })
        res.status(500).json({ error: 'Internal server error' })
      }
    })

    this.get('/failRegister', ['PUBLIC'], (req, res) => {
      res.send({ error: 'Falló el registro' });
    })

    this.get('/premium/:email', ['PUBLIC'], async (req, res) => {
      try {
        const email = req.params.email;
        const user = await userBD.findUser(email);
        console.log(user.role)
        if (user.role == 'USER') {
          await userBD.updateRole(email, 'PREMIUM');
          res.send({ message: 'Usuario actualizado' });
        }
        else if (user.role == 'PREMIUM') {
          await userBD.updateRole(email, 'USER');
          res.send({ message: 'Usuario actualizado' });
        }
        else {
          res.send({ message: 'Usuario No actualizado' });
        }
      }
      catch (error) {
        res.sendServerError(`something went wrong ${error}`)
      }
    })

    this.put("/premium", ["USER", "PREMIUM"], async (req, res) => {
      try {

        const currentUser = req.user;
        const currentRole = currentUser.role;

        if (currentRole === "USER") {

          const path = `${process.cwd()}/src/files/documents/${currentUser.email}`

          if (!fs.existsSync(path)) {
            return res.sendUserError("No has completado la documentación")
          }
        }

        const rolesChanger = {
          USER: "PREMIUM",
          PREMIUM: "USER"
        }

        const newRole = rolesChanger[currentRole];

        const response = await userBD.updateRole(currentUser.email, newRole);


      } catch (error) {
        req.logger.error(error)
        res.sendServerError(error)
      }
    })

    this.post("/documents", ["USER", "ADMIN", "PREMIUM"], uploader.any(), async (req, res) => {
      try {
        const currentUser = req.user;

        if (currentUser.role === "PREMIUM") {
          return res.sendSuccess("Ya eres Premium")
        }
        const files = req.files;

        res.sendSuccess(`Tus archivos ${files[0].filename} se cargaron correctamente`)
      } catch (error) {
        throw new Error(error)
      }
    })
  }
}

module.exports = UsersRouter;