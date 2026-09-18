const { Server } = require("socket.io");
const {
  createMessage,
  deleteMessage,
  updateMessage,
  joinRoom,
  leaveRoom,
} = require("./soketControllers");

const initSocket = (httpServer) => {
  const io = new Server(httpServer, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    createMessage(socket, io);
    deleteMessage(socket, io);
    updateMessage(socket, io);
    joinRoom(socket);
    leaveRoom(socket);
  });
};

module.exports = initSocket;
