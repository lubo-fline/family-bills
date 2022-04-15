<!--
 * @Author: your name
 * @Date: 2022-04-13 15:35:04
 * @LastEditTime: 2022-04-15 14:17:41
 * @LastEditors: Please set LastEditors
 * @Description: 菜单管理列表
 * @FilePath: \family-bills\src\views\system\menu\Index.vue
-->
<template>
    <a-card :bordered="false" size="small" title="菜单管理">
        <a-button type="primary" @click="add">新增</a-button>
        <a-table 
            class="marginT16" 
            :data-source="dataSource.arr" :columns="columns" 
            :pagination="false" :row-key="(record) => record.id"
            :loading="loading"
            :scroll="{ x: 1500 }"
        >
            <template #bodyCell="{ column, record ,text}">
                <template v-if="column.dataIndex === 'deleteTime'">
                    <a-badge :color="text?'gray':'green'"></a-badge>{{text?'停用':"已启用"}}
                </template>
                <template v-else-if="column.dataIndex === 'menuType'">
                    <a-tag>{{menuTypeMap[text]}}</a-tag>
                </template>
                <template v-else-if="column.dataIndex === 'isOuterChain'">
                    <a-tag color="orange">{{text?'是':'否'}}</a-tag>
                </template>
                <template v-else-if="column.dataIndex === 'action'">
                    <a-space>
                        <template v-if="!record.deleteTime">
                            <a href="javascript:;" @click="editItem(record)">修改</a>
                            <a href="javascript:;" @click="deleteItem(record.id)">删除</a>
                        </template>
                        <a href="javascript:;" v-else @click="resetItem(record.id)">启用</a>
                    </a-space>
                </template>
            </template>
        </a-table>
    </a-card>
    <addModal :visible="visible" :editData="dataSource.editData" :treeData="dataSource.arr" @handleCancel="handleCancel"></addModal>
</template>

<script setup lang='ts'>
    import { onMounted,reactive,watch ,ref} from 'vue';
    import useCurrentInstance from '@/hooks/useCurrentInstance'
    const { proxy } = useCurrentInstance()
    import { Modal } from 'ant-design-vue';
    import 'ant-design-vue/es/modal/style/css';
    import addModal from './Add.vue'

    let dataSource=reactive({
        arr: [],
        editData:{}
    });
    const columns=[
        {
            title: '菜单标题',
            dataIndex: 'menuTitle',
            key:'menuTitle',
            width:300,
            fixed: 'left' 
        },
        {
            title: '菜单名称',
            dataIndex: 'menuName',
            width:300,
            fixed: 'left' 
        },
        {
            title: '类型',
            dataIndex: 'menuType',
            width:100,
        },
        {
            title: '是否外链',
            dataIndex: 'isOuterChain',
            width:120,
        },
        {
            title: '路径',
            dataIndex: 'path',
            width:200,
        },
        {
            title: '组件',
            dataIndex: 'component',
            width:120,
        },
        {
            title: '图标',
            dataIndex: 'iconName',
            width:120,
        },
        {
            title: '组件标识',
            dataIndex: 'permissionSign',
            width:200,
        },
        {
            title: '排序',
            dataIndex: 'orderNo',
            width:80,
        },
        {
            title: '状态',
            dataIndex: 'deleteTime',
            width:100,
            fixed: 'right' 
        },
        {
            title: '操作',
            dataIndex: 'action',
            width:120,
            fixed: 'right' 
        },
    ]
    const loading=ref(false)
    const menuTypeMap = {
        'M':  '目录',
        'C': '菜单',
        'F': '按钮'
    }
    //获取表格数据
    const visible=ref<string>('')
    onMounted(()=>{
        getTableData()
    })
    const getTableData=()=>{
        loading.value=true
        proxy.$get(proxy.$api.system.menu.list).then((res:any)=>{
            loading.value=false
            if(res.retCode===0){
                dataSource.arr=res.data || []
            }
        })
    }


    //新增\修改
    const add=()=>{
        visible.value='add'
        dataSource.editData={}
    }
    const handleCancel=(flag:boolean)=>{
        visible.value=''
        if(flag){
            getTableData()
        }
    }
    const editItem=(datas:object)=>{
        visible.value='edit'
        dataSource.editData=datas
    }
    //删除
    const deleteItem=(id:number)=>{
        Modal.confirm({
            title: '提示',
            content: '是否要删除该数据？',
            onOk() {
                proxy.$del(proxy.$api.system.menu.delete+id).then((res:any)=>{
                    if(res.retCode===0){
                        proxy.$message.success('删除成功！');
                        getTableData()
                    }
                })
            },
            onCancel() {},
        });
    }
    const resetItem=(id:number)=>{
        Modal.confirm({
            title: '提示',
            content: '是否要启用该数据？',
            onOk() {
                proxy.$put(proxy.$api.system.menu.reset+id).then((res:any)=>{
                    if(res.retCode===0){
                        proxy.$message.success('启用成功！');
                        getTableData()
                    }
                })
            },
            onCancel() {},
        });
    }
</script>
<style lang='less' scoped>
</style>