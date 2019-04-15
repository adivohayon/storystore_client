<template>
	<div id="page">
		<carousel :per-page="1" class="carousel">
			<slide
				v-for="(asset, index) in variantAssets"
				:key="index"
				:style="{ backgroundImage: 'url(' + asset + ')' }"
				class="slide"
			>
				<!-- <img :src="asset" /> -->
			</slide>
		</carousel>
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
		overflow: hidden;
		.slide {
			height:100vh;
			width: 100%;
			background-size: cover;
			background-position: center;
			// img {
			// 	width: 100%;
			// 	height: 100%;
			// }
		}
	}
}
</style>
