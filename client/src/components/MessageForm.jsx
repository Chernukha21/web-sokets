import { ErrorMessage, Field, Form as FormikForm, Formik } from "formik";

import { createMessage } from "../api/ws";
import { useSelector } from "react-redux";

const validateMessage = (values) => {
  const errors = {};

  if (!values.body.trim()) {
    errors.body = "Message cannot be empty";
  }

  return errors;
};

const MessageForm = () => {
  const activeRoom = useSelector((state) => state.chat.activeRoom);
  const addMessage = (values, { resetForm }) => {
    createMessage({
      body: values.body.trim(),
      roomId: activeRoom,
    });

    resetForm();

    resetForm();
  };

  return (
    <Formik
      initialValues={{ body: "" }}
      validate={validateMessage}
      onSubmit={addMessage}
    >
      <FormikForm className="message-form" noValidate>
        <div className="message-field">
          <Field
            className="message-input"
            name="body"
            placeholder="Write a message..."
            autoComplete="off"
            aria-describedby="body-error"
          />

          <ErrorMessage
            id="body-error"
            className="field-error"
            name="body"
            component="span"
          />
        </div>

        <button className="send-button" type="submit">
          Send
        </button>
      </FormikForm>
    </Formik>
  );
};

export default MessageForm;
