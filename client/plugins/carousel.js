// import Vue from 'vue';
// import VueCarousel from 'vue-carousel';
// Vue.use(VueCarousel);

// import Vue from 'vue';
// import Siema from 'vue2-siema';

// Vue.use(Siema);

import Vue from 'vue';
import { Hooper, Slide, Pagination } from 'hooper';
import 'hooper/dist/hooper.css';
Vue.component('hooper', Hooper);
Vue.component('slide', Slide);
Vue.component('hooper-pagination', Pagination);
