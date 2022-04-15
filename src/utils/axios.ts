/*
 * @Author: your name
 * @Date: 2022-03-09 20:57:05
 * @LastEditTime: 2022-04-14 15:35:08
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \family-bills\src\utils\axios.ts
 */
import axios from 'axios'
import Router from '../router'
import message from 'ant-design-vue/es/message'
// 添加请求拦截器
axios.interceptors.request.use((req) => {
    const userData = localStorage.getItem('userData') || ''
    if (userData != '') {
        req.headers = {
            "token": JSON.parse(userData).token,
        }
    }
    // 统一设置传header
    return req;
}, error => {
    return Promise.reject(error);
})
axios.defaults.timeout = 36000000 //设置超时时间
axios.interceptors.response.use(
    response => {
        // 检测某种状态进行重定向
        if (response.data.retCode === 401||response.data.retCode === 102) {
            message.error(response.data.message)
            Router.push({
                name: 'login'
            })
        } else if (response.data.retCode !== 0) {
            message.error(response.data.message)
        }
        return response
    },
    error => {
        console.log(error)
        if (error.response.status) {
            if (error.response.status === 401) {
                message.error(error.response.data.message)
                Router.push({
                    name: 'login'
                })
            } else {
                message.error(error.response.data.message)
            }
        } else {
            message.error(error.response.statusText)
        }
        return Promise.resolve(error.response)
    }
)
export default axios
