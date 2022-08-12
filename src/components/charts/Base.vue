<template>
    <div :style="cssStyle()">
        <div v-if="isEmpty" class="fx_flexEmpty fx_widthP100">暂无数据</div>
        <div
            :id="id"
            :class="['fx_widthP100', { fx_disabled: isEmpty }]"
        />
    </div>
</template>
<script setup lang='ts' name="fl-base-chart">
// echarts 5.0踩坑
// https://github.com/apache/incubator-echarts/issues/13764
// https://github.com/apache/incubator-echarts/issues/13741
// https://echarts.apache.org/next/zh/tutorial.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9E%84%E5%BB%BA%20ECharts
// 这里只写echarts的方法
import _ from "lodash";
import * as echarts from "echarts";
import {
    onMounted,
    defineProps,
    onBeforeUnmount,
    nextTick,
    watch,
    ref
} from "vue";
const prop = defineProps({
    width: [Number, String],
    height: [Number, String],
    options: Object,
    functionList: Object,
    id:String
});
const cssStyle = () => {
    let obj = {
        width: prop.width + "px",
        height: prop.height + "px",
    };
    if (typeof prop.width == "string") {
        obj.width = prop.width;
    }

    if (typeof prop.height == "string") {
        obj.height = prop.height;
    }
    return obj;
};
let chart: any = null;
let isEmpty=ref(true) ;
watch(prop, (value) => {
    isEmpty.value = _.isEmpty(prop.options);
    if (!isEmpty.value) {
        nextTick(() => {
            if (chart) {
                // 原画布存在先清空
                chart.clear();
                chart.setOption(prop.options, true);
            } else {
                initCharts();
            }
        });
    }
});
onMounted(() => {
    window && window.addEventListener("resize", handleWindowResize);
});
const initCharts = () => {
    if (!prop.options.backgroundColor) {
        chart = echarts.init(document.getElementById(prop.id), "light");;
    } else {
        chart = echarts.init(document.getElementById(prop.id));
    }
    // chart.setOption(option, notMerge, lazyUpdate);
    // 可选，是否不跟之前设置的 option 进行合并，默认为 false，即合并
    chart.setOption(prop.options, true);
    if (prop.functionList && Object.keys(prop.functionList).length > 0) {
        let self = this;
        for (let key in prop.functionList) {
            if (typeof prop.functionList[key] == "function") {
                chart.on(key,  (params) =>{
                    prop.functionList[key](params);
                });
            }
        }
    }
};
const handleWindowResize = () => {
    if (!chart) return;
    let rect = document.getElementById(prop.id).getBoundingClientRect();
    nextTick(() => {
        chart.resize({
            width: rect.width,
            height: rect.height,
        });
    });
};
onBeforeUnmount(() => {
    window && window.removeEventListener("resize", handleWindowResize);
});
</script>
<style lang="less" scoped>
.fx_flexEmpty {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.fx_disabled {
    display: none;
}

.fx_widthP100 {
    width: 100%;
    height: 100%;
}
</style>