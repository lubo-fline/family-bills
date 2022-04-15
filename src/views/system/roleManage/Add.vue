<!--
 * @Author: your name
 * @Date: 2022-04-13 15:35:00
 * @LastEditTime: 2022-04-14 16:03:37
 * @LastEditors: Please set LastEditors
 * @Description: 角色管理新增
 * @FilePath: \family-bills\src\views\system\role\Add.vue
-->
<template>
    <div>
        <a-modal 
            :visible="visible=='add'" 
            title="新增" 
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
                    label="名称" name="name"
                    :rules="rules.name"
                >
                    <a-input v-model:value="formState.name" :disabled="visible=='edit'" placeholder="请输入用户名"/>
                </a-form-item>
                <a-form-item
                    label="描述" name="info"
                    :rules="rules.info"
                >
                    <a-input v-model:value="formState.info" placeholder="请输入昵称"/>
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
    })
    const emit=defineEmits(['handleCancel'])
    watch(prop, () => {
        for(let item in formState){
            formState[item]=''
        }
    });


    const formRef = ref<FormInstance>();
    interface FormState {
        name: string
        info: string
    }
    const formState = reactive<FormState>({
        name: '',
        info: '',
    });
    const rules={
        name:[{ required: true, message: '请输入角色名称!' }],
        info:[{ required: true, message: '请输入描述信息！' }],
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
        proxy.$post(proxy.$api.system.role.add,values)
            .then((res:any) => {
                if(res.retCode===0){
                    proxy.$message.success('新增成功！');
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
