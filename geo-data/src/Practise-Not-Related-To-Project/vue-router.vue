<!-- npm install vue-router -->

<!-- Correct Way to Use router and <router-view />
Here’s how the complete setup should look: -->

<!-- router.js -->
<!-- import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; -->

<!-- main.js -->
<!-- import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router

const app = createApp(App);

app.use(router); // Use the router in the Vue app
app.mount('#app'); -->

<!-- App.vue -->
<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> <!-- same as Link in React -->
      <router-link to="/about">About</router-link> <!-- same as Link in React -->
    </nav>
    <router-view /> <!-- Dynamic content renders here -->
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>