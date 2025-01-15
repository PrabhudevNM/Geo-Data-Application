<!-- Uses v-if for conditional rendering and v-else for fallback. -->

<template>
    <div>
      <h1 v-if="isLoggedIn">Welcome back!</h1>
      <h1 v-else>Please log in</h1>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isLoggedIn: true,
      };
    },
  };
  </script>
  