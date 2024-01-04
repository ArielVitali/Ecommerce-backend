require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  db: {
    userDb: process.env.DB_USER || "admin",
    passDb: process.env.DB_PASSWORD || "admin",
  },
  persistence: process.env.PERSISTENCE || "mongo",
};

module.exports = config;
