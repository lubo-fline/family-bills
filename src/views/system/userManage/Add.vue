<!--
 * @Author: your name
 * @Date: 2022-04-13 15:15:23
 * @LastEditTime: 2022-04-13 17:43:41
 * @LastEditors: Please set LastEditors
 * @Description: 用户新增
 * @FilePath: \family-bills\src\views\system\user\Add.vue
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
                ref="formRef"
                :model="formState"
                name="basic"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 16 }"
                autocomplete="off"
            >
                <a-form-item
                    label="用户名" name="username"
                    :rules="rules.username"
                >
                    <a-input v-model:value="formState.username" placeholder="请输入用户名"/>
                </a-form-item>
                <a-form-item
                    label="昵称" name="nickname"
                    :rules="rules.nickname"
                >
                    <a-input v-model:value="formState.nickname" placeholder="请输入昵称"/>
                </a-form-item>
                <a-form-item
                    label="性别" name="sex"
                    :rules="rules.sex"
                >
                    <a-select 
                        v-model:value="formState.sex" 
                        class="widthP00" 
                        :options="sexData"
                        placeholder="请选择性别"
                    ></a-select>
                </a-form-item>
                <a-form-item
                    label="邮箱" name="email"
                    :rules="rules.email"
                >
                    <a-input v-model:value="formState.email" placeholder="请输入邮箱"/>
                </a-form-item>
                <a-form-item
                    label="密码" name="credential"
                    :rules="rules.credential"
                >
                    <a-input-password v-model:value="formState.credential" placeholder="请输入密码"/>
                </a-form-item>
                <a-form-item
                    label="角色权限" name="roles"
                    :rules="rules.roles"
                >
                    <a-select 
                        v-model:value="formState.roles" 
                        class="widthP00" 
                        :options="dataSource.rolesData"
                        placeholder="请选择角色权限"
                    ></a-select>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang='ts'>
    import { onMounted,defineProps,defineEmits,reactive,watch ,ref} from 'vue';
    import useCurrentInstance from '@/hooks/useCurrentInstance'
    import type { FormInstance } from 'ant-design-vue';
    const { proxy } = useCurrentInstance()
    import dayjs,{Dayjs} from 'dayjs';


    const prop=defineProps({
        visible:String,
        editId:Number
    })
    const emit=defineEmits(['handleCancel'])
    
    const formRef = ref<FormInstance>();
    interface FormState {
        username: string
        nickname: string
        email: string
        credential:string
        sex: number,
        roles:number[]
    }
    const formState = reactive<FormState>({
        username: '',
        nickname: '',
        email:'',
        credential:'',
        sex:1,
        roles:[]
    });
    const rules={
        username:[{ required: true, message: '请输入用户名!' }],
        nickname:[{ required: true, message: '请输入昵称！' }],
        email:[{ required: true, message: '请输入邮箱！' },{type: 'email',message: '请输入正确的email!',},],
        credential:[{ required: true, message: '请输入密码！' }],
        sex:[{ required: true, message: '请选择性别！' }],
        roles:[{ required: true, message: '请选择角色权限！' }],
    }
    let dataSource=reactive({
        rolesData: []
    });
    const handleOk=()=>{
        formRef.value
        .validate()
        .then(val => {
            console.log(val)
            let values=JSON.parse(JSON.stringify(formState))
            proxy.$post(proxy.$api.bills.add,values)
            .then((res:any) => {
                if(res.retCode===0){
                    handleCancel(true)
                }
            })
        })
        .catch(info => {
            console.log('校验失败:', info);
        });
    }

    const sexData=[
        {label:'男',value:1},
        {label:'女',value:2}
    ]
    const handleCancel=(flag:Boolean=false)=>{
        emit("handleCancel",flag)
    }
</script>
<style lang='less' scoped>

</style>