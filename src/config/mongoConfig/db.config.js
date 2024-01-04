require("dotenv").config();

module.exports = {
  dbConnect: process.env.CONNECT,
  dbSessionName: process.env.DB_SESSION_NAME,
};
