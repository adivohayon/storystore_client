const fs = require('fs');
const path = require('path');
const pkg = require('./package');
const secrets = require('./server/secrets.json');
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';
console.log('process.env.NODE_ENV ', process.env.NODE_ENV);
module.exports = {
	mode: 'universal',
	server: {
		port: 3000, // default: 3000
		host: '0.0.0.0', // default: localhost
		// https: {
		// 	key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
		// 	cert: fs.readFileSync(path.resolve(__dirname, 'server.crt')),
		// },
	},
	head: {
		title: pkg.name,
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1, minimal-ui',
			},
			{ hid: 'description', name: 'description', content: pkg.description },
		],

		//link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
	},

	/*
	 ** Customize the progress-bar color
	 */
	loading: { color: '#fff' },

	router: {
		base: '/',
		middleware: [],
	},
	serverMiddleware: ['~/api/mailer.js'],
	/*
	 ** Global CSS
	 */
	css: [
		// '@/sass/breakpoints.mixin.scss',
		{ src: 'swiper/dist/css/swiper.min.css', lang: 'css' },
		{ src: 'video.js/dist/video-js.css', lang: 'css' },
		{ src: '~assets/fonts/fonts.css', lang: 'css' },
	],

	/*
	 ** Plugins to load before mounting the App
	 */
	// plugins: [],
	plugins: [
		{ src: '~/plugins/is-mobile', ssr: true },
		{ src: '~/plugins/swiper', ssr: false },
		{ src: '~/plugins/vuex-persist', ssr: false },
		{ src: '~/plugins/fullpage', ssr: false },
		{ src: '~/plugins/v-selectmenu', ssr: false },
		{ src: '~/plugins/svg', ssr: true },
		{ src: '~/plugins/v-touch', ssr: false },
		{ src: '~/plugins/vue-video-player', ssr: true },
		{ src: '~/plugins/vue-scrollto', ssr: true },
		{ src: '~/plugins/vuelidate', ssr: true },
	],

	/*
	 ** Nuxt.js modules
	 */
	modules: [
		// Doc: https://github.com/nuxt-community/axios-module#usage
		'@nuxtjs/google-analytics',
		'@nuxtjs/axios',
	],
	googleAnalytics: {
		id: 'UA-134688384-1',
	},
	/*
	 ** Axios module configuration
	 */
	axios: {
		https: process.env.API_HOST === '127.0.0.1' ? false : true,
		baseURL:
			process.env.API_HOST === '127.0.0.1'
				? 'http://127.0.0.1:4000/'
				: 'https://api.storystore.co.il/',
		// See https://github.com/nuxt-community/axios-module#options
	},

	/*
	 ** Build configuration
	 */
	env: {
		staticDir:
			process.env.NODE_ENV === 'development'
				? '/'
				: '//assets.storystore.co.il/',
		devStore: process.env.DEV_STORE,
	},

	build: {
		// vendor: ['~/node_modules--mod/vue-glide-js'],
		publicPath: `/${secrets.NODE_ENV}/_nuxt/`,
		// vendor: ['vue-glide-js'],
		/*
		 ** You can extend webpack config here
		 */
		extend(config, ctx) {
			// Run ESLint on save
			// const staticDir = ctx.isDev ? '/assets/' : 'cdn.shop-together.io/assets/',
			// config.env.staticDir = staticDir;
			if (ctx.isDev && ctx.isClient) {
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/,
				});
			}

			if (!ctx.isDev) {
				config.externals = {
					static: '~/static',
				};
				// config.module.rules.push({
				// 	test: /\.(ico|jpg|png|gif|mp4)(\?.*)?$/,

				// })
			}
			// if (ctx.isClient) {
			// 	console.log('config', config);
			// 	config.build.assetsPublicPath = '/';
			// }
		},
	},
	srcDir: 'client/',
	performance: {
		gzip: false,
	},
	dev: false,
};
