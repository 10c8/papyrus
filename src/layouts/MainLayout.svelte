<script>
  import { Route } from 'svelte-router-spa';

  export let currentRoute;
</script>

<main class="layout">
  <Route {currentRoute} />
</main>

<style lang="scss" scoped>
  .layout {
    min-height: 100vh;
  }
</style>
