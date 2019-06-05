import AddToCart from '@/components/add-to-cart';
import AttributePicker from '@/components/attribute-picker';
import ShelfTitle from '@/components/shelf-title';
import Scrims from '@/components/scrims';
import _get from 'lodash.get';
export default {
	name: 'story-slide',
	components: { AddToCart, AttributePicker, Scrims, ShelfTitle },
	props: {
		variation: {
			type: Object,
			default() {
				return {};
			},
		},
		shelf: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	data() {
		return {
			selectedAttributes: {},
			selectedProperty: {},
			showGoToPayment: false,
			touchStartTimestamp: 0,
			touchThreshold: 300, // ms
			clickableAreaEl: null,
			sizeError: false,
		};
	},
	computed: {
		webpSupport() {
			return Modernizr.webp;
		},
		isIOS() {
			console.log('navigator', navigator);
			return (
				(navigator && navigator.platform && navigator.platform === 'iOS') ||
				navigator.userAgent.includes('iPhone')
			);
		},
		shelfTitle() {
			let title = this.shelf.name;
			if (
				this.variation.property_label &&
				this.variation.property_label.length > 0
			) {
				title += ' - ' + this.variation.property_label.toUpperCase();
			}
			return title;
		},
		showShelfInfo() {
			return this.$store.state.showShelfInfo;
		},
		shelfInfo() {
			return this.shelf.info;
		},
		shippingDetails() {
			return this.$store.state.store.shippingDetails;
		},
		returns() {
			return this.$store.state.store.returns;
		},
		assetsPath() {
			let path = process.env.staticDir ? process.env.staticDir : '/';
			if (process.env.staticDir) {
				path += `${this.storeSlug}/`;
			}

			path += `${this.shelf.slug}/${this.variation.slug}/`;
			return path;
		},
		storeSlug() {
			return this.$store.state.store.slug;
		},
		showCart() {
			return _get(this.$store.state, 'store.settings.hasCart', true);
		},
		cartItemsCount() {
			return this.$store.getters['cart/itemsCount'](this.storeSlug);
		},
		slideAsset() {
			if (this.webpSupport) {
				return this.assetsPath + this.variation.assets[1];
			} else {
				return this.assetsPath + this.variation.assets[0];
			}
		},
		availableAttributes() {
			const attributesArr = _get(this.variation, 'attributes', []);

			const attributes = {};
			for (const attribute of attributesArr) {
				// first time added to list
				const attributeKey = attribute.itemProperty
					? attribute.itemProperty.type
					: 'no_attribute';
				if (!attributes.hasOwnProperty(attributeKey)) {
					attributes[attributeKey] = {
						available: [],
						label: attribute.itemProperty ? attribute.itemProperty.label : null,
					};
				}

				// Push available
				attributes[attributeKey].available.push({
					label: attribute.label || null,
					value: attribute.value || null,
					variationAttributeId: attribute.variationAttribute.id,
					external_id: attribute.variationAttribute.external_id,
				});
			}
			return attributes;
			// attributesArr.
		},
	},
	created() {},
	mounted() {
		this.initializeSelectedAttributes();
		this.initializeSelectedProperty();
		this.initializeClickableArea();
	},
	destroyed() {
		this.hammer.destroy();
	},
	methods: {
		initializeClickableArea() {
			this.clickableAreaEl = this.$refs.clickableArea;
			if (this.clickableAreaEl) {
				// const Hammer = this.$Hammer;
				this.hammer = new this.$Hammer.Manager(this.clickableAreaEl, {
					domEvents: true,
				});

				this.hammer.add(new Hammer.Press({ time: 251 }));
				this.hammer.add(new Hammer.Tap());
				this.hammer.add(new Hammer.Swipe());
				// console.log('hammer', this.hammer);

				this.hammer.on('press', () => {
					this.$emit('autoplay', 'PAUSE');
					// this.toggleAutoplay('PAUSE');
				});

				this.hammer.on('pressup', () => {
					this.$emit('autoplay', 'RESUME');
					// this.toggleAutoplay('RESUME');
				});

				this.hammer.on('swiperight', () => {
					console.log('swiperight');
					this.$emit('go-to-story', 'NEXT_STORY');
				});

				this.hammer.on('swipeleft', () => {
					console.log('swipeleft');
					this.$emit('go-to-story', 'PREVIOUS_STORY');
				});

				this.hammer.on('tap', e => {
					// console.log('e', )
					// e.srcEvent.stopPropagation();
					// e.srcEvent.preventDefault();
					const isNext = e.target.className.includes('__next');
					const isPrev = e.target.className.includes('__previous');

					if (isNext) {
						this.$emit('next-slide');
						// this.nextSlide();
					}

					if (isPrev) {
						this.$emit('previous-slide');
						//this.previousSlide();
					}
					console.log('e', e);
					e.preventDefault();
					return;
				});
			}
		},
		// resumeAutoplay() {
		// 	this.$emit('autoplay', 'RESUME');
		// },
		pauseAutoplay() {
			console.log('story slide - stop autoplay');
			this.$emit('autoplay', 'PAUSE');
		},
		initializeSelectedAttributes() {
			for (const attributeKey in this.availableAttributes) {
				if (this.availableAttributes.hasOwnProperty(attributeKey)) {
					const availableAttribute = _get(
						this.availableAttributes,
						[attributeKey, 'available'],
						[]
					);
					const itemPropertyLabel = _get(
						this.availableAttributes,
						[attributeKey, 'label'],
						''
					);
					const selectedAttribute = {
						...availableAttribute[0],
						itemPropertyLabel,
					};
					console.log(
						'story-slide / initializeSelectedAttributes / selectedAttribute',
						selectedAttribute
					);
					this.$set(this.selectedAttributes, attributeKey, {});
				}
			}
		},
		initializeSelectedProperty() {
			if (
				this.variation.itemProperty &&
				this.variation.itemProperty.type &&
				this.variation.itemProperty.label
			) {
				this.selectedProperty = {};

				this.$set(this.selectedProperty, this.variation.itemProperty.type, {
					label: this.variation.property_label,
					value: this.variation.property_value || '#ffffff',
					itemPropertyLabel: this.variation.itemProperty.label,
				});
			}
		},
		setAtt({ att, attKey }) {
			this.selectedAttributes[attKey] = {
				...att,
				itemPropertyLabel: this.availableAttributes[attKey].label,
			};
		},
		sizeErrorNotification() {
			console.log('sizeErrorNotification');
			this.sizeError = true;
			setTimeout(() => {
				console.log('disappear!!!!');
				this.sizeError = false;
			}, 3000);
		},
	},
};
