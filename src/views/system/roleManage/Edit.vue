<!--
 * @Author: your name
 * @Date: 2022-04-14 14:18:59
 * @LastEditTime: 2022-04-15 10:28:42
 * @LastEditors: Please set LastEditors
 * @Description: 修改角色弹窗
 * @FilePath: \family-bills\src\views\system\roleManage\Edit.vue
-->
<template>
    <div>
        <a-modal 
            :visible="visible=='edit'" 
            title="修改" 
            @ok="handleOk"
            destroyOnClose
            @cancel="handleCancel"
        >
            <a-form
                ref="editForm"
                :model="formState"
                name="editForm"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 16 }"
                autocomplete="off"
            >
                <a-form-item
                    label="名称" name="name"
                    :rules="rules.name"
                >
                    <a-input v-model:value="formState.name" placeholder="请输入名称"/>
                </a-form-item>
                <a-form-item
                    label="描述" name="info"
                    :rules="rules.info"
                >
                    <a-input v-model:value="formState.info" placeholder="请输入描述"/>
                </a-form-item>
            </a-form>
            <a-tree
                v-model:checkedKeys="dataSource.checkedKeys"
                checkable :field-names="fieldNames" checkStrictly @check="treeChecked"
                :tree-data="dataSource.treeData"
            >
            </a-tree>
        </a-modal>
    </div>
</template>

<script setup lang='ts'>
    import { defineProps,defineEmits,reactive,watch,onMounted ,ref} from 'vue';
    import useCurrentInstance from '@/hooks/useCurrentInstance'
    import type { FormInstance,TreeProps } from 'ant-design-vue';
    const { proxy } = useCurrentInstance()


    const prop=defineProps({
        visible:String,
        editData:Object
    })
    const emit=defineEmits(['handleCancel'])
    watch(prop, () => {
        for(let item in formState){
            formState[item]=prop.editData[item]
        }
        getMenuTreeData()
    });

    const editForm = ref<FormInstance>();
    interface FormState {
        name: string
        info: string
        id:number
    }
    const formState = reactive<FormState>({
        name: '',
        info: '',
        id:0
    });
    const rules={
        name:[{ required: true, message: '请输入角色名称!' }],
        info:[{ required: true, message: '请输入描述信息！' }],
    }

    let dataSource=reactive({
        checkedKeys: [],
        treeData:[]
    });
    const fieldNames: TreeProps['fieldNames'] = {
        children: 'children',
        title: 'menuTitle',
        key:'id'
    };

    const handleOk=()=>{
        editForm.value
        .validate()
        .then(val => {
            editUser()
        })
        .catch(info => {
            console.log('校验失败:', info);
        });
    }
    const editUser=()=>{
        let values=JSON.parse(JSON.stringify(formState))
        values={
            menuIds:dataSource.checkedKeys,
            ...values
        }
        proxy.$put(proxy.$api.system.role.edit,values)
            .then((res:any) => {
                if(res.retCode===0){
                    proxy.$message.success('修改成功！');
                    handleCancel(true)
                }
            })
    }
    const handleCancel=(flag:Boolean=false)=>{
        emit("handleCancel",flag)
    }

    const getMenuTreeData=()=>{
        dataSource.checkedKeys=[]
        proxy.$get(proxy.$api.system.role.rolesMenu+prop.editData.id)
            .then((res:any) => {
                if(res.retCode===0){
                    dataSource.treeData=res.data||[]
                    setCheckData(dataSource.treeData)
                }
            })
    }
    const setCheckData=(datas)=>{
        datas&&datas.forEach(item=>{
            if(item.owned){
                dataSource.checkedKeys.push(item.id)
            }
            setCheckData(item.children)
        })
    }
    //树节点选择时，父节点和字节点关联关系（父选择时子不必全选，子选择时父一定选择，父取消子一定取消，子全部取消父不取消）
    const treeChecked=(selectNodes, treeNode)=>{
        dataSource.checkedKeys = selectNodes.checked//获取所有选中的树的数据
        if(treeNode.checked==false){//取消该节点选择时
            if(treeNode.node.children&&treeNode.node.children.length>0){//获取它的子元素
                cancelSelectChildNode(treeNode.node.children)//在所有选中的数据里去掉其子元素选择
            }
        }else{//选中该节点时
            selectParentNode(treeNode.node.parent)//如果父节点没有选中，则要选择父节点
        }
    }
    
    //取消选中子节点
    const cancelSelectChildNode=(nodeChildren)=>{
        nodeChildren.forEach(item=>{
            dataSource.checkedKeys.forEach((element,index)=>{
                if(item.id==element){
                    dataSource.checkedKeys.splice(index, 1); 
                }
            })
            if(item.children){
                cancelSelectChildNode(item.children)
            }
        })
    }
    //选择父节点
    const selectParentNode=(nodeParent)=>{
        if(nodeParent){
            if(dataSource.checkedKeys.indexOf(nodeParent.key)==-1){
                dataSource.checkedKeys.push(nodeParent.key)
                selectParentNode(nodeParent.parent)
            }
        }
    }

</script>
<style lang='less' scoped>

</style>
