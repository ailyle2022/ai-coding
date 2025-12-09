<template>
  <div id="app" class="flex h-full">
    <Sidebar />
    <main class="flex-grow p-8 custom-scrollbar overflow-y-auto bg-gray-50">
      <router-view />
    </main>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'

export default {
  name: 'AppView',
  components: {
    Sidebar
  }
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