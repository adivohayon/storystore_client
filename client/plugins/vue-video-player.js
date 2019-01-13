// If used in nuxt.js/ssr, you should keep it only in browser build environment
import Vue from 'vue';
if (process.browser) {
	const VueVideoPlayer = require('vue-video-player/dist/ssr');
	Vue.use(VueVideoPlayer);
}
