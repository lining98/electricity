import axios from "axios";
export default function (config) {
    const myaxios = axios.create({
        baseURL: process.env.VUE_APP_BASE_URL,
        // baseURL: '/',
        // timeout: 10000
    })

    // 添加请求拦截器
    myaxios.interceptors.request.use(
        function (config) {
            config.headers.Authorization = sessionStorage.getItem('token')
            return config
        },

        function (error) {
            return Promise.reject(error)
        }
    )

    // 添加响应拦截器
    myaxios.interceptors.response.use(
        function (response) {
            if (response.data.status == 400) {
                sessionStorage.removeItem('token')
                this.$router.push('/login')
            }
            return response.data
        },
        function (error) {
            return Promise.reject(error)
        }
    )

    return myaxios(config)
}