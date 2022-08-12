<!--
 * @Author: your name
 * @Date: 2022-03-11 20:08:56
 * @LastEditTime: 2022-08-10 15:17:07
 * @LastEditors: lubo lubo@fline88.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \family-bills\src\views\bills\Index.vue
-->
<template>
    <a-card :bordered="false" size="small" title="账单">
        <a-form
            :model="formState"
            name="horizontal_login"
            layout="inline"
            autocomplete="off"
            ref="searchFormRef"
        >
            <a-form-item label="月份" name="dateStr">
                <a-date-picker
                    v-model:value="formState.dateStr"
                    @change="dateChange"
                    :format="'YYYY-MM'"
                    picker="month"
                    :allowClear="false"
                />
            </a-form-item>
            <a-form-item label="记账类型" name="recordTypeCode">
                <a-select
                    v-model:value="formState.recordTypeCode"
                    class="width120"
                    :options="
                        dataSource.recordTypeCodeData
                    "
                    allowClear
                    placeholder="请选择"
                    @change="(val,datas)=>getSpendCategoryData(datas)"
                ></a-select>
            </a-form-item>
            <a-form-item
                label="支出类型"
                name="expenditureType" 
                v-show="formState.recordTypeCode == 'expendType'"
            >
                <a-select
                    v-model:value="formState.expenditureType"
                    class="width120"
                    :options="dataSource.expenditureType"
                    placeholder="请选择"
                    allowClear
                ></a-select>
            </a-form-item>
            <a-form-item label="用户" name="userId">
                <a-select
                    v-model:value="formState.userId"
                    class="width120"
                    :options="dataSource.userData"
                    allowClear
                    placeholder="请选择"
                ></a-select>
            </a-form-item>
            <a-form-item label="关键字" name="keywords">
                <a-input
                    v-model:value="formState.keywords"
                    class="width120"
                    placeholder="请输入"
                    allowClear
                ></a-input>
            </a-form-item>
            <a-form-item label="消费类别" name="spendCategoryCode">
                <a-select
                    v-model:value="formState.spendCategoryCode"
                    class="width120"
                    :options="dataSource.spendCategoryCode"
                    allowClear
                    placeholder="请选择"
                ></a-select>
            </a-form-item>
            <a-form-item label="支付方式" name="payTypeId">
                <a-select
                    v-model:value="formState.payTypeId"
                    class="width120"
                    :options="dataSource.payTypeId"
                    allowClear
                    placeholder="请选择"
                ></a-select>
            </a-form-item>
        </a-form>
        <div class="marginT16 text-right">
            <a-space>
                <a-button type="primary" @click="onFinish">搜索</a-button>
                <a-button type="default" @click="reset">重置</a-button>
                <a-button type="primary" @click="add">新增</a-button>
            </a-space>
        </div>
        <a-row :gutter="16" class="marginT16">
            <a-col :span="item.children.length>0?12:6" v-for="item in dataSource.totalStaticsConfigData" :key="item.code">
                <a-card size="small" :bordered="false" :bodyStyle="{ background: item.color || 'red', padding: '12px 24px', height: '145px',}">
                    <a-statistic
                        :title="item.label"
                        :precision="2"
                        :value="dataSource.totalStatics[item.code]||0"
                        suffix="元"
                    />
                    <a-row :gutter="12" v-if="item.children.length>0">
                        <a-col :span="8" v-for="ele in item.children" :key="ele.code">
                            <div class="fl_title">{{ele.label}}</div>
                            <div class="fl_value">{{dataSource.totalStatics[ele.code]||0}}元</div>
                        </a-col>
                    </a-row>
                </a-card>
            </a-col>
        </a-row>
        <a-table
            class="marginT16"
            :data-source="dataSource.arr"
            :columns="columns"
            :pagination="false"
            :row-key="(record) => record.id"
            :loading="loading"
        >
            <template #bodyCell="{ column, record, text, index }">
                <template v-if="column.dataIndex === 'id'">
                    {{ (current - 1) * pageSize + index + 1 }}
                </template>
                <template v-else-if="column.dataIndex === 'spendCategoryName'">
                    <a-tag color="green">
                        {{ text }}
                    </a-tag>
                </template>
                <template v-else-if="column.dataIndex === 'recordTypeCode'">
                    <a-tag
                        :color="
                            setTagColor(record).color
                        "
                    >
                        {{
                            setTagColor(record).label
                        }}
                    </a-tag>
                </template>
                <template v-else-if="column.dataIndex === 'action'">
                    <a-space>
                        <a href="javascript:;" @click="editItem(record)"
                            >修改</a
                        >
                        <a href="javascript:;" @click="deleteItem(record.id)"
                            >删除</a
                        >
                    </a-space>
                </template>
            </template>
        </a-table>
        <div class="fl_pagination">
            <a-pagination
                v-model:current="current"
                v-model:pageSize="pageSize"
                show-size-changer
                :total="total"
                @showSizeChange="onShowSizeChange"
            />
        </div>
    </a-card>
    <addModal
        :visible="visible"
        :editData="dataSource.editData"
        :recordTypeCode="formState.recordTypeCode"
        @handleCancel="handleCancel"
        :payTypeData="dataSource.payTypeId"
        :recordTypeData="dataSource.recordTypeCodeData"
    ></addModal>
