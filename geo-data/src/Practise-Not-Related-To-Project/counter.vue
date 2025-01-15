<template>
    <div>
      <h1>Hello Vue</h1>
      <button @click="increment">Count: {{ count }}</button>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const count = ref(0);
      const increment = () => count.value++;
      return { count, increment };
    },
  };
  </script>
  
  <style scoped>
  h1 {
    color: blue;
  }
  </style>
  