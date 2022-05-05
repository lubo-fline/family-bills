<!--
 * @Author: your name
 * @Date: 2022-04-13 15:15:16
 * @LastEditTime: 2022-05-05 14:03:16
 * @LastEditors: Please set LastEditors
 * @Description: 用户管理
 * @FilePath: \family-bills\src\views\system\user\Index.vue
-->
<template>
    <a-card :bordered="false" size="small" title="用户管理">
        <a-form
            :model="formState"
            name="horizontal_login"
            layout="inline"
            autocomplete="off"
            @finish="onFinish"
            ref="searchFormRef"
        >
            <a-form-item label="用户名" name="username">
                <a-input v-model:value="formState.username" class="width120"></a-input>
            </a-form-item>
            <a-form-item label="创建日期" name="dateStr">
                <a-date-picker v-model:value="formState.dateStr" @change="dateChange" :format="'YYYY-MM-DD'"/>
            </a-form-item>
            <a-form-item label="状态" name="deleted">
                <a-select v-model:value="formState.deleted" class="width120" :options="deletedData"></a-select>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit">搜索</a-button>
            </a-form-item>
            <a-form-item>
                <a-button type="default" @click="reset">重置</a-button>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="add">新增</a-button>
            </a-form-item>
        </a-form>
        <a-table 
            class="marginT16" 
            :data-source="dataSource.arr" :columns="columns" 
            :pagination="false" :row-key="(record) => record.id"
            :loading="loading"
        >
            <template #bodyCell="{ column, record ,text,index}">
                <template v-if="column.dataIndex === 'id'">
                    {{(current-1)*pageSize+index+1}}
                </template>
                <template v-else-if="column.dataIndex === 'deleteTime'">
                    <a-badge :color="text?'gray':'green'"></a-badge>{{text?'停用':"已启用"}}
                </template>
                <template v-else-if="column.dataIndex === 'action'">
                    <a-space>
                        <template v-if="!record.deleteTime">
                            <a href="javascript:;" @click="editItem(record.id)">修改</a>
                            <a href="javascript:;" @click="deleteItem(record.id)">删除</a>
                        </template>
                        <a href="javascript:;" v-else @click="resetItem(record.id)">启用</a>
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
    <addModal :visible="visible" :editId="editId" @handleCancel="handleCancel"></addModal>
</template>

<script setup lang='ts'>
    import { onMounted,reactive,watch ,ref} from 'vue';
    import useCurrentInstance from '@/hooks/useCurrentInstance'
    const { proxy } = useCurrentInstance()
    import dayjs,{Dayjs} from 'dayjs';
    import { Modal } from 'ant-design-vue';
    import 'ant-design-vue/es/modal/style/css';
    import addModal from './Add.vue'
    import type { FormInstance } from 'ant-design-vue';

    let dataSource=reactive({
        arr: []
    });
    const columns=[
        {
            title: '序号',
            dataIndex: 'id',
            key:'id'
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key:'username'
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
        },
        {
            title: '性别',
            dataIndex: 'sex',
            customRender:({text, record, index, column})=>{
                return {1:'男',2:'女'}[text]
            }
        },
        {
            title: '邮箱',
            dataIndex: 'email',
        },
        {
            title: '状态',
            dataIndex: 'deleteTime',
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
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

    //搜索表单
    interface FormState {
        dateStr: Dayjs
        date:string
        deleted: Boolean,
        username:string
    }
    let formState = reactive<FormState>({
        dateStr: null,
        date:'',
        deleted: null,
        username:''
    });
    const searchFormRef = ref<FormInstance>();
    const initFormState=JSON.parse(JSON.stringify(formState))
    
    const deletedData=[
        {label:'全部',value:null},
        {label:'正常',value:false},
        {label:'停用',value:true}
    ]
    const onFinish = (values?: any) => {
        getTableData()
    };
    const reset=()=>{
        searchFormRef.value.resetFields();
        formState=initFormState
        onFinish()
    }
    const dateChange=(date:Dayjs,dateStr:string)=>{
        formState.date=dateStr
    }
    
    //获取表格数据
    const visible=ref<string>('')
    onMounted(()=>{
        getTableData()
    })
    const getTableData=()=>{
        let params={...formState,pageSize:pageSize.value,pageNo:current.value}
        loading.value=true
        delete params.dateStr
        proxy.$post(proxy.$api.system.user.list,params).then((res:any)=>{
            loading.value=false
            if(res.retCode===0){
                dataSource.arr=res.data?.list || []
                total.value=res.data?.total||0
            }
        })
    }


    //新增\修改
    const add=()=>{
        visible.value='add'
        editId.value=0
    }
    const handleCancel=(flag:boolean)=>{
        visible.value=''
        if(flag){
            getTableData()
        }
    }
    const editId=ref(0)
    const editItem=(id:number)=>{
        visible.value='edit'
        editId.value=id
    }
    //删除
    const deleteItem=(id:number)=>{
        Modal.confirm({
            title: '提示',
            content: '是否要删除该数据？',
            onOk() {
                proxy.$del(proxy.$api.system.user.delete+id).then((res:any)=>{
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
                proxy.$put(proxy.$api.system.user.reset+id).then((res:any)=>{
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
    .fl_pagination{
        margin-top: 16px;
        text-align: right;
    }
    .pull-right{
        float: right !important;
    }
</style>