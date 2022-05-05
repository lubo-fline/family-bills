<!--
 * @Author: your name
 * @Date: 2022-03-31 16:58:33
 * @LastEditTime: 2022-04-15 17:58:41
 * @LastEditors: Please set LastEditors
 * @Description: 首页
 * @FilePath: \family-bills\src\views\home\Index.vue
-->
<template>
    <div>
        <a-row :gutter="[16,16]">
            <a-col :span="24">
                <a-card title="首页" size="small" :bordered="false">
                    <a-form
                        :model="formState"
                        name="horizontal_login"
                        layout="inline"
                        autocomplete="off"
                        @finish="onFinish"
                        ref="searchFormRef"
                    >
                        <a-form-item label="用户" name="userId">
                            <a-select v-model:value="formState.userId" class="width120" :options="dataSource.userData"></a-select>
                        </a-form-item>
                        <a-form-item label="时间段" name="recordTypeCode">
                            <a-select v-model:value="formState.recordTypeCode" class="width120" :options="recordTypeCodeData"></a-select>
                        </a-form-item>
                        <a-form-item label="时间范围" name="dateStr">
                            <a-range-picker v-model:value="formState.dateRangeStr" @change="dateChange"/>
                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" html-type="submit">搜索</a-button>
                        </a-form-item>
                        <a-form-item>
                            <a-button type="default" @click="reset">重置</a-button>
                        </a-form-item>
                    </a-form>
                </a-card>
            </a-col>
            <a-col :span="6" v-for="item in staticsTotalConfigData" :key="item.code">
                <a-card :bordered="false">
                    <div>{{item.name}}</div>
                    <div><span>{{staticsTotalData[item.code]||0}}</span>元</div>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang='ts'>
    import { onMounted,reactive,watch ,ref} from 'vue';
    import useCurrentInstance from '@/hooks/useCurrentInstance'
    const { proxy } = useCurrentInstance()
    import dayjs,{Dayjs} from 'dayjs';
    type RangeValue = [Dayjs, Dayjs];
    import type { FormInstance } from 'ant-design-vue';


    const loading=ref(false)
    let dataSource=reactive({
        userData:[]
    });
    //搜索表单
    const searchFormRef = ref<FormInstance>();
    interface FormState {
        dateRangeStr: RangeValue
        dateRange:string[]
        recordTypeCode: string,
        userId:number
    }
    const formState = reactive<FormState>({
        dateRangeStr: [null,null],
        dateRange:[],
        recordTypeCode: 'nearYear',
        userId:0
    });

    const onFinish = (values: any) => {
    };
    const reset=()=>{
        searchFormRef.value.resetFields();
    }
    const dateChange=(date:Dayjs,dateStr:string)=>{
        formState.dateRange=[dateStr[0],dateStr[1]]
    }

    onMounted(()=>{
        getUserData()
    })

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
                dataSource.userData=[{label:'全部',value:0},...datas]
            }
        })
    }

    const recordTypeCodeData=[
        {label:"近一年",value:"nearYear"},
        {label:"近一月",value:"nearMonth"},
        {label:"近一周",value:"nearWeek"},
        {label:"本年",value:"thisYear"},
        {label:"本月",value:"thisMonth"},
        {label:"本周",value:"thisWeek"},
    ]
    const staticsTotalConfigData=[
        {name:"总收入",code:'shouru'},
        {name:"总支出",code:'zhichu'},
        {name:"总存款",code:'cunkuan'},
        {name:"待归还",code:'return'},
    ]
    const staticsTotalData={
        shouru:1000,
        zhichu:100,
        cunkuan:999,
        return:1
    }
</script>
<style lang='less' scoped>
</style>