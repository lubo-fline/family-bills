<!--
 * @Author: your name
 * @Date: 2022-03-11 20:08:56
 * @LastEditTime: 2022-05-06 14:54:53
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \family-bills\src\views\bills\Index.vue
-->
<template>
    <a-card :bordered="false" size="small" title="账单">
        <a-form
            :model="formState"
            name="horizontal_login"
            layout="inline"
            autocomplete="off"
            @finish="onFinish"
            ref="searchFormRef"
        >
            <a-form-item label="月份" name="dateStr">
                <a-date-picker v-model:value="formState.dateStr" @change="dateChange" :format="'YYYY-MM'" picker="month" />
            </a-form-item>
            <a-form-item label="类型" name="recordTypeCode">
                <a-select v-model:value="formState.recordTypeCode" class="width120" :options="recordTypeCodeData"></a-select>
            </a-form-item>
            <a-form-item label="用户" name="userId">
                <a-select v-model:value="formState.userId" class="width120" :options="dataSource.userData"></a-select>
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
        <a-row :gutter="16">
            <a-col :span="3" :offset="18">
                <a-statistic title="收入" :precision="2" :value="dataSource.totalStatics.inCome" suffix='元'/>
            </a-col>
            <a-col :span="3">
                <a-statistic title="支出" :precision="2" :value="dataSource.totalStatics.outCome" suffix='元'/>
            </a-col>
        </a-row>
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
                <template v-else-if="column.dataIndex === 'spendCategoryName'">
                    <a-tag color="green">
                        {{text}}
                    </a-tag>
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
    <addModal :visible="visible" :editData="dataSource.editData" :recordTypeCode="formState.recordTypeCode" @handleCancel="handleCancel"></addModal>
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
        arr: [],
        editData:{},
        userData:[],
        totalStatics:{
            inCome:0,
            outCome:0
        }
    });
    const columns=[
        {
            title: '序号',
            dataIndex: 'id',
            key:'id'
        },
        {
            title: '金额',
            dataIndex: 'amount',
            key:'amount'
        },
        {
            title: '备注',
            dataIndex: 'remark',
        },
        {
            title: '消费类别',
            dataIndex: 'spendCategoryName',
        },
        {
            title: '支付方式',
            dataIndex: 'payTypeName',
        },
        {
            title: '消费日期',
            dataIndex: 'occurTime',
        },
        {
            title: '所属人员',
            dataIndex: 'userName',
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
        recordTypeCode: string,
        userId:number
    }
    const month=(new Date().getMonth()+1)>9?(new Date().getMonth()+1):('0'+(new Date().getMonth()+1))
    let formState = reactive<FormState>({
        dateStr: dayjs(new Date().getFullYear()+'-'+month,'YYYY-MM'),
        date:new Date().getFullYear()+'-'+month,
        recordTypeCode: 'expendType',
        userId:null
    });
    const searchFormRef = ref<FormInstance>();
    const initFormState=JSON.parse(JSON.stringify(formState))
    const recordTypeCodeData=[
        {label:'支出',value:'expendType'},
        {label:'收入',value:'incomeType'},
        {label:'预支出',value:'advanceType'}
    ]
    const onFinish = (values?: any) => {
        current.value=1
        getTotalStaticsData()
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
        getUserData()
        getTotalStaticsData()
    })
    const getTableData=()=>{
        let params={...formState,pageSize:pageSize.value,pageNo:current.value}
        loading.value=true
        delete params.dateStr
        proxy.$post(proxy.$api.bills.list,params).then((res:any)=>{
            loading.value=false
            if(res.retCode===0){
                dataSource.arr=res.data?.list || []
                total.value=res.data?.total||0
            }
        })
    }

    const getUserData=()=>{
        let params={pageSize:100,pageNo:1}
        proxy.$post(proxy.$api.system.user.list,params).then((res:any)=>{
            loading.value=false
            if(res.retCode===0){
                let datas=res.data?.list || []
                datas.forEach(item=>{
                    item['label']=item.nickname
                    item['value']=item.id
                })
                dataSource.userData=[{label:'全部',value:null},...datas]
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
    const editId=ref(0)
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
                proxy.$del(proxy.$api.bills.delete+id).then((res:any)=>{
                    if(res.retCode===0){
                        proxy.$message.success('删除成功！');
                        getTableData()
                    }
                })
            },
            onCancel() {},
        });
    }

    const getTotalStaticsData=()=>{
        let {userId,date}=formState
        proxy.$get(proxy.$api.bills.getStatics+date,{userId}).then((res:any)=>{
            if(res.retCode===0){
                console.log(res.data)
                dataSource.totalStatics.inCome=res.data[1]||0
                dataSource.totalStatics.outCome=res.data[0]||0
            }
        })
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
    .fl_staticsBox{
        float:right;
        width: 300px;
    }
</style>