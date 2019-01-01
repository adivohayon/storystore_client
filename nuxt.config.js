const pkg = require('./package');
const secrets = require('./server/secrets.json');
console.log('process.env.NODE_ENV ', process.env.NODE_ENV);
module.exports = {
	mode: 'universal',
	server: {
		port: 3000, // default: 3000
		host: '0.0.0.0', // default: localhost
	},
	head: {
		title: pkg.name,
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
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

	/*
  ** Global CSS
  */
	css: [
		// '@/sass/breakpoints.mixin.scss',
		{ src: 'swiper/dist/css/swiper.min.css', lang: 'css' },
	],

	/*
  ** Plugins to load before mounting the App
  */
	// plugins: [],
	plugins: [
		{ src: '~/plugins/swiper', ssr: false },
		{ src: '~/plugins/vuex-persist', ssr: false },
		{ src: '~/plugins/fullpage', ssr: false },
	],

	/*
  ** Nuxt.js modules
  */
	modules: [
		// Doc: https://github.com/nuxt-community/axios-module#usage
		'@nuxtjs/axios',
	],
	/*
  ** Axios module configuration
  */
	axios: {
		// See https://github.com/nuxt-community/axios-module#options
	},

	/*
  ** Build configuration
  */
	env: {
		staticDir:
			process.env.NODE_ENV === 'development'
				? '/assets/'
				: '//cdn.shop-together.io/assets/',
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
