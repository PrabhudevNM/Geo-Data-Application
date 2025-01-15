<script setup>
import { reactive } from 'vue';

const state = reactive({
  count: 0,
  message: 'Hello Vue!'
});

function increment() {
  state.count++;
}
</script>

<template>
  <div>
    <p>{{ state.message }}</p>
    <p>Count: {{ state.count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
