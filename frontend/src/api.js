import axios from "axios";

const api = axios.create({
  baseURL:   "http://localhost:4000/api",  //process.env.REACT_APP_API_URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

export default api;