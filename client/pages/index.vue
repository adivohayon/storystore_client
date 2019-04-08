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
				// onLeave: _debounce(async (origin, destination) => {
				// 	this.activeShelfIndex = destination.index;
				// 	this.$store.dispatch('toggleHiddenLoader', true);
				// }, 30),
				// afterLoad: (origin, destination) => {
				// 	this.$store.dispatch('toggleHiddenLoader', false);
				// 	console.log('afterLoad');
				// },
				onLeave: _debounce(async (origin, destination) => {
					this.activeShelfIndex = destination.index;
					this.$router.push({
						path: this.$route.path,
						query: {
							...this.$route.query,
							shelfIndex: this.activeShelfIndex + 1,
						},
					});

					const currentShelf = this.shelves[this.activeShelfIndex];
					this.trackViewContent(currentShelf);
					// this.$store.dispatch('toggleHiddenLoader', true);
				}, 100),
				// afterLoad: (origin, destination) => {
				// 	this.$store.dispatch('toggleHiddenLoader', false);
				// 	console.log('afterLoad');
				// },
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
	watch: {
		// activeShelfIndex:
		// activeShelfIndex: async function(index) {
		// 	console.log(index, this.shelvesOffset - 3);
		// 	if (index > 0 && index > this.shelvesOffset - 3) {
		// 		try {
		// 			console.log('START LOADING SHELVES');
		// 			await this.$store.dispatch('store/getShelves', {
		// 				storeId: this.storeId,
		// 				offset: this.shelvesOffset,
		// 			});
		// 			// this.$emit('rebuild-fullpage', { shelfIndex: this.shelfIndex });
		// 			await this.rebuildFullpage({});
		// 			await this.loadImages();
		// 			console.log('DONE LOADING SHELVES');
		// 		} catch (err) {}
		// 	}
		// },
	},
	created() {
		console.log('created');
	},
	updated() {
		if (this.firstUpdate) {
			console.log('updated');
			const queryShelfIndex = this.$route.query.shelfIndex;
			if (queryShelfIndex > 1) {
				console.log('aaaaaa');
				fullpage_api.moveTo(queryShelfIndex);
			} else {
				// console.log('this.$route.query,', this.$route.query);
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
	async mounted() {
		console.log('mounted');
		// this.$refs.fullpage.
		this.$store.commit('toggleLoader');
		await this.loadImages();
		// const shelfSelector = 'div.shelf.fp-section';
		// const translateFromStr = str => {
		// 	const lookupWord = 'translate3d(';

		// 	const lookupIndex = str.lastIndexOf(lookupWord);

		// 	return lookupIndex > -1
		// 		? str
		// 				.substring(lookupIndex + lookupWord.length, str.length - 2)
		// 				.split('px, ', 2)
		// 				.map(v => Number(v))
		// 		: [0, 0];
		// };
		// // this.$store.dispatch('toggleHiddenLoader', true);
		// const bodyHeight = document.body.offsetHeight;
		// const bodyWidth = document.body.offsetWidth;
		// console.log('bodyWidth', bodyWidth);
		// const mutationObserver = new MutationObserver(
		// 	_debounce(
		// 		mutations => {
		// 			console.log('mutation', mutations);
		// 			const [xTranslate, yTranslate] = translateFromStr(
		// 				mutations[0].oldValue
		// 			);
		// 			const isVertical = mutations[0].target.id === 'fullpage';
		// 			const translate = isVertical ? yTranslate : xTranslate;
		// 			const comparator = isVertical
		// 				? document.body.offsetHeight
		// 				: document.body.offsetWidth;
		// 			console.log('isVertical', isVertical, translate);

		// 			if (translate === 0) {
		// 				console.log('DISABLE UI');
		// 				this.$store.dispatch('toggleHiddenLoader', true);
		// 				return;
		// 			}

		// 			if (
		// 				(translate + 1) % comparator === 0 ||
		// 				(translate - 1) % comparator === 0
		// 			) {
		// 				console.log('ENABLE UI');
		// 				this.$store.dispatch('toggleHiddenLoader', false);
		// 			} else {
		// 				this.$store.dispatch('toggleHiddenLoader', true);
		// 				console.log('DISABLE UI');
		// 			}
		// 		},
		// 		230,
		// 		{ leading: true }
		// 	)
		// );
		// // console.log('body.offsetHeight', document.body.offsetHeight);
		// mutationObserver.observe(this.$refs.fullpage.$el, {
		// 	attributes: true,
		// 	characterData: true,
		// 	attributeOldValue: true,
		// 	characterDataOldValue: true,
		// 	attributeFilter: ['style'],
		// });

		// // need to update this to the current active shelf
		// mutationObserver.observe(
		// 	document.querySelector('.shelf.active .fp-slidesContainer'),
		// 	{
		// 		attributes: true,
		// 		characterData: true,
		// 		attributeOldValue: true,
		// 		characterDataOldValue: true,
		// 		attributeFilter: ['style'],
		// 	}
		// );

		// const activeSlideElement
		// document.addEventListener(
		// 	'touchend',
		// 	e => {
		// 		const disableFullpageEl =
		// 			!e.path[0].className.includes('btn') ||
		// 			e.path[3].className === 'attribute-picker';

		// 		if (!disableFullpageEl && !this.isBuilding) {
		// 			this.$store.dispatch('toggleHiddenLoader', false);
		// 			console.log('turn off');
		// 		}
		// 	},
		// 	false
		// );
		// this.$store.commit('toggleLoader');

		// this.$emit('rebuild-fullpage', { shelfIndex: this.shelfIndex });
	},
	beforeDestroy() {
		// this.feedOptions.dragAndMove = false;
	},
	destroyed() {
		// console.log('destroy', fullpage_api);
		// fullpage_api.destroy('all');
	},
	methods: {
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
		loadImages() {
			return new Promise(async (resolve, reject) => {
				console.log('load images');
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

					for (const [assetIndex, asset] of restOfAssets.entries()) {
						await this.imageLoadedPromise(asset);
					}
					console.log('load images done');
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
		rebuildFullpage({ activeSectionIndex = -1, activeSlideIndex = -1 }) {
			// console.log('test', activeSectionIndex);
			// if (!activeSe)
			return new Promise((resolve, reject) => {
				try {
					this.isBuilding = true;
					// this.$store.dispatch('toggleHiddenLoader');
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
					// if (activeSlideIndex === -1 && activeSlide === -1) {
					// 	activeSlideIndex = activeSlide ? fp_utils.index(activeSlide) : 0;
					// }

					console.log('activeSectionIndex', activeSectionIndex);
					console.log('activeSlideIndex', activeSlideIndex);
					// console.log('sectionSelector', sectionSelector);

					// Destroy
					this.$refs.fullpage.destroy();

					// console.log('activeSectionIndex', activeSectionIndex);
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
					// this.$store.dispatch('toggleHiddenLoader');
					setTimeout(() => {
						console.log('DONE rebuildFullpage');
						this.isBuilding = false;
						resolve();
					}, 1000);
				} catch (err) {
					console.error(err);
					reject(err);
				}
			});

			// setTimeout(() => {
			// 	console.log('doing init');
			// 	this.$refs.fullpage.init();
			// }, 1500);

			// 	const prevIndex = this.activeShelfIndex;
			// 	console.log('activeShelfIndex', this.activeShelfIndex);
			// 	setTimeout(() => {
			// 		console.log('building fullpage');
			// 		// this.$refs.fullpage.build();
			// 		this.$refs.fullpage.destroy();
			// 		// this.$refs.fullpage.init();
			// 		this.$refs.fullpage.silentMoveTo(prevIndex, 0);
			// 		// console.log('test', this.$refs.fullpage);
			// 	}, 50);
		},
	},
};
</script>

<style src="./sass/index.scss" lang="scss"></style>
