import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.REACT_APP_APIS_URL
})

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    const token = localStorage.getItem('persist:shop') && JSON.parse(localStorage.getItem('persist:shop')).accessToken.slice(1, -1)
    config.headers = { authorization: `Bearer ${token}` }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    return response.data
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return error.response.data
});

export default instance