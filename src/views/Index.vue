<!--
 * @Author: your name
 * @Date: 2022-03-09 21:33:58
 * @LastEditTime: 2022-05-05 14:50:26
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \family-bills\src\views\Index.vue
-->
<template>
    <div>
        <a-layout>
            <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
                <img src="@/assets/image/logo.png" height="60" class='pull-left'/>
                <a-dropdown class="fl_userName">
                    <a class="ant-dropdown-link" @click.prevent>
                        欢迎您，{{userData.nickname}}
                        <DownOutlined />
                    </a>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item>
                                <a href="javascript:;">个人设置</a>
                            </a-menu-item>
                            <a-menu-item>
                                <a href="javascript:;" @click="logout">退出</a>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
                <a-menu
                    :selectedKeys="configData.selectedKeys"
                    theme="dark"
                    mode="horizontal"
                    :style="{ lineHeight: '64px' }"
                >   
                    <template v-for="item in menuData" :key="item.path"> 
                        <a-sub-menu :title="item.name" v-if="item.children&&item.children.length>0">
                            <a-menu-item v-for="ele in item.children" :key="ele.path" @click="goto(ele.path)">
                                {{ele.name}}
                            </a-menu-item>
                        </a-sub-menu>
                        <a-menu-item v-else @click="goto(item.path)">
                            {{item.name}}
                        </a-menu-item>
                    </template>
                </a-menu>
            </a-layout-header>
            <a-layout-content class="fx_containter">
                <router-view></router-view>
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script setup lang="ts">
    import useCurrentInstance from '../hooks/useCurrentInstance'
    import { useRouter } from 'vue-router'
    import { DownOutlined ,createFromIconfontCN} from '@ant-design/icons-vue';
    import { reactive } from '@vue/reactivity';
    const { proxy } = useCurrentInstance()
    const router = useRouter()

    const IconFont = createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
    });
    const routerName=router.currentRoute.value.name
    let configData= reactive({
        selectedKeys:[routerName]
    })

    const userDataJson=localStorage.getItem('userData')||''
    if(!userDataJson){
        router.push('login')
    }
    const userData=userDataJson?JSON.parse(userDataJson):{}
    const menuData=[
        {
            name:'首页',
            path:'home',
        },
        {
            name:'账单',
            path:'bills',
        },
        {
            name:'系统管理',
            path:'',
            children:[
                {
                    name:'用户管理',
                    path:'userManage',
                },
                {
                    name:'角色管理',
                    path:'roleManage',
                },
                {
                    name:'菜单管理',
                    path:'menuManage',
                },
                {
                    name:'支付方式管理',
                    path:'payTypeManage',
                },
                {
                    name:'消费类别管理',
                    path:'spendCategoryManage',
                },
            ]
        },
    ]
    const goto=(path:string)=>{
        router.push(path)
        configData.selectedKeys=[path]
    }
    const logout=()=>{
        router.push('login')
        localStorage.removeItem('userData')
    }
</script>
<style lang='less' scoped>
.pull-left{
    float: left;
}
.fl_userName{
    float: right;
    font-size: #fff;
}
.fx_containter{
    padding: 24px;
    margin-top: 64px;
    min-height: calc(100vh - 64px);
}
</style>
