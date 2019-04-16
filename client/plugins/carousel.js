// import Vue from 'vue';
// import VueCarousel from 'vue-carousel';
// Vue.use(VueCarousel);

// import Vue from 'vue';
// import Siema from 'vue2-siema';

// Vue.use(Siema);

// import Vue from 'vue';
// import { Hooper, Slide, Pagination } from 'hooper';
// import 'hooper/dist/hooper.css';
// Vue.component('hooper', Hooper);
// Vue.component('slide', Slide);
// Vue.component('hooper-pagination', Pagination);

// import Vue from 'vue';
// import VueGlide from 'vue-glide-js';
// import 'vue-glide-js/dist/vue-glide.css';
// Vue.use(VueGlide);

import Vue from 'vue';
// require styles
import 'swiper/dist/css/swiper.css';

if (process.browser) {
	const VueAwesomeSwiper = require('vue-awesome-swiper/dist/ssr');
	Vue.use(VueAwesomeSwiper);
}

/* { default global options } */
