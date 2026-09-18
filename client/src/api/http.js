import axios from "axios";

const axiosOptions = {
  baseURL: "http://127.0.0.1:5000/api",
};

const apiInstance = axios.create(axiosOptions);

export const getMessages = ({ limit, roomId }) =>
  apiInstance.get("/messages", {
    params: {
      limit,
      roomId,
    },
  });
