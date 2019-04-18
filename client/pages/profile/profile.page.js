import '@/icons';
import { mapState } from 'vuex';
// import axios from 'axios';
import { getSlugFromHost } from '@/helpers/async-data.helpers';
export default {
	async asyncData({ req, $axios, store }) {
		const host = process.server ? req.headers.host : window.location.hostname;
		console.log('host', host);
		const storeSlug = getSlugFromHost(host);
		let url = 'stores/' + storeSlug + `/texts`;
		store.commit('toggleLoader', false);
		console.log('storeSlug', storeSlug);
		// this.$axios.setHeader('Access-Control-Allow-Origins', '*');
		// let path = '//assets.storystore.co.il/';
		try {
			const { policy, customerService } = await $axios.$get(url);
			return {
				storeSlug,
				policy,
				customerServiceTxt: customerService,
			};
		} catch (err) {
			console.log(
				'Failed to get policy and customer service texts files. ',
				err.message
			);
			return { storeSlug, policy: '', customerService: '' };
		}
		// const policy = 'a';
		// console.log('policy', policy);
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
		customerService() {
			if (this.customerServiceTxt && customerServiceTxt.length > 0) {
				return this.customerServiceTxt;
			} else {
				let txt = `<h4>${this.storeName}<h4>\n`;
				const info = this.$store.state.store.info;
				if (info) {
					if (info.address) {
						txt += `${info.address} <br>`;
					}
					if (info.phone) {
						txt += `${info.phone} <br>`;
					}
					if (info.email) {
						txt += `${info.email} <br>`;
					}
					if (info.address) {
						txt += `${info.address} <br>`;
					}
					if (info.openingHours) {
						txt += `${info.openingHours} <br>`;
					}
				}
				return txt;
			}
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
		returns() {
			return this.$store.state.store.returns;
		},
		profileContent() {
			return [this.about, this.policy, this.customerService];
		},
		...mapState({
			storeName: state => state.store.name,
			returns: state => state.store.returns,
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
