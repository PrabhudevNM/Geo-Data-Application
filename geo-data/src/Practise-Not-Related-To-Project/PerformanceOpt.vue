<!-- Uses React.memo, useMemo, and useCallback for performance optimization. -->


<!-- *Reactive reactivity system minimizes unnecessary re-renders.

*Provides computed properties (similar to useMemo) for derived state. -->


<script>
import { ref, computed } from 'vue';

export default {
  setup() {
    const count = ref(0);
    const doubleCount = computed(() => count.value * 2);

    return { count, doubleCount };
  },
};
</script>
