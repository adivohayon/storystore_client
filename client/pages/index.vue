<template>
	<div id="page">
		<!-- <no-ssr> -->
		<!-- <div
				v-if="shelves && shelves.length > 0"
				ref="feed"
				class="feed"
				@touchstart="handleTouchStart"
				@touchend="handleTouchEnd"
			> -->
		<page-header></page-header>
		<feed v-if="hasShelves" :shelves="shelves"></feed>
		<!-- </div> -->
		<div v-else>No shelves available or store not available</div>
		<!-- </no-ssr> -->
		<checkout-response></checkout-response>
	</div>
</template>

<script>
import Feed from '@/components/feed';
import PageHeader from '@/components/page-header';
// import Navigation from '@/components/navigation';
import CheckoutResponse from '@/components/checkout-response';
import { getCategories, getShelves } from '@/services/api.service';
import '@/icons';
import { mapState } from 'vuex';
import ScrollSnap from 'scroll-snap';
import { pageHeadMixin } from '@/helpers/mixins';
export default {
	components: { Feed, PageHeader, CheckoutResponse },
	layout(ctx) {
		return ctx.app.isMobile ? 'mobile' : 'desktop';
	},
	mixins: [pageHeadMixin],
	data() {
		return {
			assetsPerLoad: 2,
			shelvesPerLoad: 2,
			activeShelfIndex: 0,
			isBuilding: false,
			firstUpdate: true,
			feedOptions: {
				sectionSelector: 'section',
				excludedClasses: ['att'],
				scrollDirection: 'down',
			},
			prevClientY: null,
			clientHeight: null,
			snapObject: null,
		};
	},
	computed: {
		hasShelves() {
			return (
				this.$store.state.store.shelves &&
				this.$store.state.store.shelves.length > 0
			);
		},
		...mapState({
			shelves: state => state.store.shelves,
		}),
	},
	watch: {},
	created() {},
	async mounted() {
		// window.ScreenOrientation.lock('portrait');
		// this.$store.commit('toggleLoader');
	},
	methods: {},
};
</script>

<style src="./sass/index.scss" lang="scss"></style>
