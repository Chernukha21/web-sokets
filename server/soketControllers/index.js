const { Message } = require("../models");

const {
  SOCKET_EVENTS: {
    NEW_MESSAGE,
    NEW_MESSAGE_SUCCESS,
    NEW_MESSAGE_ERROR,

    DELETE_MESSAGE,
    DELETE_MESSAGE_ERROR,
    DELETE_MESSAGE_SUCCESS,

    UPDATE_MESSAGE,
    UPDATE_MESSAGE_ERROR,
    UPDATE_MESSAGE_SUCCESS,

    JOIN_ROOM,
    LEAVE_ROOM,
    JOIN_ROOM_SUCCESS,
    LEAVE_ROOM_SUCCESS,
    ROOM_ERROR,
  },
} = require("../constants");

const AVAILABLE_ROOMS = new Set(["general", "frontend", "backend"]);

const isRoomAvailable = (roomId) => AVAILABLE_ROOMS.has(roomId);

module.exports.createMessage = (socket, io) => {
  socket.on(NEW_MESSAGE, async (payload) => {
    try {
      const { body, roomId } = payload;

      if (!isRoomAvailable(roomId)) {
        return socket.emit(NEW_MESSAGE_ERROR, {
          message: "Unknown room",
        });
      }

      if (!socket.rooms.has(roomId)) {
        return socket.emit(NEW_MESSAGE_ERROR, {
          message: "Join the room before sending messages",
        });
      }

      const createdMessage = await Message.create({
        body,
        roomId,
      });

      io.to(roomId).emit(NEW_MESSAGE_SUCCESS, createdMessage);
    } catch (err) {
      socket.emit(NEW_MESSAGE_ERROR, {
        message: err.message ?? "Error",
      });
    }
  });
};

module.exports.deleteMessage = (socket, io) => {
  socket.on(DELETE_MESSAGE, async ({ messageId }) => {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        return socket.emit(DELETE_MESSAGE_ERROR, {
          message: "Message not found",
        });
      }

      if (!socket.rooms.has(message.roomId)) {
        return socket.emit(DELETE_MESSAGE_ERROR, {
          message: "You are not in this room",
        });
      }

      await message.deleteOne();

      io.to(message.roomId).emit(DELETE_MESSAGE_SUCCESS, {
        messageId: message._id.toString(),
        roomId: message.roomId,
      });
    } catch (err) {
      socket.emit(DELETE_MESSAGE_ERROR, {
        message: err.message ?? "Error",
      });
    }
  });
};

module.exports.updateMessage = (socket, io) => {
  socket.on(UPDATE_MESSAGE, async ({ messageId, body }) => {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        return socket.emit(UPDATE_MESSAGE_ERROR, {
          message: "Message not found",
        });
      }

      if (!socket.rooms.has(message.roomId)) {
        return socket.emit(UPDATE_MESSAGE_ERROR, {
          message: "You are not in this room",
        });
      }

      message.body = body;
      const updatedMessage = await message.save();

      io.to(message.roomId).emit(UPDATE_MESSAGE_SUCCESS, updatedMessage);
    } catch (err) {
      socket.emit(UPDATE_MESSAGE_ERROR, {
        message: err.message ?? "Error",
      });
    }
  });
};

module.exports.joinRoom = (socket) => {
  socket.on(JOIN_ROOM, async ({ roomId }) => {
    try {
      if (!isRoomAvailable(roomId)) {
        return socket.emit(ROOM_ERROR, {
          message: "Unknown room",
        });
      }

      await socket.join(roomId);

      socket.emit(JOIN_ROOM_SUCCESS, {
        roomId,
      });
    } catch (err) {
      socket.emit(ROOM_ERROR, {
        message: err.message ?? "Cannot join room",
      });
    }
  });
};

module.exports.leaveRoom = (socket) => {
  socket.on(LEAVE_ROOM, async ({ roomId }) => {
    try {
      if (!isRoomAvailable(roomId)) {
        return socket.emit(ROOM_ERROR, {
          message: "Unknown room",
        });
      }

      await socket.leave(roomId);

      socket.emit(LEAVE_ROOM_SUCCESS, {
        roomId,
      });
    } catch (err) {
      socket.emit(ROOM_ERROR, {
        message: err.message ?? "Cannot leave room",
      });
    }
  });
};
