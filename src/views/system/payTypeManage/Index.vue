<!--
 * @Author: your name
 * @Date: 2022-04-15 14:36:56
 * @LastEditTime: 2022-04-15 15:12:19
 * @LastEditors: Please set LastEditors
 * @Description: 支付方式管理页面
 * @FilePath: \family-bills\src\views\system\payTypeManage\Index.vue
-->
<template>
    <a-card :bordered="false" size="small" title="支付方式管理">
        <a-button type="primary" @click="add">新增</a-button>
        <a-table 
            class="marginT16" 
            :data-source="dataSource.arr" :columns="columns" 
            :pagination="false" :row-key="(record) => record.id"
            :loading="loading"
        >
            <template #bodyCell="{ column, record ,index}">
                <template v-if="column.dataIndex === 'id'">
                    {{(current-1)*pageSize+index+1}}
                </template>
                <template v-else-if="column.dataIndex === 'action'">
                    <a-space>
                        <a href="javascript:;" @click="editItem(record)">修改</a>
                        <a href="javascript:;" @click="deleteItem(record.id)">删除</a>
                    </a-space>
                </template>
            </template>
        </a-table>
        <div class="fl_pagination">
            <a-pagination
                v-model:current="current"
                v-model:pageSize="pageSize"
                show-size-changer
                :total="total"
                @showSizeChange="onShowSizeChange"
            />
        </div>
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
            title: '序号',
            dataIndex: 'id',
            key:'id'
        },
        {
            title: '支付方式',
            dataIndex: 'name',
        },
        {
            title: '操作',
            dataIndex: 'action',
        },
    ]
    const loading=ref(false)


    //页码处理
    const current=ref(1)
    const pageSize=ref(10)
    const total=ref(0)
    const onShowSizeChange = (current: number, pageSize: number) => {
        current=current
        pageSize=pageSize
    };
    watch(pageSize, () => {
        getTableData()
    });
    watch(current, () => {
        getTableData()
    });


    //获取表格数据
    const visible=ref<string>('')
    onMounted(()=>{
        getTableData()
    })
    const getTableData=()=>{
        let params={pageSize:pageSize.value,pageIndex:current.value}
        loading.value=true
        proxy.$get(proxy.$api.system.payType.list,params).then((res:any)=>{
            loading.value=false
            if(res.retCode===0){
                dataSource.arr=res.data.list || []
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
                proxy.$del(proxy.$api.system.payType.delete+id).then((res:any)=>{
                    if(res.retCode===0){
                        proxy.$message.success('删除成功！');
                        getTableData()
                    }
                })
            },
            onCancel() {},
        });
    }
</script>
<style lang='less' scoped>
.fl_pagination{
    margin-top: 16px;
    text-align: right;
}
</style>