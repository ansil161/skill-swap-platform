import axios from 'axios'
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/skill/",
  withCredentials: true,  
})
api.interceptors.request.use(
  (config) => {
    console.log("Request sent:", config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    if (error.response && error.response.status === 401) {
      console.log("Unauthorized - redirect to login");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;