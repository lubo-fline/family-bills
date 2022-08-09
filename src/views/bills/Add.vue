<!--
 * @Author: your name
 * @Date: 2022-03-12 21:38:00
 * @LastEditTime: 2022-08-09 17:10:20
 * @LastEditors: lubo lubo@fline88.com
 * @Description: 新增修改表单
 * @FilePath: \family-bills\src\views\bills\Add.vue
-->
<template>
    <div>
        <a-modal 
            :visible="visible!=''" 
            :title="visible=='add'?'新增':'修改'" 
            @ok="handleOk"
            destroyOnClose
            @cancel="handleCancel"
        >
            <a-form
                :model="formState"
                name="basic"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 16 }"
                autocomplete="off"
                @finish="handleOk"
                ref="formRef"
            >
                <a-form-item
                    label="金额" name="amount"
                    :rules="rules.amount"
                >
                    <a-input-number v-model:value="formState.amount" class="widthP100" placeholder="请输入金额"/>
                </a-form-item>

                <a-form-item
                    label="消费日期" name="occurTime"
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
                    label="记账类型" name="recordTypeCode"
                    :rules="rules.recordTypeCode"
                >
                    <a-select 
                        v-model:value="formState.recordTypeCode" 
                        class="widthP100" 
                        :options="prop.recordTypeData"
                        @change="(val,datas)=>getSpendCategoryData(datas,'change')"
                        placeholder="请选择记账类型"
                    ></a-select>
                </a-form-item>
                <a-form-item
                    :label="formState.recordTypeCode=='incomeType'?'存储方式':'支付方式'" name="payTypeId"
                    :rules="rules.payTypeId"
                >
                    <a-select 
                        v-model:value="formState.payTypeId" 
                        class="widthP100" 
                        :options="prop.payTypeData"
                        :placeholder="formState.recordTypeCode=='incomeType'?'请选择存储方式':'请选择支付方式'"
                    ></a-select>
                </a-form-item>
                <a-form-item
                    label="消费类别" name="spendCategoryId"
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
                    label="备注" name="remark"
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
import { array } from 'vue-types';
    const { proxy } = useCurrentInstance()
    import type { FormInstance } from 'ant-design-vue';
    import dayjs,{Dayjs} from 'dayjs';


    const prop=defineProps({
        visible:String,
        editData:Object,
        recordTypeCode: String,
        payTypeData: Array,
        recordTypeData:Array
    })
    const emit=defineEmits(['handleCancel'])
    watch(prop, () => {
        if(prop.visible=='add'){
            for(let item in formState){
                formState[item]=''
            }
            formState.recordTypeCode=prop.recordTypeCode
        }else{
            for(let item in formState){
                formState[item]=prop.editData[item]
            }
            formState.occurTimeStr=dayjs(formState.occurTime,'YYYY-MM-DD')
        }
        getSpendCategoryData(prop.recordTypeData.find((item:any)=>item.code==formState.recordTypeCode),'edit')
    });
    interface FormState {
        amount: number|string
        occurTime: string
        remark: string
        occurTimeStr:Dayjs
        recordTypeCode:string
        spendCategoryId: number|string,
        payTypeId: number|string,
    }
    const month=(new Date().getMonth()+1)>9?(new Date().getMonth()+1):('0'+(new Date().getMonth()+1))
    const date=new Date().getDate()>9?new Date().getDate():('0'+new Date().getDate())
    const formRef = ref<FormInstance>();
    const formState = reactive<FormState>({
        amount: '',
        occurTime: new Date().getFullYear()+'-'+month+'-'+date,
        occurTimeStr:dayjs(new Date().getFullYear()+'-'+month+'-'+date,'YYYY-MM-DD'),
        remark:'',
        spendCategoryId:'',
        recordTypeCode:'',
        payTypeId:'',
    });
    const rules={
        amount:[{ required: true, message: '请输入金额!' }],
        occurTime:[{ required: true, message: '请输入消费日期！' }],
        spendCategoryId:[{ required: true, message: '请选择记账类型！' }],
        recordTypeCode:[{ required: true, message: '请选择消费类别！' }],
        payTypeId:[{ required: true, message: '请选择消费类别！' }],
    }
    const dateChange=(date:Dayjs,dateStr:string)=>{
        formState.occurTime=dateStr
    }
    const handleOk=()=>{
        formRef.value
        .validate()
        .then(val => {
            if(prop.visible=='add'){
                addBills()
            }else{
                editBills()
            }
        })
        .catch(info => {
            console.log('校验失败:', info);
        });
    }
    const addBills=()=>{
        let values=JSON.parse(JSON.stringify(formState))
        delete values.occurTimeStr
        delete values.recordTypeCode
        proxy.$post(proxy.$api.bills.add,values)
            .then((res:any) => {
                if(res.retCode===0){
                    proxy.$message.success('新增成功！');
                    handleCancel(true)
                }
            })
    }
    const editBills=()=>{
        let values=JSON.parse(JSON.stringify(formState))
        delete values.occurTimeStr
        delete values.recordTypeCode
        proxy.$put(proxy.$api.bills.edit+prop.editData.id,values)
            .then((res:any) => {
                if(res.retCode===0){
                    proxy.$message.success('修改成功！');
                    handleCancel(true)
                }
            })
    }

    const spendCategoryData=ref([])
    const getSpendCategoryData=(datas,type:string)=>{
        if(!datas||!datas.id){
            return false
        }
        if(type=='change'){
            formState.spendCategoryId=''
        }
        proxy.$get(proxy.$api.bills.spendCategory+datas.id).then((res:any)=>{
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