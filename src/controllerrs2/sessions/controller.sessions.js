const Route = require("../../router/Class.Router");

class SessionRouter extends Route {
  init() {
    this.get("/current", ["PUBLIC"], (req, res) => {
      try {
        if (req.session.user) {
          res.sendSuccess(req.session.user);
        } else {
          res.sendSuccess({ message: "no eres un usuario logeado" });
        }
      } catch (error) {
        res.sendServerError(`something went wrong ${error}`);
      }
    });

    this.post("/set-session", ["PUBLIC"], (req, res) => {
      try {
        req.session.user = {
          role: "ADMIN",
        };
        res.send("Session set to USER");
      } catch (error) {
        res.sendServerError(`something went wrong ${error}`);
      }
    });
  }
}

module.exports = SessionRouter;
