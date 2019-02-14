import '@/icons';
import { mapState } from 'vuex';
// import axios from 'axios';
import { getSlugFromHost } from '@/helpers/async-data.helpers';
export default {
	async asyncData({ req, $axios }) {
		const host = process.server ? req.headers.host : window.location.hostname;
		const storeSlug = getSlugFromHost(host);
		let url = 'stores/' + storeSlug + `/texts`;

		// this.$axios.setHeader('Access-Control-Allow-Origins', '*');
		// let path = '//assets.storystore.co.il/';

		const { policy, customerService } = await $axios.$get(url);
		// const policy = 'a';
		// console.log('policy', policy);
		return {
			storeSlug,
			policy,
			customerService,
		};
	},
	props: {},
	data() {
		return {
			profileTabs: ['אודות', 'תקנון', 'שירות לקוחות'],
			// profileContent: ['1', '2', '3'],
			selectedTabIndex: 0,
			policy: '',
		};
	},
	computed: {
		logoSrc() {
			let path = process.env.staticDir ? process.env.staticDir : '/';
			path += `${this.storeSlug}/logo_${this.storeSlug}_dark.png`;
			return path;
		},
		tabContent() {
			return this.profileContent[this.selectedTabIndex];
		},
		shippingDetails() {
			return this.$store.state.store.shippingDetails;
		},
		returnsPolicy() {
			return this.$store.state.store.returnsPolicy;
		},
		profileContent() {
			return [this.about, this.policy, this.customerService];
		},
		...mapState({
			storeName: state => state.store.name,
			returnsPolicy: state => state.store.returnsPolicy,
			tagline: state => state.store.tagline,
			about: state => state.store.about,
			// slug: state => state.store,
		}),
	},
	created() {},
	mounted() {},
	methods: {
		updateSelectedTabIndex(index) {
			this.selectedTabIndex = index;
		},
	},
};
