// import scrollSnapPolyfill from 'css-scroll-snap-polyfill';
import _get from 'lodash/get';
import _debounce from 'lodash.debounce';
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
			showShelfInfo: false,
			startY: 0,
			sectionOffset: 100,
			sectionIdPrefix: 'section',
			// currentShelfComponent: {},
			shelfHeight: 640,
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
		showSeeMore: {
			get() {
				return _get(this.$store.state, 'store.settings.showSeeMore', true);
			},
			set(show) {
				this.$store.commit('store/updateSettings', {
					key: 'showSeeMore',
					value: show,
				});
			},
		},
	},
	created() {},
	mounted() {
		console.log('feed mounted');
		this.shelfHeight = this.$refs.feed.clientHeight / this.shelves.length;
		window.addEventListener('scroll', this.onScroll);
		console.log('shelfHeight', this.shelfHeight);
		// Full height fix
		const vh = this.shelfHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		// this.currentShelfComponent = getCurrentShelfComponent(shelfIndex);
		this.sectionLeave(0);
		this.loadAssets().then(() => {
			const queryShelfIndex = this.$route.query.shelfIndex || 0;
			if (queryShelfIndex > 0) {
				this.scrollTo(queryShelfIndex);
			}
		});
		// this.$store.commit('store/setFeedComponent', this.$refs.feed);
	},
	destroyed() {
		window.removeEventListener('scroll', this.onScroll);
	},
	methods: {
		onScroll: _debounce(function(e) {
			if (this.showSeeMore) {
				this.showSeeMore = false;
			}

			const shelfIndex = Math.round(
				(window.scrollY - this.sectionOffset) / this.shelfHeight
			);

			if (shelfIndex !== this.currentShelfIndex) {
				this.sectionLeave(shelfIndex);
			}
		}, 20),
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
				const moreShelvesThreshold = 2;
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
			// console.log('scrolling to', shelfIndex);
			const shelfComponent =
				shelfIndex === 0
					? this.$refs.firstShelf
					: this.$refs.shelf[shelfIndex - 1];

			let params = {
				behavior: 'smooth',
			};
			console.log('shelfComponent', shelfComponent);
			console.log('shelfIndex', shelfIndex);
			console.log('this.shelves.length - 1', this.shelves.length - 1);
			if (shelfIndex === this.shelves.length - 1) {
				params.top = document.body.scrollHeight;
			} else {
				params.top = shelfComponent.$el.offsetTop;
			}
			console.log('params', params);
			window.scrollTo(params);
			this.sectionLeave(shelfIndex);
		},
		sectionLeave(sectionIndex) {
			const shelfIndex = sectionIndex || 0;
			// console.log('sectionLeave', shelfIndex);
			this.$store.commit('setCurrentShelfIndex', shelfIndex);
			// this.currentShelfComponent = this.getCurrentShelfComponent(shelfIndex);
			// this.showGoToPayment = false;
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

				this.$analytics.productView(shelf.slug, shelf.variations[0].slug);
				console.log('ViewContent', ViewContentValues);
				fbq('track', 'ViewContent', ViewContentValues);
			}
		},
		loadAssets() {
			return new Promise(async (resolve, reject) => {
				try {
					const numberOfAssetsOnFirstRun = 5;

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
