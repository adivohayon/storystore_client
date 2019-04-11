<template>
	<div id="page" :class="fixerClass">
		<no-ssr>
			<full-page
				v-if="shelves && shelves.length > 0"
				id="fullpage"
				ref="fullpage"
				:options="feedOptions"
			>
				<shelf
					v-for="(shelf, shelfIndex) in shelves"
					:key="shelfIndex"
					:shelf="shelf"
					:shelf-index="shelfIndex"
					@rebuild-fullpage="rebuildFullpage"
				></shelf>
			</full-page>
			<div v-else>No shelves available or store not available</div>
		</no-ssr>
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
import { pageHeadMixin } from '@/helpers/mixins';
export default {
	components: { Feed, Shelf, Navigation, CheckoutResponse },
	layout(ctx) {
		return ctx.app.isMobile ? 'mobile' : 'desktop';
	},
	mixins: [pageHeadMixin],
	data() {
		return {
			isMobile: true,
			fixerClass: '',
			feedOptions: {
				sectionSelector: '.shelf',
				slideSelector: '.slide',
				autoScrolling: true,
				licenseKey: '45154D42-6F8E4ACE-AB31A7B3-11A8CE75',
				dragAndMoveKey: 'c3RvcnlzdG9yZS5jby5pbF9ZSTBaSEpoWjBGdVpFMXZkbVU9YjYy',
				dragAndMove: true,
				controlArrows: false,
				slidesNavigation: true,
				onLeave: _debounce(this.handleShelfLeave, 300),
				// afterLoad: this.handleShelfLoaded,
			},
			runOnce: false,
			orderQuery: null,
			assetsPerLoad: 2,
			shelvesPerLoad: 2,
			activeShelfIndex: 0,
			isBuilding: false,
			firstUpdate: true,
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
	},
	beforeDestroy() {},
	destroyed() {},
	methods: {
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
					await this.rebuildFullpage({ activeSectionIndex: destination.index });

					console.log('DONE LOADING SHELVES');
				}
			} catch (err) {}
		},
		handleShelfLoaded(origin, destination) {
			console.log('Shelf Loaded', { origin, destination });
		},
		rebuildFullpage({ activeSectionIndex = -1, activeSlideIndex = -1 }) {
			return new Promise((resolve, reject) => {
				const numberOfPolls = 5;
				let i = 0;
				console.log(
					'Initial isAnimating',
					fullpage_api.dragAndMove.isAnimating
				);
				const buildFunc = () => {
					console.log('STARTING rebuildFullpage');
					const sectionSelector =
						this.feedOptions.sectionSelector || '.section';

					const slideSelector = this.feedOptions.slideSelector || '.slide';
					let activeSlide = document.querySelector(
						this.feedOptions.sectionSelector +
							'.active ' +
							this.feedOptions.slideSelector +
							'.active'
					);

					// Get activeSectionIndex if none was provided

					if (activeSectionIndex === -1) {
						activeSectionIndex = fp_utils.index(
							document.querySelector(
								this.feedOptions.sectionSelector + '.active'
							)
						);
					}

					if (activeSlideIndex === -1) {
						const activeSlideSelector =
							this.feedOptions.sectionSelector +
							'.active ' +
							this.feedOptions.slideSelector +
							'.active';
						activeSlideIndex = fp_utils.index(
							document.querySelector(activeSlideSelector)
						);
					}
					// Destroy
					this.$refs.fullpage.destroy();

					// Restore active section class
					if (activeSectionIndex > -1) {
						fp_utils.addClass(
							document.querySelectorAll(sectionSelector)[activeSectionIndex],
							'active'
						);
					}

					// Restore active slide class
					if (activeSlideIndex > -1) {
						fp_utils.addClass(
							document.querySelectorAll(
								`${sectionSelector}.active ${slideSelector}`
							)[activeSlideIndex],
							'active'
						);
					}

					this.$refs.fullpage.init();
				};
				const polling = setInterval(() => {
					console.log('isAnimating', fullpage_api.dragAndMove.isAnimating);
					if (i >= numberOfPolls || !fullpage_api.dragAndMove.isAnimating) {
						// this.$refs.fullpage.build();
						// BUILD
						buildFunc();
						clearTimeout(polling);
						resolve();
					}
					i++;
				}, 300);
			});
		},
		handleFirstUpdate() {
			if (this.firstUpdate) {
				const queryShelfIndex = this.$route.query.shelfIndex;
				if (queryShelfIndex > 1) {
					fullpage_api.moveTo(queryShelfIndex);
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
