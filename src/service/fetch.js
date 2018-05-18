import axios from 'axios'

const service = axios.create({
   baseURL: process.env.REACT_APP_BASE_URL,
   timeout: 10000
})

service.interceptors.request.use(config => {
    return config
}, err => {
    Promise.reject(err)
})

service.interceptors.response.use(response => {
    console.log('fetched', response)
    return response
}, err => {
    Promise.reject(err)
})

export default service