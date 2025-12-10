<template>
  <div id="app" class="h-full">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'AppWithoutSidebar'
}
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
</style>
