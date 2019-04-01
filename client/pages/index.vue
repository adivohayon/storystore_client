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
				onLeave: _debounce(async (origin, destination) => {
					this.activeShelfIndex = destination.index;
				}, 10),
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
			if (index > 0 && index === this.shelvesOffset - 3) {
				try {
					// this.$store.commit('toggleLoader');
					// this.runOnce = false;
					console.log('START LOADING SHELVES');
					await this.$store.dispatch('store/getShelves', {
						storeId: this.storeId,
						offset: this.shelvesOffset,
					});
					this.$refs.fullpage.build();
					await this.loadImages();

					// setTimeout(() => {
					// 	this.$refs.fullpage.build();
					// }, 200);
					console.log('DONE LOADING SHELVES');
				} catch (err) {}
			}
		},
	},
	created() {},
	async mounted() {
		this.$store.commit('toggleLoader');
		console.log('load images');
		await this.loadImages();
		console.log('load images done');

		// this.$store.commit('toggleLoader');
		console.log('building fullpage');
		this.$refs.fullpage.build();
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

					resolve();
				} catch (err) {
					console.error(err);
					reject(err);
				}
			});
		},
		imageLoadedPromise(asset) {
			return new Promise((resolve, reject) => {
				const image = new Image();
				image.src = this.assetsPath + asset.src;
				console.log('assetIndex', asset);
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
		rebuildFullpage({ shelfIndex }) {
			setTimeout(() => {
				console.log('building fullpage - event');
				this.$refs.fullpage.build();
				// this.$refs.fullpage.shelfIndex;
			}, 50);
		},
	},
};
</script>

<style src="./sass/index.scss" lang="scss"></style>