</template>

<script setup lang='ts'>
import { onMounted, reactive, watch, ref } from "vue";
import useCurrentInstance from "@/hooks/useCurrentInstance";
import addModal from "./Add.vue";
import dayjs, { Dayjs } from "dayjs";
import { Modal } from "ant-design-vue";
import "ant-design-vue/es/modal/style/css";
import type { FormInstance } from "ant-design-vue";
const { proxy } = useCurrentInstance();
let dataSource = reactive({
    arr: [],
    editData: {},
    userData: [],
    totalStaticsConfigData: [
        { label: "收入", code: 'income', color: "rgb(247, 255, 237)" ,children:[]},
        { label: "预支出", code: 'preExpenditure', color: "rgb(253, 247, 230)" ,children:[]},
        {
            label: "已支出", code: 'expenditure', color: "rgb(233, 247, 255)", children: [
                { label: "花销", code: 'cost', color: "rgb(248, 240, 255)" },
                { label: "还款", code: 'repayment', color: "rgb(235, 255, 251)" },
                { label: "转账", code: 'transfer', color: "rgb(253, 240, 246)" },
            ]
        },
    ],
    totalStatics: {},
    expenditureType: [
        { label: "已支出", value: 0 },
        { label: "预支出", value: 1 },
    ],
    spendCategoryCode: [],
    payTypeId: [],
    recordTypeCodeData:[]
});
const columns = [
    {
        title: "序号",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "金额",
        dataIndex: "amount",
        key: "amount",
    },
    {
        title: "备注",
        dataIndex: "remark",
    },
    {
        title: "记账类型",
        dataIndex: "recordTypeCode",
    },
    {
        title: "消费类别",
        dataIndex: "spendCategoryName",
    },
    {
        title: "支付方式",
        dataIndex: "payTypeName",
    },
    {
        title: "消费日期",
        dataIndex: "occurTime",
    },
    {
        title: "所属人员",
        dataIndex: "userName",
    },
    {
        title: "操作",
        dataIndex: "action",
    },
];
const loading = ref(false);
//页码处理
const current = ref(1);
const pageSize = ref(10);
const total = ref(0);
const onShowSizeChange = (current: number, pageSize: number) => {
    current = current;
    pageSize = pageSize;
};
watch(pageSize, () => {
    getTableData();
});
watch(current, () => {
    getTableData();
});

//搜索表单
interface FormState {
    dateStr: Dayjs;
    date: string;
    recordTypeCode?: string;
    userId?: number;
    expenditureType?: number | string;
    keywords?: string;
    spendCategoryCode?: string;
    payTypeId?: number | string;
}
const month =
    new Date().getMonth() + 1 > 9
        ? new Date().getMonth() + 1
        : "0" + (new Date().getMonth() + 1);
let formState = reactive<FormState>({
    dateStr: dayjs(new Date().getFullYear() + "-" + month, "YYYY-MM"),
    date: new Date().getFullYear() + "-" + month,
});
const searchFormRef = ref<FormInstance>();
const initFormState = JSON.parse(JSON.stringify(formState));
const onFinish = (values?: any) => {
    current.value = 1;
    getTotalStaticsData();
    getTableData();
};
const reset = () => {
    searchFormRef.value.resetFields();
    formState = initFormState;
    onFinish();
};
const dateChange = (date: Dayjs, dateStr: string) => {
    formState.date = dateStr;
};

