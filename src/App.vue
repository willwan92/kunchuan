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

/* 侧边栏样式，写在此才有效 */
#sidebar .scrollbar-wrapper {
	overflow-x: hidden !important;
	margin-right: -18px !important;
}
</style>
