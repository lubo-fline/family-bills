<!--
 * @Author: your name
 * @Date: 2022-04-13 15:15:23
 * @LastEditTime: 2022-04-14 11:42:41
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
                    label="用户名" name="username"
                    :rules="rules.username"
                >
                    <a-input v-model:value="formState.username" :disabled="visible=='edit'" placeholder="请输入用户名"/>
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
                    v-if="visible=='add'"
                >
                    <a-input-password v-model:value="formState.credential" placeholder="请输入密码"/>
                </a-form-item>
                <a-form-item
                    label="角色权限" name="roles"
                    :rules="rules.roles"
                >
                    <a-select 
                        v-model:value="formState.roles" 
                        class="widthP00" mode="multiple"
                        :options="dataSource.rolesData"
                        placeholder="请选择角色权限"
                    ></a-select>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang='ts'>
    import { onMounted,defineProps,defineEmits,reactive,watch ,ref,nextTick} from 'vue';
    import useCurrentInstance from '@/hooks/useCurrentInstance'
    import type { FormInstance } from 'ant-design-vue';
    const { proxy } = useCurrentInstance()


    const prop=defineProps({
        visible:String,
        editId:Number
    })
    const emit=defineEmits(['handleCancel'])
    onMounted(()=>{
        getUserData()
    })
    watch(prop, () => {
        for(let item in formState){
            if(item=='roles'){
                formState[item]=[]
            }else if(item =='sex'){
                formState[item]=1
            }else{
                formState[item]=''
            }
        }
        nextTick(()=>{
            getUserData()
        })
    });


    const formRef = ref<FormInstance>();
    interface FormState {
        username: string
        nickname: string
        email: string
        credential?:string
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
            if(prop.visible=='add'){
                addUser()
            }else{
                editUser()
            }
        })
        .catch(info => {
            console.log('校验失败:', info);
        });
    }
    const addUser=()=>{
        let values=JSON.parse(JSON.stringify(formState))
        proxy.$post(proxy.$api.system.user.add,values)
            .then((res:any) => {
                if(res.retCode===0){
                    handleCancel(true)
                }
            })
    }
    const editUser=()=>{
        let values=JSON.parse(JSON.stringify(formState))
        values={
            id:prop.editId,
            ...values
        }
        delete values.credential
        delete values.username
        proxy.$put(proxy.$api.system.user.edit,values)
            .then((res:any) => {
                if(res.retCode===0){
                    handleCancel(true)
                }
            })
    }
    const sexData=[
        {label:'男',value:1},
        {label:'女',value:2}
    ]
    const handleCancel=(flag:Boolean=false)=>{
        emit("handleCancel",flag)
    }
    const getUserData=()=>{
        proxy.$get(`${proxy.$api.system.user.getUserData}/${prop.editId}`)
            .then((res:any) => {
                if(res.retCode===0){
                    let datas=res.data?.allRoles||[]
                    datas.forEach((item:any)=>{
                        item['label']=item.info
                        item['value']=item.id
                    })
                    dataSource.rolesData=datas
                    if(prop.visible=='edit'){
                        for(let item in formState){
                            if(item!='roles'){
                                formState[item]=res.data[item]||''
                            }
                        }
                        formState.roles=res.data?.ownedRoles.map(item=>item.id)||[]
                    }
                }
            })
    }
</script>
<style lang='less' scoped>

</style>