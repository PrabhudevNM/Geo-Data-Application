import { createApp } from 'vue';
import App from './App.vue';
import store from './components/AuthVuex/store'; // Assuming Vuex store is in this location
import router from './router'; // Your router configuration

// Create Vue app instance, use Vuex store, and set up routing
createApp(App)
  .use(store)   // Use Vuex store for state management
  .use(router)  // Set up Vue Router for navigation
  .mount('#app'); // Mount the app to the DOM element with id="app"
