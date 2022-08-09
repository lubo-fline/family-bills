/*
 * @Author: your name
 * @Date: 2022-03-09 20:39:26
 * @LastEditTime: 2022-08-09 10:22:42
 * @LastEditors: lubo lubo@fline88.com
 * @Description: 全局配置
 * @FilePath: \family-bills\vite.config.ts
 */
import vue from '@vitejs/plugin-vue'
const path = require('path');
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
module.exports = {
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src")
		}
	},
	plugins: [
		vue(),
		Components({
			resolvers: [
				AntDesignVueResolver(),
			],
			dirs: ['src'], // 可以将需要自动引入的文件所在文件夹加入数组内,路径为项目根目录下相对路径
		})
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
	hostname: '127.0.0.1',
	port: 3000,
	// 是否自动在浏览器打开
	open: true,
	// 是否开启 https
	https: false,
	// 服务端渲染
	ssr: false,
	/**
	* 在生产中服务时的基本公共路径。
	* @default '/'
	*/
	base: './',
	/**
	* 与“根”相关的目录，构建输出将放在其中。如果目录存在，它将在构建之前被删除。
	* @default 'dist'
	*/
	outDir: 'dist',
	// 反向代理，此处应该特别注意，网上很多教程是直接设置proxy，并没有向官网那样添加 server，可能会导致失败，vite官网：https://vitejs.dev/guide/features.html#async-chunk-loading-optimization
	server: {
		port: 8080,
		proxy: {
			'/api': {
				target: 'https://jizhang.wuququ.xyz/',
				ws: false,
        		changeOrigin: true
			}
		}
	}
};