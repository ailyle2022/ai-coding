import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { DefaultApolloClient } from '@vue/apollo-composable'
import apolloClient from './apollo-client'
import i18n from './i18n'

const app = createApp(App)

app.provide(DefaultApolloClient, apolloClient)
app.use(router)
app.use(i18n)

app.mount('#app')