<template>
  <div class="layout-container flex col">
    <div class="app-main flex1">
      <router-view />
    </div>
  </div>
</template>

<style lang="less" scoped>
  .layout-container {
    width: 100vw;
    min-height: 100vh;
    background-color: var(--layout-bg-color);

    .app-main {
      width: var(--layout-width);
      margin: 0 auto;
    }
  }
</style>
