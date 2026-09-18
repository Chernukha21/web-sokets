const MessageList = ({ messages, onEdit, onDelete }) => {
  return (
    <ol className="message-list">
      {messages.map((message) => (
        <li className="message" key={message._id}>
          <div className="message-content">
            <p className="message-text">{message.body}</p>

            {message.createdAt && (
              <time className="message-time">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            )}
          </div>

          <div className="message-actions">
            <button
              className="action-button action-button--edit"
              type="button"
              title="Edit message"
              onClick={() => onEdit(message)}
            >
              Edit
            </button>

            <button
              className="action-button action-button--delete"
              type="button"
              title="Delete message"
              onClick={() => onDelete(message._id)}
            >
              ×
            </button>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default MessageList;
