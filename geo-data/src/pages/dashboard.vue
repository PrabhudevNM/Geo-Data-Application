<template>
    <div class="dashboard">
      <NavigationMenu/>
      <h1>Welcome to the Dashboard</h1>
      <p>You are logged in!</p>
    </div>
  </template>
  
  <script>
  import NavigationMenu from '@/components/NavigationMenu.vue';
  export default {
    name: 'DashboardPage',
    components:{
        NavigationMenu
    },
    methods: {
      logout() {
        localStorage.removeItem('token'); // Remove token from localStorage
        this.$router.push('/login'); // Redirect to login page
      }
    }
  }
  </script>
  
  <style scoped>
  .dashboard {
    padding: 20px;
    text-align: center;
  }
  
  h1 {
    color: #333;
  }
  
  button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>
  