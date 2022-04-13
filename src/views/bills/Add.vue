<!--
 * @Author: your name
 * @Date: 2022-03-12 21:38:00
 * @LastEditTime: 2022-04-13 17:09:10
 * @LastEditors: Please set LastEditors
 * @Description: 新增修改表单
 * @FilePath: \family-bills\src\views\bills\Add.vue
-->
<template>
    <div>
        <a-modal 
            :visible="visible!=''" 
            :title="visible=='add'?'新增':'修改'" 
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <a-form
                :model="formState"
                name="basic"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 16 }"
                autocomplete="off"
                @finish="handleOk"
            >
                <a-form-item
                    label="金额"
                    :rules="rules.amount"
                >
                    <a-input-number v-model:value="formState.amount" class="widthP100" placeholder="请输入金额"/>
                </a-form-item>

                <a-form-item
                    label="消费日期"
                    :rules="rules.occurTime"
                >
                    <a-date-picker 
                        v-model:value="formState.occurTimeStr" 
                        class="widthP100"
                        @change="dateChange" 
                        :format="'YYYY-MM-DD'"
                        placeholder="请选择消费日期"
                    />
                </a-form-item>
                <a-form-item
                    label="记账类型"
                    :rules="rules.recordTypeCode"
                >
                    <a-select 
                        v-model:value="formState.recordTypeCode" 
                        class="widthP00" 
                        :options="recordTypeData"
                        @change="getSpendCategoryData"
                        placeholder="请选择记账类型"
                    ></a-select>
                </a-form-item>
                <a-form-item
                    label="消费类别"
                    :rules="rules.spendCategoryId"
                >
                    <a-select 
                        v-model:value="formState.spendCategoryId" 
                        class="widthP100" 
                        :options="spendCategoryData"
                        placeholder="请选择消费类别"
                    ></a-select>
                </a-form-item>
                <a-form-item
                    label="备注"
                >
                    <a-textarea
                        v-model:value="formState.remark"
                        placeholder="请输入备注"
                        :auto-size="{ minRows: 2, maxRows: 5 }"
                    />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang='ts'>
    import { onMounted,defineProps,defineEmits,reactive,watch ,ref} from 'vue';
    import useCurrentInstance from '@/hooks/useCurrentInstance'
    const { proxy } = useCurrentInstance()
    import dayjs,{Dayjs} from 'dayjs';


    const prop=defineProps({
        visible:String,
        editId:Number
    })
    const emit=defineEmits(['handleCancel'])
    
    interface FormState {
        amount: number|string
        occurTime: string
        remark: string
        occurTimeStr:Dayjs
        recordTypeCode:number|string
        spendCategoryId: number|string
    }
    const month=(new Date().getMonth()+1)>9?(new Date().getMonth()+1):('0'+(new Date().getMonth()+1))
    const date=new Date().getDate()>9?new Date().getDate():('0'+new Date().getDate())
    const formState = reactive<FormState>({
        amount: '',
        occurTime: new Date().getFullYear()+'-'+month+'-'+date,
        occurTimeStr:dayjs(new Date().getFullYear()+'-'+month+'-'+date,'YYYY-MM-DD'),
        remark:'',
        spendCategoryId:'',
        recordTypeCode:''
    });
    const rules={
        amount:[{ required: true, message: '请输入金额!' }],
        occurTime:[{ required: true, message: '请输入消费日期！' }],
        spendCategoryId:[{ required: true, message: '请选择记账类型！' }],
        recordTypeCode:[{ required: true, message: '请选择消费类别！' }],
    }
    const dateChange=(date:Dayjs,dateStr:string)=>{
        formState.occurTime=dateStr
    }
    const handleOk=()=>{
        let values=JSON.parse(JSON.stringify(formState))
        delete values.occurTimeStr
        delete values.recordTypeCode
        proxy.$post(proxy.$api.bills.add,values)
        .then((res:any) => {
            if(res.retCode===0){
                handleCancel(true)
            }
        })
    }

    const recordTypeData=ref([])
    const spendCategoryData=ref([])
    onMounted(()=>{
        getRecordTypeData()
    })
    const getRecordTypeData=()=>{
        proxy.$get(proxy.$api.bills.recordTypeData).then((res:any)=>{
            if(res.retCode===0){
                const datas=res.data||[]
                datas.forEach((item:any)=>{
                    item['value']=item.id
                    item['label']=item.name
                })
                recordTypeData.value=datas
            }
        })
    }
    const getSpendCategoryData=(id:number)=>{
        formState.spendCategoryId=''
        proxy.$get(proxy.$api.bills.spendCategory+id).then((res:any)=>{
            if(res.retCode===0){
                const datas=res.data||[]
                datas.forEach((item:any)=>{
                    item['value']=item.id
                    item['label']=item.name
                })
                spendCategoryData.value=datas
            }
        })
    }
    const handleCancel=(flag:Boolean=false)=>{
        emit("handleCancel",flag)
    }
</script>
<style lang='less' scoped>

</style>