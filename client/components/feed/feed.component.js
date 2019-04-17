// import scrollSnapPolyfill from 'css-scroll-snap-polyfill';
import _get from 'lodash/get';
import Shelf from '@/components/shelf';
export default {
	name: 'feed',
	components: { Shelf },
	props: {
		shelves: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			startY: 0,
			sectionOffset: 100,
			screenHeight: 0,
			sectionIndex: 0,
			sectionIdPrefix: 'section',
		};
	},
	computed: {
		paginationOffset() {
			return _get(this.$store.state, 'store.pagination.offset', null);
		},
		storeId() {
			return _get(this.$store.state, 'store.storeId', null);
		},
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
	created() {},
	mounted() {
		this.screenHeight = window.innerHeight;
		const scrollSnapPolyfill = require('css-scroll-snap-polyfill');
		scrollSnapPolyfill();

		// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
		const vh = this.screenHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		// Then we set the value in the --vh custom property to the root of the document

		this.$store.commit('toggleLoader');
		this.loadAssets().then(() => {
			const queryShelfIndex = this.$route.query.shelfIndex;
			this.sectionLeave(queryShelfIndex);
			if (queryShelfIndex > 0) {
				this.scrollTo(queryShelfIndex);
			}
		});
	},
	methods: {
		loadMoreShelves(nextSectionIndex, isLast) {
			return new Promise(async (resolve, reject) => {
				console.log('paginationOffset', this.paginationOffset);
				console.log('nextSectionIndex', nextSectionIndex);
				const moreShelvesThreshold = 3;
				try {
					if (
						nextSectionIndex > 0 &&
						nextSectionIndex >
							Math.abs(this.paginationOffset - moreShelvesThreshold)
					) {
						await this.$store.dispatch('store/getShelves', {
							storeId: this.storeId,
							offset: this.paginationOffset,
						});
						await this.loadAssets();
						resolve();
					}
				} catch (err) {
					console.error('loadMoreShelves / Error', err);
					reject(err);
				}
			});
		},
		scrollTo(sectionIndex) {
			const sectionId = this.sectionIdPrefix + '-' + sectionIndex;
			const element = document.getElementById(sectionId);
			if (element) {
				element.scrollIntoView({
					block: 'start',
					inline: 'nearest',
					behavior: 'smooth',
				});
			}
		},
		sectionLeave(sectionIndex) {
			console.log('sectionLeave', sectionIndex);
			this.sectionIndex = sectionIndex;
			this.$router.push({
				path: this.$route.path,
				query: {
					...this.$route.query,
					shelfIndex: this.sectionIndex,
				},
			});

			// Track content for analytics
			const currentShelf = this.shelves[sectionIndex];
			this.trackViewContent(currentShelf);

			this.loadMoreShelves(sectionIndex + 1);
		},
		handleTouch(e) {
			if (e.type === 'touchstart') {
				this.startY = e.changedTouches[0].pageY;
			}

			if (e.type === 'touchend') {
				let sectionId;
				const scrollDown = e.changedTouches[0].pageY < this.startY;

				const touchedSection = e.path.find(el =>
					el.id.startsWith(this.sectionIdPrefix)
				);
				if (!touchedSection) {
					throw new Error('No section to select');
				}

				const comparedSection = scrollDown
					? touchedSection.nextElementSibling
					: touchedSection.previousElementSibling;

				if (comparedSection) {
					const clientRect = comparedSection.getBoundingClientRect();
					if (scrollDown) {
						sectionId =
							clientRect.y < this.screenHeight - this.sectionOffset
								? comparedSection.id
								: touchedSection.id;
					} else {
						sectionId =
							Math.abs(clientRect.y) < clientRect.height - this.sectionOffset
								? comparedSection.id
								: touchedSection.id;
					}
				} else {
					sectionId = touchedSection.id;
				}

				const sectionIndex = Number(
					sectionId.substring(
						sectionId.indexOf(this.sectionIdPrefix) +
							this.sectionIdPrefix.length +
							1
					)
				);
				this.sectionLeave(sectionIndex);
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
						await this.assetLoadedPromise(asset);
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
						await this.assetLoadedPromise(asset);
					}
					console.log('All assets loaded');
					resolve();
				} catch (err) {
					console.error('load images failed', err);
					reject(err);
				}
			});
		},
		assetLoadedPromise(asset) {
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
