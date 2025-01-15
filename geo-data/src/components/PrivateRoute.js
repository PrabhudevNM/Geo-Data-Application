// components/PrivateRoute.js
export default function PrivateRoute(to, from, next) {
    const token = localStorage.getItem('token'); // Or check Vuex store for auth
    if (token) {
      next(); // Allow the navigation if authenticated
    } else {
      next('/login'); // Redirect to login if not authenticated
    }
  }
  

 