<!--
 * @Author: your name
 * @Date: 2022-03-09 20:39:26
 * @LastEditTime: 2022-08-09 17:10:49
 * @LastEditors: lubo lubo@fline88.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \family-bills\src\App.vue
-->
<template>
	<div class='fx_page' :style="{transform:transform}">
		<a-config-provider :locale="zhCN" :transformCellText="({text})=>text || '-'">
			<template  #renderEmpty>
				<div class="text-center">
					<a-empty :image="emptyImage"/>
				</div>
			</template>
			<router-view/>
		</a-config-provider>
	</div>
</template>
<script setup lang="ts">
	import {  ref, provide } from 'vue';
	import zhCN from 'ant-design-vue/es/locale/zh_CN';
	import { Empty } from 'ant-design-vue';
	import dayjs from 'dayjs';
	import 'dayjs/locale/zh-cn';
	const locale = ref(zhCN.locale);
	const emptyImage=Empty.PRESENTED_IMAGE_SIMPLE
	const transform = 'scale(1,1)'
</script>
<style>
</style>
