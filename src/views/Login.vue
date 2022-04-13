<!--
 * @Author: your name
 * @Date: 2022-03-10 11:12:12
 * @LastEditTime: 2022-04-01 09:44:56
 * @LastEditors: Please set LastEditors
 * @Description: 登录页面
 * @FilePath: \family-bills\src\views\Login.vue
-->
<template>
    <div class="fl_login">
        <div class="fl_title">大头记账</div>
        <a-form
			:model="formState"
            name="basic"
            class="fl_form"
            :wrapper-col="{ span: 24 }"
            autocomplete="off"
            @finish="onFinish"
		>
			<a-form-item
                name="username"
                :rules="rules.username"
            >
                <a-input v-model:value="formState.username" placeholder="请输入用户名"/>
            </a-form-item>

            <a-form-item
                name="password"
                :rules="rules.password"
            >
                <a-input-password v-model:value="formState.password" placeholder="请输入密码"/>
            </a-form-item>
            <a-button type="primary" block html-type="submit">提交</a-button>
		</a-form>
    </div>
</template>
<script setup lang='ts'>
    import { reactive } from 'vue';
    import useCurrentInstance from '../hooks/useCurrentInstance'
    import { useRouter } from 'vue-router'
    const { proxy } = useCurrentInstance()
    const router = useRouter()

    interface FormState {
        username: string;
        password: string;
    }
    const formState = reactive<FormState>({
        username: '',
        password: '',
    });
    const rules={
        username:[{ required: true, message: '请输入用户名!' }],
        password:[{ required: true, message: '请输入密码！' }]
    }
    const onFinish=(values:any)=>{
        proxy.$post(proxy.$api.oauthToken.login,values)
        .then((res:any) => {
            if(res.retCode===0){
                localStorage.setItem('userData',JSON.stringify(res.data||{}))
                proxy.$message.success('登录成功！');
                router.push('/home')
            }else{
                proxy.$message.error(res.message);
            }
        })
    }
</script>
<style lang='less' scoped>
.fl_login{
    background: url('../assets/image/background.svg') no-repeat;
    height: 100vh;
    .fl_title{
        padding-top:100px;
        margin-bottom: 24px;
        text-align: center;
        font-size: 48px;

    }
    .fl_form{
        width: 30%;
        margin: 0 auto;
    }
}
</style>