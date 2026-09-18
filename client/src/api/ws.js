import { io } from "socket.io-client";
import {
  deleteMessageError,
  deleteMessageSuccess,
  newMessageError,
  newMessageSuccess,
  roomError,
  roomJoined,
  updateMessageError,
  updateMessageSuccess,
} from "../store/slices/messagesSlice";
import CONSTANTS from "./../constants";

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
    ROOM_ERROR,
    LEAVE_ROOM_SUCCESS,
    LEAVE_ROOM_ERROR,
    JOIN_ROOM_SUCCESS,
    JOIN_ROOM_ERROR,
    JOIN_ROOM,
    LEAVE_ROOM,
  },
} = CONSTANTS;

const socket = io("http://localhost:5000");

export const createMessage = (payload) => {
  socket.emit(NEW_MESSAGE, payload);
};

export const deleteMessage = (messageId) => {
  socket.emit(DELETE_MESSAGE, { messageId });
};

export const updateMessage = (payload) => {
  socket.emit(UPDATE_MESSAGE, payload);
};

export const joinRoom = (roomId) => {
  socket.emit(JOIN_ROOM, { roomId });
};

export const leaveRoom = (roomId) => {
  socket.emit(LEAVE_ROOM, { roomId });
};

export const bringStoreToSocket = (store) => {
  socket.on(NEW_MESSAGE_SUCCESS, (payload) => {
    store.dispatch(newMessageSuccess(payload));
  });

  socket.on(NEW_MESSAGE_ERROR, (error) => {
    store.dispatch(newMessageError(error));
  });

  socket.on(DELETE_MESSAGE_SUCCESS, (payload) => {
    store.dispatch(deleteMessageSuccess(payload));
  });

  socket.on(DELETE_MESSAGE_ERROR, (error) => {
    store.dispatch(deleteMessageError(error));
  });

  socket.on(UPDATE_MESSAGE_SUCCESS, (payload) => {
    store.dispatch(updateMessageSuccess(payload));
  });

  socket.on(UPDATE_MESSAGE_ERROR, (error) => {
    store.dispatch(updateMessageError(error));
  });

  socket.on(JOIN_ROOM_SUCCESS, (payload) => {
    alert(`Joined room: ${payload.roomId}`);
    store.dispatch(roomJoined(payload));
  });

  socket.on(LEAVE_ROOM_SUCCESS, (payload) => {
    alert(`Left room: ${payload.roomId}`);
  });

  socket.on(ROOM_ERROR, (error) => {
    store.dispatch(roomError(error));
  });
};
