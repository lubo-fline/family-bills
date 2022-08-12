/*
 * @Author: your name
 * @Date: 2022-03-09 20:39:26
 * @LastEditTime: 2022-08-10 15:26:30
 * @LastEditors: lubo lubo@fline88.com
 * @Description: 全局配置
 * @FilePath: \family-bills\vite.config.ts
 */
import vue from '@vitejs/plugin-vue'
const path = require('path');
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"@c": path.resolve(__dirname, "src/components"),
			"@a": path.resolve(__dirname, "src/assets"),
			"@api": path.resolve(__dirname, "src/api")
		}
	},
	plugins: [
		vue(),
		Components({
			resolvers: [
				AntDesignVueResolver(),
			],
			dirs: ['src'], // 可以将需要自动引入的文件所在文件夹加入数组内,路径为项目根目录下相对路径
		}),
		VueSetupExtend()
	],
	css: {
		// css预处理器
		preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
		},
		modules:false
	},
	build: {
		outDir: 'dist',
	},
	// 反向代理，此处应该特别注意，网上很多教程是直接设置proxy，并没有向官网那样添加 server，可能会导致失败，vite官网：https://vitejs.dev/guide/features.html#async-chunk-loading-optimization
	server: {
		// 是否自动在浏览器打开
		open: true,
		port: 8080,
		proxy: {
			'/api': {
				target: 'https://jizhang.wuququ.xyz/',
				ws: false,
        		changeOrigin: true
			}
		}
	}
})