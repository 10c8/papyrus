<script>
  import { Route } from 'svelte-router-spa';

  export let currentRoute;
</script>

<main class="min-h-screen">
  <Route {currentRoute} />
</main>

<style lang="postcss" scoped>
</style>
