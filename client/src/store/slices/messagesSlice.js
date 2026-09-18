import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as API from "../../api/http";

const MESSAGES_SLICE_NAME = "messages";
const DEFAULT_MESSAGES_LIMIT = 30;

export const getMessagesThunk = createAsyncThunk(
  `${MESSAGES_SLICE_NAME}/get`,
  async (query, thunkAPI) => {
    try {
      const response = await API.getMessages(query);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({
        message: err.message,
      });
    }
  }
);

const initialState = {
  messages: [],
  isFetching: false,
  error: null,
  limit: DEFAULT_MESSAGES_LIMIT,
  activeRoom: "general",
  rooms: ["general", "frontend", "backend"],
};

const messagesSlice = createSlice({
  name: MESSAGES_SLICE_NAME,
  initialState,
  reducers: {
    newMessageSuccess: (state, { payload }) => {
      state.error = null;
      state.messages = [...state.messages, payload].slice(-state.limit);
    },
    newMessageError: (state, { payload }) => {
      state.error = payload;
    },
    deleteMessageSuccess: (state, { payload }) => {
      state.error = null;

      state.messages = state.messages.filter(
        (message) => message._id !== payload.messageId
      );
    },

    deleteMessageError: (state, { payload }) => {
      state.error = payload;
    },
    updateMessageSuccess: (state, { payload }) => {
      state.error = null;

      const messageIndex = state.messages.findIndex(
        (message) => message._id === payload._id
      );

      if (messageIndex !== -1) {
        state.messages[messageIndex] = payload;
      }
    },

    updateMessageError: (state, { payload }) => {
      state.error = payload;
    },
    roomJoined: (state, { payload }) => {
      state.activeRoom = payload.roomId;
      state.messages = [];
      state.error = null;
    },

    roomError: (state, { payload }) => {
      state.error = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMessagesThunk.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(getMessagesThunk.fulfilled, (state, { payload }) => {
      state.isFetching = false;

      state.messages = [...payload].reverse().slice(-state.limit);
    });
    builder.addCase(getMessagesThunk.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.error = payload;
    });
  },
});

const { reducer, actions } = messagesSlice;

export const {
  newMessageSuccess,
  newMessageError,
  deleteMessageError,
  deleteMessageSuccess,
  updateMessageSuccess,
  updateMessageError,
  roomJoined,
  roomError,
} = actions;

export default reducer;
