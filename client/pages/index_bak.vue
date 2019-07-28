<template>
	<div class="page index-page">
		<!-- <no-ssr> -->
		<!-- <div
				v-if="shelves && shelves.length > 0"
				ref="feed"
				class="feed"
				@touchstart="handleTouchStart"
				@touchend="handleTouchEnd"
		>-->
		<!-- <shelf-info
			v-if="showShelfInfo"
			@show-shelf-info="showShelfInfo = true"
		></shelf-info> -->
		<transition name="modal-fade">
			<shelf-info
				v-if="showShelfInfo"
				:info="shelfInfo"
				:returns="returns"
				:shipping="shippingDetails"
			></shelf-info>
		</transition>
		<feed
			v-if="hasShelves"
			:shelves="shelves"
			:class="{ blur: showShelfInfo }"
		></feed>
		<!-- </div> -->
		<div v-else>No shelves available or store not available</div>
		<!-- </no-ssr> -->
		<checkout-response></checkout-response>
	</div>
</template>

<script>
import Feed from '@/components/feed';
import PageHeader from '@/components/page-header';
import ShelfInfo from '@/components/shelf-info';
// import Navigation from '@/components/navigation';
import CheckoutResponse from '@/components/checkout-response';
import { getCategories, getShelves } from '@/services/api.service';
import '@/icons';
import { mapState } from 'vuex';
import ScrollSnap from 'scroll-snap';
import { pageHeadMixin } from '@/helpers/mixins';

export default {
	components: { Feed, PageHeader, CheckoutResponse, ShelfInfo },
	layout(ctx) {
		return ctx.app.isMobile ? 'mobile' : 'desktop';
	},
	mixins: [pageHeadMixin],
	data() {
		return {
			// showShelfInfo: false,
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
		showShelfInfo() {
			return this.$store.state.showShelfInfo;
		},
		shelfInfo() {
			const currentShelfIndex = this.$store.state.currentShelfIndex;
			return this.$store.state.store.shelves[currentShelfIndex].info;
		},
		shippingDetails() {
			return this.$store.state.store.shippingDetails;
		},
		returns() {
			return this.$store.state.store.returns;
		},
		...mapState({
			shelves: state => state.store.shelves,
		}),
	},
	watch: {},
	created() {},
	async mounted() {
		// console.log('analytics')
		// window.ScreenOrientation.lock('portrait');
		// this.$store.commit('toggleLoader');
	},
	methods: {
		onScroll() {
			console.log('yoo');
		},
	},
};
</script>

<style src="./sass/index.scss" lang="scss"></style>
