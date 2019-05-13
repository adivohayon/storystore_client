import AddToCart from '@/components/add-to-cart';
import AttributePicker from '@/components/attribute-picker';
import Scrims from '@/components/scrims';
import _get from 'lodash.get';
export default {
	name: 'story-slide',
	components: { AddToCart, AttributePicker, Scrims },
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
		};
	},
	computed: {
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
		slideAsset() {
			return this.assetsPath + this.variation.assets[0];
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
	},
	destroyed() {},
	methods: {
		resumeAutoplay() {
			this.$emit('autoplay', 'RESUME');
		},
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
					this.$set(this.selectedAttributes, attributeKey, selectedAttribute);
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
					value: this.variation.property_value,
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
	},
};
