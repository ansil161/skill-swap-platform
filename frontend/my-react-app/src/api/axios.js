import axios from 'axios'
const api = axios.create({
  baseURL: "http://localhost:8000/skill/",
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
  (response) => response,
  async (error) => {

    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      try {
        await api.post("refresh/"); 

        return api(originalRequest); 

      } catch (err) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;