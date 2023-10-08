<template>
  <router-view v-slot="{ Component }" v-if="!reload">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import { provide, ref } from 'vue'
import { filterEmpty } from './utils'
import { useRoute, useRouter } from 'vue-router'
import useStore from './store'

const route = useRoute()
const router = useRouter()
const store = useStore()

const reload = ref(false)

provide('updateQuery', (query: Record<string, any>, needReload = false) => {
  query = filterEmpty({ ...route.query, ...query })
  router.replace({ path: route.path, query })
  if (!needReload) {
    return
  }
  reload.value = true
  setTimeout(() => (reload.value = false), 500)
})

provide('toBackStage', (path = '') => {
  typeof path === 'string' || (path = '')
  const address = store.systemConfig.address
  if (!address) {
    return
  }
  const token = useStore().token || ''
  path = path?.startsWith('/') ? path.slice(1) : path
  path = address + '/' + path

  if (token) {
    path += path.includes('?') ? '&pass=' + token : '?pass=' + token
  }
  if (!path) {
    return
  }
  window.open(path)
})

provide('scrollTop', (top = 0) => {
  const app = document.querySelector('#app')
  if (app == null) {
    return
  }
  app.scrollTop = top
})
</script>

<style lang="less">
:root {
  --layout-width: 1200px;
  --layout-bg-color: #f9f9f9;
  --half-layout: calc(var(--layout-width) / 2);
  --app-main-bg-color: #fff;
  --header-height: 40px;
  --header-bg-color: var(--layout-bg-color);
  --footer-height: 180px;
  --footer-bg-color: #4d4d4d;
  --search-height: 96px;
  --tab-height: 45px;
  --classify-width: 238px;
  --d-border-color: #f3f3f3;
}

body {
  height: 100vh;
}

#app {
  font-family:
    system-ui,
    -apple-system,
    SourceHanSansCN-Bold,
    SourceHanSansCN;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  height: 100%;
  color: #2c3e50;

  * {
    box-sizing: border-box;
  }

  &::-webkit-scrollbar {
    background-color: #fff;
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 6px;
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: #fff;
    border-radius: 6px;
    width: 6px;
  }
}
</style>
