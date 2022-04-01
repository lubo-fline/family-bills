/*
 * @Author: your name
 * @Date: 2022-03-09 20:39:26
 * @LastEditTime: 2022-03-12 14:06:22
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \family-bills\src\main.ts
 */
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axiosExpand from './utils/axiosExpand'
import api from './api/index'
import { message } from 'ant-design-vue';
import 'ant-design-vue/es/message/style/css';
import './assets/less/index.less'
const app = createApp(App)
app.use(router).use(store).mount('#app')
app.config.globalProperties.$get = axiosExpand.get
app.config.globalProperties.$del = axiosExpand.delete
app.config.globalProperties.$post = axiosExpand.post
app.config.globalProperties.$put = axiosExpand.put
app.config.globalProperties.$api = api
app.config.globalProperties.$message = message