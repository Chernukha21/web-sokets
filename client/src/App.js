import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessagesThunk } from "./store/slices/messagesSlice";
import "./App.css";
import MessageList from "./components/MessageList";
import MessageForm from "./components/MessageForm";
import { deleteMessage, updateMessage } from "./api/ws";
import RoomSwitcher from "./components/RoomSwitcher";

function App() {
  const { messages, isFetching, error, limit, activeRoom } = useSelector(
    (state) => state.chat
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getMessagesThunk({
        limit,
        roomId: activeRoom,
      })
    );
  }, [dispatch, limit, activeRoom]);

  useLayoutEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  if (error && error.message === "Network Error") {
    return <p>{error.message}</p>;
  }
  const deleteMessageHandler = (id) => {
    console.log("deleteMessageHandler", id);
    deleteMessage(id);
  };

  const updateMessageHandler = (message) => {
    const body = window.prompt("Edit message", message.body);

    if (!body?.trim() || body.trim() === message.body) {
      return;
    }

    updateMessage({
      messageId: message._id,
      body: body.trim(),
    });
  };
  return (
    <div className="chat-page">
      <main className="chat">
        <header className="chat-header">
          <div className="online-indicator" />

          <div>
            <h1>Socket Chat</h1>
            <p>Real-time messaging</p>
          </div>
        </header>
        <RoomSwitcher />
        {error && (
          <div className="status-message status-message--error">
            {error.message ?? "Something went wrong"}
          </div>
        )}

        {isFetching ? (
          <div className="status-message">Loading messages...</div>
        ) : (
          <MessageList
            messages={messages}
            onEdit={updateMessageHandler}
            onDelete={deleteMessageHandler}
          />
        )}

        <MessageForm />
      </main>
    </div>
  );
}

export default App;
