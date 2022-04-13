/*
 * @Author: your name
 * @Date: 2021-08-09 16:36:30
 * @LastEditTime: 2022-04-13 15:54:37
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
        spendCategory:`${baseUrl}/spendCategory/recordTypeId/`
    },
    system: {
        user: {
            list:`${baseUrl}/user/page`
        }
    }
}
export default api
