// import scrollSnapPolyfill from 'css-scroll-snap-polyfill';
import _get from 'lodash/get';
import Shelf from '@/components/shelf';
import AddToCart from './../add-to-cart';
export default {
	name: 'feed',
	components: { Shelf, AddToCart },
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
			sectionIdPrefix: 'section',
			swipedOneDown: false,
			currentShelfComponent: {},
			showGoToPayment: false,
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
		currentShelfIndex() {
			return _get(this.$store.state, 'currentShelfIndex', 0);
		},

		assetsPath() {
			if (this.storeSlug) {
				let path = process.env.staticDir ? process.env.staticDir : '/';
				path += `${this.storeSlug}/`;
				return path;
			}
		},
		cartItemsCount() {
			return this.$store.getters['cart/itemsCount'](this.storeSlug);
		},
	},
	created() {},
	mounted() {
		console.log('feed mounted');
		this.screenHeight = window.innerHeight;

		// Full height fix
		const vh = this.screenHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		// this.currentShelfComponent = getCurrentShelfComponent(shelfIndex);
		this.sectionLeave(0);
		this.loadAssets().then(() => {
			const queryShelfIndex = this.$route.query.shelfIndex || 0;
			if (queryShelfIndex > 0) {
				this.scrollTo(queryShelfIndex);
			}
		});
	},
	methods: {
		getCurrentShelfComponent(shelfIndex) {
			if (shelfIndex === 0) {
				return this.$refs.firstShelf || null;
			} else {
				return this.$refs.shelf ? this.$refs.shelf[shelfIndex - 1] : null;
			}
		},
		loadMoreShelves(nextSectionIndex, isLast) {
			return new Promise(async (resolve, reject) => {
				// console.log('paginationOffset', this.paginationOffset);
				// console.log('nextSectionIndex', nextSectionIndex);
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
		scrollTo(shelfIndex) {
			const shelfComponent =
				shelfIndex === 0
					? this.$refs.firstShelf
					: this.$refs.shelf[shelfIndex - 1];

			shelfComponent.$el.scrollIntoView({
				block: 'start',
				inline: 'nearest',
				behavior: 'smooth',
			});
			this.sectionLeave(shelfIndex);
		},
		sectionLeave(sectionIndex) {
			const shelfIndex = sectionIndex || 0;
			console.log('sectionLeave', shelfIndex);
			this.$store.commit('setCurrentShelfIndex', shelfIndex);
			this.currentShelfComponent = this.getCurrentShelfComponent(shelfIndex);
			this.showGoToPayment = false;
			// this.insertQueryParam('shelfIndex', this.sectionIndex);
			// this.$router.push({
			// 	path: this.$route.path,
			// 	query: {
			// 		...this.$route.query,
			// 		shelfIndex: this.sectionIndex,
			// 	},
			// });

			// Track content for analytics
			const currentShelf = this.shelves[shelfIndex];
			this.trackViewContent(currentShelf);

			this.loadMoreShelves(shelfIndex + 1);

			if (!this.swipedOneDown && shelfIndex !== 0) {
				this.swipedOneDown = true;
			}
		},
		handleTouch(e) {
			if (e.type === 'touchstart') {
				this.startY = e.changedTouches[0].pageY;
			}

			if (e.type === 'touchend') {
				let sectionId;
				const scrollDown = e.changedTouches[0].pageY < this.startY;

				const touchedSection = e
					.composedPath()
					.find(el => (el.id ? el.id.startsWith(this.sectionIdPrefix) : false));
				if (!touchedSection) {
					return;
				}
				// console.log('touchedSection', touchedSection);

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

				// console.log('sectionId', sectionId);
				const sectionIndex = Number(
					sectionId.substring(
						sectionId.indexOf(this.sectionIdPrefix) +
							this.sectionIdPrefix.length +
							1
					)
				);
				if (sectionIndex !== this.currentShelfIndex) {
					this.sectionLeave(sectionIndex);
				}
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
		insertQueryParam(key, value) {
			key = escape(key);
			value = escape(value);

			var kvp = document.location.search.substr(1).split('&');
			if (kvp == '') {
				document.location.search = '?' + key + '=' + value;
			} else {
				var i = kvp.length;
				var x;
				while (i--) {
					x = kvp[i].split('=');

					if (x[0] == key) {
						x[1] = value;
						kvp[i] = x.join('=');
						break;
					}
				}

				if (i < 0) {
					kvp[kvp.length] = [key, value].join('=');
				}

				//this will reload the page, it's likely better to store this until finished
				document.location.search = kvp.join('&');
			}
		},
	},
};
