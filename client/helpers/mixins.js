import _get from 'lodash/get';
import { createFacebookPixelCode } from '@/helpers/analytics.helpers';

export const pageHeadMixin = {
	head() {
		const storeSlug = this.$store.state.store.slug;
		const faviconPath =
			process.env.staticDir + storeSlug + `/${storeSlug}_favicon.png`;
		// const
		const script = [],
			noscript = [];

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
