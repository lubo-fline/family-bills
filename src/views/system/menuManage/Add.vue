<!--
 * @Author: your name
 * @Date: 2022-04-13 15:35:03
 * @LastEditTime: 2022-04-15 14:17:21
 * @LastEditors: Please set LastEditors
 * @Description: 菜单管理新增
 * @FilePath: \family-bills\src\views\system\menu\Add.vue
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
                <a-form-item label="上级菜单" name="parentId">
                    <a-tree-select
                        v-model:value="formState.parentId"
                        show-search
                        style="width: 100%"
                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                        allow-clear
                        :fieldNames="fieldNames"
                        tree-default-expand-all
                        :tree-data="treeData"
                    >
                    </a-tree-select>
                </a-form-item>
                <a-form-item label="菜单类型" name="parentId">
                    <a-select 
                        v-model:value="formState.menuType" 
                        class="widthP100"
                        :options="menuTypeData"
                        @change="menuTypeChange"
                    ></a-select>
                </a-form-item>
                <a-form-item
                    label="菜单名称" name="menuName"
                    :rules="rules.menuName"
                >
                    <a-input v-model:value="formState.menuName" placeholder="请输入菜单名称"/>
                </a-form-item>
                <a-form-item
                    label="菜单标题" name="menuTitle"
                    :rules="rules.menuTitle"
                >
                    <a-input v-model:value="formState.menuTitle" placeholder="请输入菜单标题"/>
                </a-form-item>
                <a-form-item
                    label="路径" name="path"
                    :rules="formState.menuType!='F'?rules.path:[]"
                    v-show="formState.menuType!='F'"
                >
                    <a-input v-model:value="formState.path" placeholder="请输入路径"/>
                </a-form-item>
                <a-form-item
                    label="组件地址" name="component"
                    :rules="formState.menuType=='C'?rules.component:[]"
                    v-show="formState.menuType=='C'"
                >
                    <a-input v-model:value="formState.component" placeholder="请输入组件地址"/>
                </a-form-item>
                <a-form-item
                    label="图标" name="iconName"
                    v-show="formState.menuType=='C'"
                >
                    <a-input v-model:value="formState.iconName" placeholder="请输入图标"/>
                </a-form-item>
                <a-form-item
                    label="是否外链" name="isOuterChain"
                    v-show="formState.menuType=='C'"
                >
                    <a-switch v-model:checked="formState.isOuterChain" />
                </a-form-item>
                <a-form-item
                    label="权限标识" name="permissionSign"
                    v-show="formState.menuType=='F'"
                >
                    <a-input v-model:value="formState.permissionSign" placeholder="请输入权限标识"/>
                </a-form-item>
                <a-form-item
                    label="排序" name="orderNo"
                >
                    <a-input-number class="widthP100" v-model:value="formState.orderNo" placeholder="请输入排序"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang='ts'>
    import { onMounted,defineProps,defineEmits,reactive,watch ,ref,nextTick} from 'vue';
    import useCurrentInstance from '@/hooks/useCurrentInstance'
    import type { FormInstance,TreeSelectProps } from 'ant-design-vue';
    const { proxy } = useCurrentInstance()


    const prop=defineProps({
        visible:String,
        editData:Object,
        treeData:Array
    })
    const emit=defineEmits(['handleCancel'])
    watch(prop, () => {
        if(prop.visible=='add'){
            for(let item in formState){
                if(item=='isOuterChain'){
                    formState[item]=false
                }else if(item=='orderNo'){
                    formState[item]=0
                }else{
                    formState[item]=''
                }
            }   
        }else{
            for(let item in formState){
                formState[item]=prop.editData[item]
            }
        }
    });
    const fieldNames: TreeSelectProps['fieldNames'] = {
        children: 'children',
        label: 'menuTitle',
        key:'id',
        value:'id'
    };
    const formRef = ref<FormInstance>();
    interface FormState {
        menuName: string
        menuTitle: string
        parentId?:number|string,
        menuType:string,
        component?:string,
        iconName?:string,
        isOuterChain?:boolean,
        orderNo?:number,
        permissionSign?:string,
        path:string
    }
    const formState = reactive<FormState>({
        menuName: '',
        menuTitle: '',
        parentId:'',
        menuType:'',
        component:"",
        iconName:"",
        isOuterChain:false,
        orderNo:0,
        permissionSign:"",
        path:""
    });
    const rules={
        menuName:[{ required: true, message: '请输入菜单名称!' }],
        menuTitle:[{ required: true, message: '请输入菜单标题！' }],
        path:[{ required: true, message: '请输入路径！' }],
        component:[{ required: true, message: '请输入组件地址！' }],
    }
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
        proxy.$post(proxy.$api.system.menu.add,values)
            .then((res:any) => {
                if(res.retCode===0){
                    proxy.$message.success('新增成功！');
                    handleCancel(true)
                }
            })
    }
    const editUser=()=>{
        let values=JSON.parse(JSON.stringify(formState))
        values={
            id:prop.editData.id,
            ...values
        }
        proxy.$put(proxy.$api.system.menu.edit,values)
            .then((res:any) => {
                if(res.retCode===0){
                    proxy.$message.success('修改成功！');
                    handleCancel(true)
                }
            })
    }
    const menuTypeData=[
        { label: '目录', value: 'M' },
        { label: '菜单', value: 'C' },
        { label: '按钮', value: 'F' }
    ]
    const menuTypeChange=(val)=>{
        if(val!='C'){
            formState.component=""
            formState.iconName="",
            formState.isOuterChain=false
        }else if(val!='F'){
            formState.permissionSign=''
        }
    }
    const handleCancel=(flag:Boolean=false)=>{
        emit("handleCancel",flag)
    }
</script>
<style lang='less' scoped>

</style>