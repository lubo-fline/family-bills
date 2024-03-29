/*
 * @Author: your name
 * @Date: 2022-03-09 20:57:05
 * @LastEditTime: 2022-04-15 16:57:40
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \family-bills\src\router\index.ts
 */
import { createRouter, createWebHistory } from "vue-router";
// 导出路由
const router = createRouter({
	history: createWebHistory(),
	routes:[
		{
			path: '/',
			redirect:'home'
		},
		{
			path: "/index",
			name: "index",
			component: () => import('@/views/Index.vue'),
			children: [
				{
					path: "/bills",
					name: "bills",
					component: ()=>import('@/views/bills/Index.vue'),
				},
				{
					path: "/home",
					name: "home",
					component: ()=>import('@/views/home/Index.vue'),
				},
				{
					path: "/userManage",
					name: "userManage",
					component: ()=>import('@/views/system/userManage/Index.vue'),
				},
				{
					path: "/roleManage",
					name: "roleManage",
					component: ()=>import('@/views/system/roleManage/Index.vue'),
				},
				{
					path: "/menuManage",
					name: "menuManage",
					component: ()=>import('@/views/system/menuManage/Index.vue'),
				},
				{
					path: "/payTypeManage",
					name: "payTypeManage",
					component: ()=>import('@/views/system/payTypeManage/Index.vue'),
				},
				{
					path: "/spendCategoryManage",
					name: "spendCategoryManage",
					component: ()=>import('@/views/system/spendCategoryManage/Index.vue'),
				},
			]
		},
		{
			path: "/login",
			name: "login",
			component: ()=>import('@/views/Login.vue'),
		},
	]
});

export default router;
