<!-- Vue provides watch and watchEffect to react to changes in data, similar to useEffect. -->

<!-- Example: Using watch -->

<script setup>
import { ref, watch } from 'vue';

const count = ref(0);

watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});
</script>


<!-- Example: Using watchEffect -->

<script setup>
import { ref, watchEffect } from 'vue';

const count = ref(0);

watchEffect(() => {
  console.log(`Count is now ${count.value}`);
});
</script>