//获取表格数据
const visible = ref<string>("");
onMounted(() => {
    getTableData();
    getUserData();
    getTotalStaticsData();
    getPayTypeData();
    getRecordTypeData()
});
const setTagColor = (datas) => {
    let tagInfo = { color: 'blue', label: '已支出' }
    if (datas.recordTypeCode == 'expendType'&&datas.expenditureType === 1) {
        tagInfo={ color: 'orange', label: '预支出' }
    } else if (datas.recordTypeCode == 'incomeType') {
        tagInfo={ color: 'green', label: '收入' }
    } 
    return tagInfo
}
const getTableData = () => {
    let params = {
        ...formState,
        pageSize: pageSize.value,
        pageNo: current.value,
    };
    loading.value = true;
    delete params.dateStr;
    proxy.$post(proxy.$api.bills.list, params).then((res: any) => {
        loading.value = false;
        if (res.retCode === 0) {
            dataSource.arr = res.data?.list || [];
            total.value = res.data?.total || 0;
        }
    });
};

const getUserData = () => {
    let params = { pageSize: 100, pageNo: 1 };
    proxy.$post(proxy.$api.system.user.list, params).then((res: any) => {
        loading.value = false;
        if (res.retCode === 0) {
            let datas = res.data?.list || [];
            datas.forEach((item) => {
                item["label"] = item.nickname;
                item["value"] = item.id;
            });
            dataSource.userData = datas;
        }
    });
};
//新增\修改
const add = () => {
    visible.value = "add";
    dataSource.editData = {};
};
const handleCancel = (flag: boolean) => {
    visible.value = "";
    if (flag) {
        getTableData();
    }
};
const editId = ref(0);
const editItem = (datas: object) => {
    visible.value = "edit";
    dataSource.editData = datas;
};
//删除
const deleteItem = (id: number) => {
    Modal.confirm({
        title: "提示",
        content: "是否要删除该数据？",
        onOk() {
            proxy.$del(proxy.$api.bills.delete + id).then((res: any) => {
                if (res.retCode === 0) {
                    proxy.$message.success("删除成功！");
                    getTableData();
                }
            });
        },
        onCancel() {},
    });
};
//获取统计信息数据
const getTotalStaticsData = () => {
    let {
        userId,
        date,
        expenditureType,
        keywords,
        payTypeId,
        recordTypeCode,
        spendCategoryCode,
    } = formState;
    proxy
        .$post(proxy.$api.bills.getStatics, {
            date,
            userId,
            expenditureType,
            keywords,
            payTypeId,
            recordTypeCode,
            spendCategoryCode,
        })
        .then((res: any) => {
            if (res.retCode === 0) {
                dataSource.totalStatics = res.data || {};
            }
        });
};
//获取支付方式下拉数据
const getPayTypeData=()=>{
    proxy.$get(proxy.$api.system.payType.selectList).then((res:any)=>{
        if(res.retCode===0){
            const datas=res.data||[]
            datas.forEach((item:any)=>{
                item['value']=item.id
                item['label']=item.name
            })
            dataSource.payTypeId=datas
        }
    })
}
//获取记账类型下拉数据
const getRecordTypeData=()=>{
    proxy.$get(proxy.$api.bills.recordTypeData).then((res:any)=>{
        if(res.retCode===0){
            const datas=res.data||[]
            datas.forEach((item:any)=>{
                item['value']=item.code
                item['label']=item.name
            })
            dataSource.recordTypeCodeData=datas
        }
    })
}
//根据记账类型获取消费类别下拉数据
const getSpendCategoryData=(datas)=>{
    if(!datas||!datas.id){
        return false
    }
    formState.spendCategoryCode=null
    proxy.$get(proxy.$api.bills.spendCategory+datas.id).then((res:any)=>{
        if(res.retCode===0){
            const datas=res.data||[]
            datas.forEach((item:any)=>{
                item['value']=item.code
                item['label']=item.name
            })
            dataSource.spendCategoryCode=datas
        }
    })
}
</script>
<style lang='less' scoped>
.fl_pagination {
    margin-top: 16px;
    text-align: right;
}
.pull-right {
    float: right !important;
}
.fl_staticsBox {
    float: right;
    width: 300px;
}
.fl_title{
    font-size: 12px;
    color:rgba(0, 0, 0, 0.45);
    margin: 4px 0;
}
.fl_value{
    font-size: 20px;
}
.fl_line{
    height: 59px;
    border-left:1px solid #ccc;
}
</style>