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

    let res = response.data

    // 暂时数据代理
    let resData = res.data
    Object.defineProperty(res, 'data', {
        get() {
            if (resData) {
                return resData
            } else {
                return res
            }
        }
    })
    // console.log(res, resData)
    if (res.success === false || res.data.success === false) {
        alert(res.errorMsg || '服务器错误')
    }
    return res.data
    // return response
}, err => {
    Promise.reject(err)
})

export default service