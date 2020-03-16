<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  height: 100%;
}

/* 侧边栏样式 */
#sidebar .scrollbar-wrapper {
	overflow-x: hidden !important;
	margin-right: -18px !important;
}

/* 自定义ip表格样式bug修复 */
.page-custom-ip .el-table .cell {
  word-break: normal;
}
</style>
