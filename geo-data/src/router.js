import { createRouter, createWebHistory } from 'vue-router';
import RegisterPage from './pages/register.vue';
import LoginPage from './pages/login.vue';
import DashboardPage from './pages/dashboard.vue';
import MapPage from './pages/Home.vue';
import PrivateRoute from './components/PrivateRoute';

const routes = [
  { path: '/', component: RegisterPage },
  { path: '/login', component: LoginPage },
  {
    path: '/dashboard',
    component: DashboardPage,
    beforeEnter:PrivateRoute
  },
  {
    path: '/home',
    component: MapPage,
    beforeEnter: PrivateRoute
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
