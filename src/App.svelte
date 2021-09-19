<script>
  import Router, { location, replace } from 'svelte-spa-router';

  import Home from './routes/Home.svelte';
  import NotFound from './routes/NotFound.svelte';

  const routes = {
    '/': Home,

    // 404
    '*': NotFound
  };

  const path = window.location.pathname.replace(/^\//, '');

  if (window.location.hash === '') {
    window.location.href = `/#/${path}`;
  }
</script>

<main>
  <Router {routes} />
</main>
