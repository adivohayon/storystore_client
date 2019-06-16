import { props } from './cta.component.props';
import AddToCartCta from './add-to-cart.cta';
import OrderCta from './order.cta';
import _get from 'lodash.get';
export default {
	name: 'cta',
	components: { AddToCartCta, OrderCta },
	props,
	data() {
		return {};
	},
	computed: {
		shelfType() {
			return _get(this.shelf, 'type', 'ADD_TO_CART');
		},
	},
	created() {},
	mounted() {},
	methods: {},
};
