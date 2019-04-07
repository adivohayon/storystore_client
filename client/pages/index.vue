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

export default {
	components: { Feed, Shelf, Navigation, CheckoutResponse },
	layout(ctx) {
		return ctx.app.isMobile ? 'mobile' : 'desktop';
	},
	head() {
		const storeSlug = this.$store.state.store.slug;
		const faviconPath =
			process.env.staticDir + storeSlug + `/${storeSlug}_favicon.png`;

		return {
			title:
				this.$store.state.store.name + ' - ' + this.$store.state.store.tagline,
			link: [{ rel: 'icon', href: faviconPath }],
		};
	},
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
				onLeave: _debounce(async (origin, destination) => {
					this.activeShelfIndex = destination.index;
				}, 1000),
			},
			runOnce: false,
			orderQuery: null,
			assetsPerLoad: 2,
			shelvesPerLoad: 2,
			activeShelfIndex: 0,
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
		activeShelfIndex: async function(index) {
			console.log(index, this.shelvesOffset - 3);
			if (index > 0 && index > this.shelvesOffset - 3) {
				try {
					console.log('START LOADING SHELVES');
					await this.$store.dispatch('store/getShelves', {
						storeId: this.storeId,
						offset: this.shelvesOffset,
					});
					// this.$emit('rebuild-fullpage', { shelfIndex: this.shelfIndex });
					await this.rebuildFullpage({});

					await this.loadImages();

					console.log('DONE LOADING SHELVES');
				} catch (err) {}
			}
		},
	},
	created() {},
	async mounted() {
		this.$store.commit('toggleLoader');
		await this.loadImages();

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
							document.querySelectorAll(`${sectionSelector} ${slideSelector}`)[
								activeSlideIndex
							],
							'active'
						);
					}

					this.$refs.fullpage.init();
					console.log('DONE rebuildFullpage');
					resolve();
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
