import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
window.store = store.state.auth
window.$ = window.jQuery = require('jquery');

createApp(App).use(store).use(router).mount('#app')
