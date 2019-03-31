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
				// slideSelector: '.shelf-content',
				autoScrolling: true,
				licenseKey: '45154D42-6F8E4ACE-AB31A7B3-11A8CE75',
				dragAndMoveKey: 'c3RvcnlzdG9yZS5jby5pbF9ZSTBaSEpoWjBGdVpFMXZkbVU9YjYy',
				dragAndMove: true,
				controlArrows: false,
				slidesNavigation: true,
				afterLoad: _debounce(async (origin, destination) => {
					this.activeShelfIndex = destination.index;
				}, 100),
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
			console.log(index, this.shelvesOffset - 2);
			if (index > 0 && index === this.shelvesOffset - 2) {
				try {
					this.$store.commit('toggleLoader');
					this.runOnce = false;
					await this.$store.dispatch('store/getShelves', {
						storeId: this.storeId,
						offset: this.shelvesOffset,
					});
					await this.loadImages();
				} catch (err) {}
			}
		},
	},
	created() {},
	mounted() {
		this.$store.commit('toggleLoader');
		this.loadImages();
		setTimeout(() => {
			console.log('activeShelfIndex', this.activeShelfIndex);
		}, 1000);
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
				const shelves = this.shelves;
				try {
					let moreAssetsToLoad = true;
					let currentAssetsOffset = 0;
					let test = -1;

					while (moreAssetsToLoad) {
						// in each loop we load two assets in the first variation of each shelf
						for (const [shelfIndex, shelf] of shelves.entries()) {
							// get assets not yet loaded
							const assets = shelf.variations[0].assets.filter(
								asset => !asset.loaded
							);
							// if not assets left to load, continue
							if (!assets || !assets.length) {
								moreAssetsToLoad = false;
								continue;
							}

							moreAssetsToLoad = true;
							// preload two assets
							for (
								let i = currentAssetsOffset;
								i < currentAssetsOffset + this.assetsPerLoad;
								i++
							) {
								if (assets[i] && assets[i].src) {
									const image = new Image();
									// console.log('image', assets[i].src);
									image.src = this.assetsPath + assets[i].src;
									await this.imageLoadedPromise(image);

									this.$store.commit('store/updateShelfAssetLoaded', {
										shelfIndex,
										variationIndex: 0,
										assetIndex: i,
										loaded: true,
									});
								} else {
									moreAssetsToLoad = false;
									continue;
								}
							}
							// this.$refs.fullpage.destroy('all');

							// if (
							// 	fullpage_api.getActiveSection().index === shelfIndex &&
							// 	currentAssetsOffset < this.assetsPerLoad
							// ) {
							// 	this.$store.commit('toggleLoader');
							// }
						}
						setTimeout(() => {
							if (!this.runOnce) {
								this.$store.commit('toggleLoader');
								this.runOnce = true;
							}
						}, 900);
						console.log('building fullpage');
						this.$refs.fullpage.build();

						console.log('moreAssetsToLoad', moreAssetsToLoad);
						currentAssetsOffset += this.assetsPerLoad;

						resolve();
						// this.$refs.fullpage.build();
						// moreAssetsToLoad = false;
					}
				} catch (err) {
					console.error(err);
					reject(err);
				}
			});
		},
		imageLoadedPromise(imageObj) {
			return new Promise((resolve, reject) => {
				imageObj.onload = e => {
					resolve(e);
				};
			});
		},
		rebuildFullpage({ shelfIndex }) {
			setTimeout(() => {
				console.log('building fullpage - event');
				this.$refs.fullpage.build();
				// this.$refs.fullpage.shelfIndex;
			}, 10);
		},
	},
};
</script>

<style src="./sass/index.scss" lang="scss"></style>
