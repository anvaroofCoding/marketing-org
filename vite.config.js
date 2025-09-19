import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

// __dirname ekvivalenti
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		host: '0.0.0.0',
		port: 5173,
	},
	build: {
		outDir: 'dist', // Vercel uchun build chiqishi shu papkada bo'ladi
		rollupOptions: {
			output: {
				manualChunks: undefined, // kerak bo‘lsa dynamic import ishlatish mumkin
			},
		},
	},
})
