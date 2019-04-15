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
		<feed v-if="shelves && shelves.length > 0">
			<shelf
				v-for="(shelf, shelfIndex) in shelves"
				:id="`section-${shelfIndex}`"
				:key="shelfIndex"
				:shelf="shelf"
				:shelf-index="shelfIndex"
			></shelf>
		</feed>
		<!-- </div> -->
		<div v-else>No shelves available or store not available</div>
		<!-- </no-ssr> -->
		<checkout-response></checkout-response>
	</div>
</template>

<script>
import Feed from '@/components/feed';
import Shelf from '@/components/shelf';
import Navigation from '@/components/navigation';
import CheckoutResponse from '@/components/checkout-response';
import { getCategories, getShelves } from '@/services/api.service';
import '@/icons';
import { mapState } from 'vuex';
import _get from 'lodash/get';
import _debounce from 'lodash.debounce';
import _throttle from 'lodash.throttle';
import _defer from 'lodash.defer';
import ScrollSnap from 'scroll-snap';
import { pageHeadMixin } from '@/helpers/mixins';
export default {
	components: { Feed, Shelf, Navigation, CheckoutResponse },
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
			storeId: state => state.store.storeId,
			shelvesOffset: state => state.store.pagination.offset,
		}),
		storeSlug() {
			return _get(this.$store.state, 'store.slug', null);
		},
		assetsPath() {
			if (this.storeSlug) {
				let path = process.env.staticDir ? process.env.staticDir : '/';
				path += `${this.storeSlug}/`;
				return path;
			}
		},
	},
	watch: {},
	created() {},
	updated() {
		this.handleFirstUpdate();
	},
	async mounted() {
		this.$store.commit('toggleLoader');
		await this.loadAssets();
		// const snapPthis.$refs.feed

		// this.clientHeight = window.innerHeight;

		// this.scrollTo('section-3');
		// setTimeout(() => {
		// 	document.getElementById('section-3').scrollIntoView({
		// 		block: 'start',
		// 		inline: 'nearest',
		// 		behavior: 'smooth',
		// 	});
		// }, 1000);
	},
	beforeDestroy() {},
	destroyed() {},
	methods: {
		scrollTo(elementId) {
			//TODO: check if elementID exists before scrolling
			const element = document.getElementById(elementId);
			setTimeout(() => {
				console.log('scrolling to', element);
				// document.getElementById(elementId).scrollTo(0, 1000);
				element.scrollIntoView({
					block: 'start',
					inline: 'nearest',
					behavior: 'smooth',
				});
			}, 30);
		},
		handleTouchStart(e) {
			// console.log('start touch / clientY', e.touches[0].clientY);
			this.prevClientY = e.touches[0].clientY;
			// console.log('start touch / pageY', e.touches[0].pageY);
			// console.log('start touch / screenY', e.touches[0].screenY);

			// disable UI
		},
		handleTouchEnd(e) {
			const currentClientY = e.changedTouches[0].clientY;
			const scrolledDown = currentClientY < this.prevClientY;
			// console.log('touchend / event', e.changedTouches[0]);
			console.log('currentClientY', currentClientY);
			// console.log('end touch / pageY', e.changedTouches[0].pageY);
			// console.log('end touch / screenY', e.changedTouches[0].screenY);
			let touchedSection;
			for (const path of e.path) {
				// if it's in the ecluded list do nothing
				if (this.feedOptions.excludedClasses.includes(path.className)) {
					console.log('touchend / clicked an excluded selector', path.id);
					return;
				}

				// what's the touched section's id
				if (path.id && path.id.startsWith(this.feedOptions.sectionSelector)) {
					touchedSection = path.id;
				}
			}

			console.log('fullheight', this.clientHeight);
			if (touchedSection) {
				if (currentClientY > this.clientHeight > 2)
					this.scrollTo(touchedSection);
			}
			// console.log('touch end', touchedSection);
			//re-enable UI
		},
		async handleShelfLeave(origin, destination) {
			console.log('origin', origin.index);
			console.log('destination', destination.index);
			try {
				// Handle query for each shelf
				this.activeShelfIndex = destination.index;
				this.$router.push({
					path: this.$route.path,
					query: {
						...this.$route.query,
						shelfIndex: this.activeShelfIndex + 1,
					},
				});

				// Track content for analytics
				const currentShelf = this.shelves[this.activeShelfIndex];
				this.trackViewContent(currentShelf);

				console.log('this.shelvesOffset', this.shelvesOffset);
				// Do we need to load more shelves?
				if (
					destination.index > 0 &&
					destination.index > Math.abs(this.shelvesOffset - 3)
				) {
					if (destination.isLast) {
						this.$store.commit('toggleLoader');
					}

					console.log('START LOADING SHELVES');
					await this.$store.dispatch('store/getShelves', {
						storeId: this.storeId,
						offset: this.shelvesOffset,
					});
					// this.$emit('rebuild-fullpage', { shelfIndex: this.shelfIndex });
					await this.loadAssets();

					console.log('DONE LOADING SHELVES');
				}
			} catch (err) {}
		},
		handleShelfLoaded(origin, destination) {
			console.log('Shelf Loaded', { origin, destination });
		},
		handleFirstUpdate() {
			if (this.firstUpdate) {
				const queryShelfIndex = this.$route.query.shelfIndex;
				if (queryShelfIndex > 1) {
					// fullpage_api.moveTo(queryShelfIndex);
				} else {
					this.$router.push({
						path: this.$route.path,
						query: {
							shelfIndex: this.activeShelfIndex + 1,
							...this.$route.query,
						},
					});
					this.trackViewContent(this.shelves[0]);
				}
				this.firstUpdate = false;
			}
		},
		trackViewContent(shelf) {
			// console.log('fbq', fbq);
			if (typeof fbq !== 'undefined' && fbq && shelf) {
				const ViewContentValues = {
					content_category: this.storeSlug,
					content_ids: [shelf.id],
					content_name: shelf.name,
					content_type: 'product',
					contents: [{ id: shelf.id, quantity: 1 }],
					currency: shelf.variations[0].currency,
					value: shelf.variations[0].finalPrice,
				};
				console.log('ViewContent', ViewContentValues);
				fbq('track', 'ViewContent', ViewContentValues);
			}
		},
		loadAssets() {
			return new Promise(async (resolve, reject) => {
				try {
					const numberOfAssetsOnFirstRun = 2;

					const firstRunAssets = this.shelves.reduce(
						(assetsToLoad, shelf, shelfIndex) => {
							assetsToLoad.push(
								...shelf.variations[0].assets
									.filter(asset => !asset.loaded)
									.slice(0, numberOfAssetsOnFirstRun)
									.map((asset, assetIndex) => ({
										...asset,
										shelfIndex,
										index: assetIndex,
									}))
							);
							return assetsToLoad;
						},
						[]
					);

					console.log(
						'Loading initial assets - # of assets ',
						firstRunAssets.length
					);

					for (const [assetIndex, asset] of firstRunAssets.entries()) {
						await this.imageLoadedPromise(asset);
					}
					this.$store.commit('toggleLoader', false);

					const restOfAssets = this.shelves.reduce(
						(assetsToLoad, shelf, shelfIndex) => {
							assetsToLoad.push(
								...shelf.variations[0].assets
									.filter(asset => !asset.loaded)
									.map((asset, assetIndex) => ({
										...asset,
										shelfIndex,
										index: assetIndex + numberOfAssetsOnFirstRun,
									}))
							);
							return assetsToLoad;
						},
						[]
					);

					console.log(
						'Loading rest of assets - # of assets ',
						restOfAssets.length
					);
					for (const [assetIndex, asset] of restOfAssets.entries()) {
						await this.imageLoadedPromise(asset);
					}
					console.log('All assets loaded');
					resolve();
				} catch (err) {
					console.error('load images failed', err);
					reject(err);
				}
			});
		},
		imageLoadedPromise(asset) {
			return new Promise((resolve, reject) => {
				const image = new Image();
				image.src = this.assetsPath + asset.src;
				image.onload = e => {
					this.$store.commit('store/updateShelfAssetLoaded', {
						shelfIndex: asset.shelfIndex,
						variationIndex: 0,
						assetIndex: asset.index,
						loaded: true,
					});
					resolve(e);
				};
			});
		},
	},
};
</script>

<style src="./sass/index.scss" lang="scss"></style>
