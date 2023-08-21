import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dsv from '@rollup/plugin-dsv';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import json from "@rollup/plugin-json";
import css from 'rollup-plugin-css-only';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy-merge';

import config from './config.json';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		production && del({ targets: 'public/build/*' }),

		copy({
			targets: [
			  { src: ['src/css/global-base.css'], file: 'public/global.css' },
			]
		}),
		// Allow for importing csv files as modules
		dsv(),
		// And importing json files
		json(),

		svelte({
			// enable run-time checks when not in production
			compilerOptions: {
				dev: !production,
				hydratable: config.hydrate
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()

	],
	watch: {
		clearScreen: false
	}
};

// function serve() {
// 	let server;

// 	function toExit() {
// 	  	if (server) {
// 			try {
// 				require('child_process').spawn("kill", ["--", `-${server.pid}`]);
// 			  } catch (error) {
// 				console.log(error.message);
// 				server.kill();
// 			  }
// 		}
// 	}
  
// 	return {
// 	  writeBundle() {
// 		if (server) return;
  
// 		server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
// 		  stdio: ['ignore', 'inherit', 'inherit'],
// 		  detached: true,
// 		});
  
// 		process.on('SIGTERM', toExit);
// 		process.on('exit', toExit);
// 	  },
// 	  closeWatcher: toExit,
// 	};
// }

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
