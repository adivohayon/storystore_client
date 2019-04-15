<template>
	<div id="page">
		<div class="carousel">
			<div
				v-for="(asset, index) in variantAssets"
				:key="index"
				:style="{ backgroundImage: 'url(' + asset + ')' }"
				class="slide"
			></div>
		</div>
	</div>
</template>

<script>
/* eslint-disable */
export default {
	components: {},
	layout(ctx) {
		return ctx.app.isMobile ? 'mobile' : 'desktop';
	},
	mixins: [],
	data() {
		return {
			variantAssets: [
				'/queen/rose-dress/fuchsia-pink/queen-2.jpg',
				'/queen/rose-dress/fuchsia-pink/queen-3.jpg',
				'/queen/rose-dress/fuchsia-pink/queen-4.jpg',
			],
		};
	},
	computed: {},
	watch: {},
	created() {},
	updated() {},
	async mounted() {
		setTimeout(() => {
			this.variantAssets.push('/queen/rose-dress/fuchsia-pink/queen.jpg');
		}, 500);
	},
	beforeDestroy() {},
	destroyed() {},
};
</script>

<style lang="scss">
#page {
	.carousel {
		direction: ltr;
		height: 100vh;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		overflow-x: scroll;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		.slide {
			scroll-snap-align: start;
			height: 100vh;
			min-width: 100%;
			background-size: cover;
			background-position: center;
		}
		// overflow: hidden;
	}
}
</style>
