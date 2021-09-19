import { fileURLToPath } from "url";
import path, { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('snowpack').SnowpackUserConfig } */
export default {
  alias: {
    '@': path.resolve(__dirname, './src')
  },
  mount: {
    src: '/dist',
    public: {
      url: '/',
      static: true
    }
  },
  plugins: [
    '@snowpack/plugin-webpack',
    '@snowpack/plugin-svelte',
    '@snowpack/plugin-sass',
    '@snowpack/plugin-postcss'
  ],
  routes: [
    {
      'match': 'routes',
      'src': '.*',
      'dest': '/index.html'
    }
  ],
  packageOptions: {
    knownEntrypoints: [
      'svelte',
      'svelte/store',
      'rxjs/internal/Observable',
      'rxjs/internal/operators/reduce',
      'rxjs/internal/operators/map',
      'rxjs/internal/operators/filter'
    ]
  },
  devOptions: {
    port: 3000,
    tailwindConfig: './tailwind.config.js'
  },
  buildOptions: {
    /* ... */
  }
};
