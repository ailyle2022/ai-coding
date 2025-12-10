<template>
  <div id="app" class="h-full">
    <div v-if="$route.meta.layout === 'without-sidebar'" class="h-full">
      <router-view />
    </div>
    <div v-else class="flex h-full">
      <Sidebar />
      <main class="flex-grow p-8 custom-scrollbar overflow-y-auto bg-gray-50">
        <router-view />
      </main>
    </div>
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
