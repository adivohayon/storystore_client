<template>
	<div>
		<!-- <loader v-if="showLoader" :hide-elements="hideLoaderElements"></loader> -->
		<!-- <no-ssr> -->
		<!-- <full-page
				v-if="hasShelves"
				id="fullpage"
				ref="fullpage"
				:options="feedOptions"
		>-->
		<nuxt />
		<!-- </full-page>
			<div v-else>No shelves available or store not available</div>
		</no-ssr>-->
	</div>
</template>

<script>
import '@/icons';
import { mapState } from 'vuex';
import Loader from './../components/loader';
export default {
	components: {
		Loader,
	},
	data() {
		return {
			// feedOptions: {
			// 	sectionSelector: '.shelf',
			// 	// slideSelector: '.shelf-content',
			// 	autoScrolling: true,
			// 	licenseKey: '45154D42-6F8E4ACE-AB31A7B3-11A8CE75',
			// 	dragAndMoveKey: 'F5E0D91E-52F94E24-98489795-9E741DA2',
			// 	dragAndMove: true,
			// 	controlArrows: false,
			// 	slidesNavigation: true,
			// 	afterRender: () => {
			// 		// console.log('children', this.$refs.videoEl);
			// 	},
			// },
			// orderQuery: null,
		};
	},
	computed: {
		showLoader() {
			return this.$store.state.loader.show;
		},
		hideLoaderElements() {
			return this.$store.state.loader.hideElements;
		},
		// hasShelves() {
		// 	return (
		// 		this.$store.state.store.shelves &&
		// 		this.$store.state.store.shelves.length > 0
		// 	);
		// },
	},
	created() {},
	mounted() {
		// this.orderQuery = this.$route.query.order;
	},
	methods: {
		test() {
			console.log('test');
		},
	},
};
</script>

<style>
* {
	font-family: 'Simpler', 'system-ui', sans-serif;
}
html {
	font-size: 14px;
	word-spacing: 1px;
	-ms-text-size-adjust: 100%;
	-webkit-text-size-adjust: 100%;
	-moz-osx-font-smoothing: grayscale;
	-webkit-font-smoothing: antialiased;
	box-sizing: border-box;
	direction: rtl;
}

*,
*:before,
*:after {
	box-sizing: border-box;
	margin: 0;
}
</style>
