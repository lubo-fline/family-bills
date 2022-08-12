<!--
 * @Author: lubo lubo@fline88.com
 * @Date: 2022-08-09 14:41:54
 * @LastEditors: lubo lubo@fline88.com
 * @LastEditTime: 2022-08-12 16:22:52
 * @FilePath: \family-bills\src\components\charts\Pie.vue
 * @Description: 饼图
-->
<template>
    <div>
        <fl-base-chart
            :height="200"
            :width="'100%'"
            :options="options"
            :id="id"
        ></fl-base-chart>
    </div>
</template>

<script setup lang='ts'>
import flBaseChart from "./Base.vue";
import {
    defineProps,
    watch,
    ref
} from "vue";
const prop = defineProps({
    datas: Array,
    id:String
});
let options=ref({
    tooltip: {
        trigger: "item",
    },
    legend: {
        top: "0%",
        left: "right",
        orient:"vertical"
    },
    series: [
        {
            name: "Access From",
            type: "pie",
            radius: ["40%", "90%"],
            center:['30%','50%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: "#fff",
                borderWidth: 2,
            },
            label: {
                show: false,
                position: "center",
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: "40",
                    fontWeight: "bold",
                },
            },
            labelLine: {
                show: false,
            },
            data: [
            ],
        },
    ],
}) ;
watch(prop, (value) => {
    options.value.series[0].data = prop.datas
});
</script>
<style lang='less' scoped>
</style>