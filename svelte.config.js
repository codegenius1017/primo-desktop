import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
    postcss: true
  }),



	kit: {
    ssr: false,
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
    vite: {
      server: {
        open: false, // do not open the browser as we use electron
        port: process.env.PORT || 3333,
      },
      build: {
        sourcemap: true,
        outDir: 'public'
      }
    }
	}
};

export default config;
