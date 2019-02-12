import '@/icons';
import { mapState } from 'vuex';
// import axios from 'axios';
export default {
	async asyncData({ req, $axios }) {
		const hostsParts = req.headers.host.split('.');
		const isDomain = hostsParts.findIndex(item => item === 'storystore') > -1;

		const storeSlug = isDomain ? hostsParts[0] : process.env.DEV_STORE;

		// let path = '//assets.storystore.co.il/';
		let url = '/cdn/' + storeSlug + `/${storeSlug}_policy.txt`;
		console.log('url', url);
		const policy = await $axios.$get(url);

		return {
			policy,
		};
	},
	props: {},
	data() {
		return {
			profileTabs: ['אודות', 'תקנון', 'שירות לקוחות'],
			// profileContent: ['1', '2', '3'],
			selectedTabIndex: 0,
		};
	},
	computed: {
		storeSlug() {
			return this.$store.state.store.slug;
		},
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
			return [this.about, 'aaaa', 'bbbb'];
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
