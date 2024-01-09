const express = require("express");
const morgan = require("morgan");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const router = require("../router");
const cors = require("cors");
const loggerMiddleware = require("../middlewares/logger.middlewares");

const {
  MongoChatManager,
} = require("../dao/mongoClassManagers/chatClass/chatMongoManager");
const chatMongo = new MongoChatManager();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../public"));

app.use(loggerMiddleware);

global.io = io;

router;

io.on("connection", (socket) => {
  console.log(`New client with id ${socket.id}`);

  socket.on("newUser", async (user) => {
    socket.emit("bienvenida", user);
    const mesagges = await chatMongo.getMesagges();
    io.emit("messageLogs", mesagges);
  });

  socket.on("message", async (data) => {
    const saveMessageDB = await chatMongo.saveMesagge(data);
    const mesagges = await chatMongo.getMesagges();
    io.emit("messageLogs", mesagges);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

module.exports = { server, io, app };
