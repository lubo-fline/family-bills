/*
 * @Author: your name
 * @Date: 2022-03-10 14:17:51
 * @LastEditTime: 2022-03-10 14:21:24
 * @LastEditors: Please set LastEditors
 * @Description: 解决proxy在ts中报错...类型“ComponentInternalInstance | null”
 * @FilePath: \family-bills\src\hooks\useCurrentInstance.ts
 */
import { ComponentInternalInstance, getCurrentInstance } from 'vue'
export default function useCurrentInstance() {
    const { appContext } = getCurrentInstance() as ComponentInternalInstance
    const proxy  = appContext.config.globalProperties
    return {
        proxy 
    }
}