<!--
 * @Author: your name
 * @Date: 2022-04-15 14:37:33
 * @LastEditTime: 2022-04-15 15:08:17
 * @LastEditors: Please set LastEditors
 * @Description: 支付方式新增
 * @FilePath: \family-bills\src\views\system\payTypeManage\Add.vue
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
                    label="支付方式" name="name"
                    :rules="rules.name"
                >
                    <a-input v-model:value="formState.name" placeholder="请输入支付方式"/>
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
        editData:Object
    })
    const emit=defineEmits(['handleCancel'])
    watch(prop, () => {
        if(prop.visible=='add'){
            formState.name=''
            formState.id=0
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
    }
    const formState = reactive<FormState>({
        name: '',
        id:0,
    });
    const rules={
        name:[{ required: true, message: '请输入支付方式!' }],
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
        proxy.$post(proxy.$api.system.payType.save,values)
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