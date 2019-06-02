import _get from 'lodash/get';
import { createFacebookPixelCode } from '@/helpers/analytics.helpers';
import { Analytics } from './../services/analytics.service';
export const pageHeadMixin = {
	head() {
		const storeSlug = this.$store.state.store.slug;
		const faviconPath =
			process.env.staticDir + storeSlug + `/${storeSlug}_favicon.png`;
		// const
		const script = [],
			noscript = [];

		const gtmId = 'GTM-TQKQL2Z';
		const googleAnalyticsScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer','${gtmId}');`;

		if (googleAnalyticsScript) {
			script.push({ innerHTML: googleAnalyticsScript });
			// noscript.push({ innerHTML: analytics.noScript });
		}
		const facebookPixelId = _get(
			this.$store.state,
			'store.info.facebookPixelId',
			null
		);
		// console.log('')
		if (facebookPixelId) {
			const {
				script: fbScriptCode,
				noscript: fbNoscriptCode,
			} = createFacebookPixelCode(facebookPixelId);
			script.push({ innerHTML: fbScriptCode });
			noscript.push({ innerHTML: fbNoscriptCode });
		}

		return {
			title:
				this.$store.state.store.name + ' - ' + this.$store.state.store.tagline,
			link: [{ rel: 'icon', href: faviconPath }],
			meta: [
				{ name: 'viewport', content: 'width=device-width, user-scalable=no' },
				{ name: 'screen-orientation', content: 'autoRotate:disabled' },
			],
			script,
			noscript,
			__dangerouslyDisableSanitizers: ['noscript', 'script'],
		};
	},
};

export const checkoutMixin = {
	computed: {},
};
