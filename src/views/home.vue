<template>
  <layout>
    <router-view />
  </layout>
</template>

<!-- 定义路由相关数据 -->
<route lang="yaml">
path: '/'
meta:
  title: '首页'
</route>

<script lang="ts" setup>
  import Layout from '@/layout/default.vue'
  import { useHead } from '@unhead/vue'
  useHead({
    title: '优管网-集管道行业供应链、产业链及创新链为一体的产业互联网交易平台',
    meta: [
      {
        name: 'description',
        content:
          '优管网致力于服务中小实体企业，以管道产品及其设备、塑料大宗商品、智能制造应用技术三个专业领域为特色，构建工业互联网交易平台，让商家快速触达海量用户，让买家快速找到优质货源。',
      },
      {
        name: 'keywords',
        content:
          '管道b2b,管道厂家,管道采购,管道销售,管道生产厂家,PE管厂家,PE管价格,pvc管生产厂家,pvc管件,pvc管价格,优管网',
      },
    ],
  })
</script>
