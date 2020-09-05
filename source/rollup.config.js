import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete'

const production = !process.env.ROLLUP_WATCH;

function onwarn(warning, handler) {
	if (warning.pluginCode === 'a11y-no-onchange') return // onchange listener needed for rendering component preview
	// let Rollup handle all other warnings normally
	handler(warning);
}

const preprocess = sveltePreprocess({
  preserve: ['systemjs-importmap'],
  postcss: {
    plugins: [
      require('postcss-nested'),
      require('tailwindcss')('./tailwind.config.js'),
    ],
  },
})

const buildDirectory = '../app/assets/'

function serve() {
	let server;
	
	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default [{
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		name: 'app',
		// format: 'iife',
		// file: buildDirectory+'build/bundle.js',
    format: 'es',
    dir: buildDirectory + 'build'
	},
	plugins: [
    svelte({ preprocess, customElement: true, include: /\.wc\.svelte$/ }),
		svelte({
      customElement: false,
      exclude: /\.wc\.svelte$/,
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write(buildDirectory+'build/bundle.css');
			},
			preprocess,
		}),
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({ sourceMap: !production }),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload(buildDirectory),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	onwarn,
	watch: {
		clearScreen: false
	}
}, 
{
	input: 'src/preview.ts',
	output: {
		sourcemap: true,
		name: 'preview',
    format: 'es',
    dir: buildDirectory + 'preview',
		// format: 'iife',
		// file: buildDirectory+'preview/bundle.js',
	},
	plugins: [
		del({ targets: 'public/build' }),
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write(buildDirectory+'preview/bundle.css');
			},
			preprocess,
		}),
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({ sourceMap: !production }),
		production && terser()
	],
	onwarn,
	watch: {
		clearScreen: false
	}
}];
