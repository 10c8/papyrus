import MainLayout from '@/layouts/MainLayout.svelte';
import Home from '@/views/Home.svelte';
import Sheet from '@/views/Sheet.svelte';

export const routes = [
  {
    name: '/',
    layout: MainLayout,
    component: Home
  },
  {
    name: '/:id',
    layout: MainLayout,
    component: Sheet
  }
];
