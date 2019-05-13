import Hammer from 'hammerjs';

export default (ctx, inject) => {
	inject('Hammer', Hammer); // registers as this.$Hammer
};
