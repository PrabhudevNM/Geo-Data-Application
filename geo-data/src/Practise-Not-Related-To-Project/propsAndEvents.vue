<!-- 2. Props and Events -->
 
<!-- * Props are declared explicitly and passed to child components.
 * Emits custom events to communicate with the parent. -->

<!-- Parent.vue -->
<template>
  <Child @clicked="handleClick" />
</template>

<script>
import Child from './Child.vue';

export default {
  components: { Child },
  methods: {
    handleClick() {
      console.log('Clicked');
    },
  },
};
</script>

<!-- Child.vue -->
<template>
  <button @click="$emit('clicked')">Click Me</button>
</template>