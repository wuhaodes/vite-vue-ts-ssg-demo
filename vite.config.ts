/* eslint-disable */
import { defineConfig, loadEnv } from 'vite'
import ViteVue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import vitePages from 'vite-plugin-pages'
import ViteMarkdown from 'vite-plugin-md'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import autoprefixer from 'autoprefixer'
import ESlint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const prefix = env.VITE_APP_BASE_API
  return {
    plugins: [
      ESlint({ fix: true }),
      VueJsx(),
      ViteVue({ include: [/\.vue$/, /\.md$/] }),
      vitePages({
        dirs: 'src/views',
        extensions: ['vue', 'md'],
        exclude: ['**/components/*.vue'],
      }),
      ViteMarkdown(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()],
        dts: true,
        eslintrc: { enabled: true }
      }),
      Components({
        deep: true,
        directoryAsNamespace: true,
        collapseSamePrefixes: true,
        extensions: ['vue', 'tsx'],
        resolvers: [ElementPlusResolver()],
      }),
    ],
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: path.resolve(__dirname, 'src') + '/',
        },
      ],
      extensions: ['.tsx', '.md', '.vue', '.ts'],
    },
    css: {
      postcss: {
        plugins: [autoprefixer()],
      },
    },
    server: {
      proxy: {
        [prefix]: 'http://192.168.3.214:8086',
        '/upload': 'http://192.168.3.214:8088',
        '/download': 'http://192.168.3.214:8088',
      },
    },
    ssr: {
      noExternal: [/element-plus/]
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('dayjs')) {
              return 'dayjs'
            }
            if (id.includes('lodash')) {
              return 'lodash'
            }
            if (id.includes('element-plus')) {
              return 'element-plus'
            }
            if (id.includes('file-saver')) {
              return 'file-saver'
            }
            if (id.includes('js-cookie')) {
              return 'js-cookie'
            }
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
        },
      },
    },
  }
})
