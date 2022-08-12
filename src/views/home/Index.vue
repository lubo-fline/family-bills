<!--
 * @Author: your name
 * @Date: 2022-03-31 16:58:33
 * @LastEditTime: 2022-08-12 16:25:34
 * @LastEditors: lubo lubo@fline88.com
 * @Description: 首页
 * @FilePath: \family-bills\src\views\home\Index.vue
-->
<template>
    <div>
        <a-row :gutter="[16, 16]">
            <a-col :span="24">
                <a-card title="首页" size="small" :bordered="false">
                    <a-form
                        :model="formState"
                        name="horizontal_login"
                        layout="inline"
                        autocomplete="off"
                        @finish="getStaticsData"
                        ref="searchFormRef"
                    >
                        <a-form-item label="用户" name="userId">
                            <a-select
                                v-model:value="formState.userId"
                                class="width120"
                                :options="dataSource.userData"
                                @change="getStaticsData"
                                placeholder="请选择"
                            ></a-select>
                        </a-form-item>
                        <a-form-item label="时间段" name="recordTypeCode">
                            <a-select
                                v-model:value="formState.recordTypeCode"
                                class="width120"
                                :options="recordTypeCodeData"
                                @change="dateTypeChange"
                            ></a-select>
                        </a-form-item>
                        <a-form-item label="时间范围" name="dateStr">
                            <a-range-picker
                                v-model:value="formState.dateRange"
                                @change="dateChange"
                                :allowClear="false"
                            />
                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" html-type="submit"
                                >搜索</a-button
                            >
                        </a-form-item>
                        <a-form-item>
                            <a-button type="default" @click="reset"
                                >重置</a-button
                            >
                        </a-form-item>
                    </a-form>
                </a-card>
            </a-col>
            <a-col
                :span="6"
                v-for="item in staticsTotalConfigData"
                :key="item.code"
            >
                <a-card :bordered="false">
                    <a-row :gutter="16">
                        <a-col :span="6">
                            <img :src="item.image" class="fl_staticsImage" />
                        </a-col>
                        <a-col :span="18">
                            <div class="fl_staticsTitle">{{ item.name }}</div>
                            <div>
                                <span class="fl_staticsValue">{{
                                    staticsTotalData[item.code] || 0
                                }}</span
                                >元
                            </div>
                        </a-col>
                    </a-row>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card size="small" :bordered="false" title="收支趋势">
                    
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card size="small" :bordered="false" title="支出类别趋势">
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card size="small" :bordered="false" title="收入类别趋势">
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card size="small" :bordered="false" title="支付方式环比">
                    <Pie :datas="payTypeList" :id="'payTypeList'"></Pie>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card size="small" :bordered="false" title="支付类别环比">
                    <Pie :datas="spendCategoryList" :id="'spendCategoryList'"></Pie>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card size="small" :bordered="false" title="收入类别环比">
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, reactive, ref } from "vue";
import useCurrentInstance from "@/hooks/useCurrentInstance";
import dayjs, { Dayjs } from "dayjs";
import type { FormInstance } from "ant-design-vue";
import shouru from "@/assets/image/shouru.svg";
import cunkuan from "@/assets/image/cunkuan.svg";
import zhichu from "@/assets/image/zhichu.svg";
import daiguihuan from "@/assets/image/daiguihuan.svg";
import Pie from "@c/charts/Pie.vue";
const { proxy } = useCurrentInstance();
type RangeValue = [Dayjs, Dayjs];
const loading = ref(false);
let dataSource = reactive({
    userData: [],
});
//搜索表单
const searchFormRef = ref<FormInstance>();
interface FormState {
    dateRange: RangeValue;
    dateRangeStr: string[];
    recordTypeCode: string;
    userId?: number;
}
const formState = reactive<FormState>({
    dateRangeStr: ['', ''],
    dateRange: [null,null],
    recordTypeCode: "thisWeek",
});

const reset = () => {
    searchFormRef.value.resetFields();
};
const dateChange = (date: Dayjs, dateStr: string) => {
    formState.dateRangeStr = [dateStr[0], dateStr[1]];
    getStaticsData();
};
const dateTypeChange = (value: string) => {
    const today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    let startDay:string=''
    switch (value) {
        case 'thisWeek':
            let date = new Date().getDay()
            startDay=new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate()-(date-1))
            break;
        case 'thisMonth':
            startDay=new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1
            break;
        case 'thisYear':
            startDay=new Date().getFullYear() + '-' + 1 + '-' + 1
            break;
        case 'nearWeek':
            let time=new Date().getTime()-7*24*60*60*1000
            startDay=new Date(time).getFullYear() + '-' + (new Date(time).getMonth() + 1) + '-'+new Date(time).getDate()
            break;
        case 'nearMonth':
            let monthTime=new Date().getTime()-30*24*60*60*1000
            startDay=new Date(monthTime).getFullYear() + '-' + (new Date(monthTime).getMonth() + 1) + '-'+new Date(monthTime).getDate()
            break;
        case 'nearYear':
            startDay = (new Date().getFullYear() - 1) + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
            break;
        default:
            startDay = today
            break
    }
    formState.dateRangeStr = [startDay, today]
    formState.dateRange = [dayjs(new Date(startDay)), dayjs(new Date())]
    getStaticsData();
}
let payTypeList = ref([]);
let spendCategoryList = ref([]);
onMounted(() => {
    getUserData();
    dateTypeChange('thisWeek')
});

const getUserData = () => {
    let params = { pageSize: 100, pageNo: 1 };
    proxy.$post(proxy.$api.system.user.list, params).then((res: any) => {
        if (res.retCode === 0) {
            let datas = res.data?.list || [];
            datas.forEach((item) => {
                item["label"] = item.nickname;
                item["value"] = item.id;
            });
            dataSource.userData = [ ...datas];
        }
    });
};
const recordTypeCodeData = [
    { label: "本周", value: "thisWeek" },
    { label: "本月", value: "thisMonth" },
    { label: "本年", value: "thisYear" },
    { label: "近一周", value: "nearWeek" },
    { label: "近30天", value: "nearMonth" },
    { label: "近一年", value: "nearYear" },
];
const staticsTotalConfigData = [
    { name: "总收入", code: "income", image: shouru },
    { name: "总支出", code: "expenditure", image: zhichu },
    { name: "总存款", code: "cunkuan", image: cunkuan },
    { name: "待归还", code: "return", image: daiguihuan },
];
let staticsTotalData =ref({}) ;
const getStaticsData = () => {
    let params = { startDate: formState.dateRangeStr[0],endDate: formState.dateRangeStr[1],userId :formState.userId};
    proxy.$get(proxy.$api.analysis.queryHomeInfo, params).then((res: any) => {
        loading.value = false;
        if (res.retCode === 0) {
            staticsTotalData.value = res.data || {}
            payTypeList.value = res.data.payTypeList || []
            spendCategoryList.value=res.data.spendCategoryList||[]
        }
    });
}
</script>
<style lang='less' scoped>
.fl_staticsImage {
    width: 100%;
    height: 80px;
}
.fl_staticsTitle {
    font-size: 16px;
    margin-top: 10px;
}
.fl_staticsValue {
    font-size: 30px;
    font-weight: bolder;
    margin-right: 10px;
}
</style>