import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';



// https://vite.dev/config/
export default defineConfig(({ mode }) => {

   //  Load env variables.
    const env = loadEnv(mode, process.cwd());

    return {
        base: './',
        define: {
            __APP_NAME__: JSON.stringify(env.VITE_APP_NAME)
        },
        plugins: [react()],
        build: {
            outDir: 'resources/dist', // هنا تحدد مكان البناء
            emptyOutDir: true // يحذف المجلد قبل البناء (اختياري)
        },
        resolve: {
            alias: {
                '@root': path.resolve(__dirname, './'),
                '@src': path.resolve(__dirname, './src'),
                '@components': path.resolve(__dirname, './src/components'),
                '@PreMadeComponents': path.resolve(__dirname, './src/components/PreMadeComponents'),
                '@config': path.resolve(__dirname, './src/config'),
                '@resources': path.resolve(__dirname, './src/resources'),
                '@services': path.resolve(__dirname, './src/services'),
                '@styles': path.resolve(__dirname, './src/styles'),
                '@store': path.resolve(__dirname, './src/store'),
                '@slices': path.resolve(__dirname, './src/store/slices'),
            },
        },
    }
})
