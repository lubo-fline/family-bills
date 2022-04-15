/*
 * @Author: your name
 * @Date: 2021-08-09 16:36:30
 * @LastEditTime: 2022-04-15 17:12:42
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \fline-init_vue\src\api\index.js
 */
const baseUrl = '/api';
const noToken = '/noToken';
const api = {
    // 获取认证
    oauthToken: {
        login: `${baseUrl}/user/login`, // 账号密码获取token
    },
    bills: {
        list: `${baseUrl}/record/listByMonth`,//月账单列表
        delete: `${baseUrl}/record/`,
        add:`${baseUrl}/record`,
        recordTypeData: `${baseUrl}/recordType`,
        spendCategory: `${baseUrl}/spendCategory/recordTypeId/`,
        edit:`${baseUrl}/record/`
    },
    system: {
        user: {
            list: `${baseUrl}/user/page`,
            add: `${baseUrl}/user/add`,
            getUserData: `${baseUrl}/user`,
            delete: `${baseUrl}/user/`,
            edit: `${baseUrl}/user/edit`,
            reset:`${baseUrl}/user/reset/`
        },
        role: {
            list: `${baseUrl}/role/page`,
            add: `${baseUrl}/role/add`,
            delete: `${baseUrl}/role/`,
            edit: `${baseUrl}/role/edit`,
            rolesMenu: `${baseUrl}/role/ownedMenus/`,
            reset:`${baseUrl}/role/reset/`
        },
        menu: {
            list: `${baseUrl}/menu/allTree`,
            delete: `${baseUrl}/menu/`,
            reset: `${baseUrl}/menu/reset/`,
            add: `${baseUrl}/menu/add`,
            edit:`${baseUrl}/menu/edit`
        },
        payType: {
            list: `${baseUrl}/payType/page`,
            delete: `${baseUrl}/payType/`,
            selectList: `${baseUrl}/payType/list`,
            save:`${baseUrl}/payType/save`
        },
        spendCategory:{
            list: `${baseUrl}/spendCategory/page`,
            delete: `${baseUrl}/spendCategory/`,
            save:`${baseUrl}/spendCategory/save`
        }
    }
}
export default api
