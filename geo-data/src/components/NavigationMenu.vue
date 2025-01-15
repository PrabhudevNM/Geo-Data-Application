<template>
    <nav class="navbar">
      <ul class="nav-list">
        <li v-if="!isLoggedIn"><router-link class="nav-link" to="/home">Home</router-link></li>
        <li v-if="isLoggedIn"><router-link class="nav-link" to="/home">Home</router-link></li>
        <li v-if="!isLoggedIn">
          <button class="logout-btn" @click="logout">Logout</button>
        </li>
        <li v-if="isLoggedIn">
          <button class="logout-btn" @click="logout">Logout</button>
        </li>
      </ul>
    </nav>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  
  export default {
    computed: {
      ...mapGetters(['isLoggedIn']),
    },
    methods: {
      logout() {
        this.$store.dispatch('logoutUser');
        this.$router.push('/login'); // Redirect to login page after logout
      },
    },
  };
  </script>
  
  <style scoped>
  /* Navigation Bar Styles */
  .navbar {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2c3e50;
    padding: 15px 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  /* Navigation List Styles */
  .nav-list {
    list-style: none;
    display: flex;
    gap: 20px;
    margin: 0;
    padding: 0;
  }
  
  /* Navigation Link Styles */
  .nav-link {
    color: #ecf0f1;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;
  }
  
  .nav-link:hover {
    color: #1abc9c;
  }
  
  /* Logout Button Styles */
  .logout-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .logout-btn:hover {
    background-color: #c0392b;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .nav-list {
      flex-direction: column;
      gap: 10px;
    }
  }
  </style>
  