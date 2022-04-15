<!--
 * @Author: your name
 * @Date: 2022-04-15 16:55:17
 * @LastEditTime: 2022-04-15 17:19:31
 * @LastEditors: Please set LastEditors
 * @Description: 消费类别新增
 * @FilePath: \family-bills\src\views\system\spendCategoryManage\Add.vue
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
                ref="formRef"
                :model="formState"
                name="basic"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 16 }"
                autocomplete="off"
            >
                <a-form-item
                    label="所属类别" name="recordTypeId"
                    :rules="rules.recordTypeId"
                >
                    <a-select 
                        v-model:value="formState.recordTypeId" 
                        class="widthP100" 
                        :options="recordTypeData"
                        placeholder="请选择所属类别"
                    ></a-select>
                </a-form-item>
                <a-form-item
                    label="消费类别名称" name="name"
                    :rules="rules.name"
                >
                    <a-input v-model:value="formState.name" placeholder="请输入消费类别名称"/>
                </a-form-item>
                <a-form-item
                    label="备注" name="remark"
                >
                    <a-textarea v-model:value="formState.remark" placeholder="请输入备注"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang='ts'>
    import { defineProps,defineEmits,reactive,watch ,ref} from 'vue';
    import useCurrentInstance from '@/hooks/useCurrentInstance'
    import type { FormInstance } from 'ant-design-vue';
    const { proxy } = useCurrentInstance()


    const prop=defineProps({
        visible:String,
        editData:Object,
        recordTypeData:Array
    })
    const emit=defineEmits(['handleCancel'])
    watch(prop, () => {
        if(prop.visible=='add'){
            formState.name=''
            formState.id=0
            formState.recordTypeId=1
            formState.remark=''
        }else{
            for(let item in formState){
                formState[item]=prop.editData[item]
            }
        }
    });


    const formRef = ref<FormInstance>();
    interface FormState {
        name: string
        id: number,
        recordTypeId:number,
        remark?:string
    }
    const formState = reactive<FormState>({
        name: '',
        id:0,
        recordTypeId:1,
        remark:""
    });
    const rules={
        name:[{ required: true, message: '请输入消费类别名称!' }],
        recordTypeId:[{ required: true, message: '请输入所属类别!' }],
    }
    const handleOk=()=>{
        formRef.value
        .validate()
        .then(val => {
            addUser()
        })
        .catch(info => {
            console.log('校验失败:', info);
        });
    }
    const addUser=()=>{
        let values=JSON.parse(JSON.stringify(formState))
        if(prop.visible=='add'){
            delete values.id
        }
        proxy.$post(proxy.$api.system.spendCategory.save,values)
            .then((res:any) => {
                if(res.retCode===0){
                    proxy.$message.success('操作成功！');
                    handleCancel(true)
                }
            })
    }
    const handleCancel=(flag:Boolean=false)=>{
        emit("handleCancel",flag)
    }
</script>
<style lang='less' scoped>

</style>