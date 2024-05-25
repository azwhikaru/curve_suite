import {
	defineConfig
} from 'vite'
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
	plugins: [
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag.startsWith('mdui-')
				}
			}
		})
	],
	build: {
		chunkSizeWarningLimit: 1600,
	}
}