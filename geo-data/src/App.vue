<template>
  <div id="app">
    <!-- Navigation Bar -->
    <nav>
      <h4 class="logo">Geo-Data App</h4>
      <!-- </div> -->
    </nav>

    <!-- Router View -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
#app {
  text-align: center;
}

/* Navigation Bar Styling */
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.logo {
  color: rgb(19, 125, 10);
  margin: 0;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.nav-links a:hover {
  color: rgb(19, 125, 10);
}
</style>