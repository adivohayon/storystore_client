<template>
	<div id="page" :class="fixerClass">

		<!-- <nav class="fixed-top">
			<header class="top-header">storystore</header>
			<navigation :categories="categories"></navigation>
		</nav>-->
		<!-- <no-ssr> -->
		<!-- <feed> -->
		<no-ssr>
			<full-page
				v-if="shelves && shelves.length > 0"
				id="fullpage"
				ref="fullpage"
				:options="feedOptions"
			>
				<!-- <div class="shelf" style="background-color: red">1</div>
				<div class="shelf" style="background-color: blue">2</div>
				<div class="shelf" style="background-color: green">3</div>-->
				<shelf
					v-for="(shelf, shelfIndex) in shelves"
					:key="shelfIndex"
					:shelf="shelf"
					:shelf-index="shelfIndex"
				></shelf>
			</full-page>
			<div v-else>No shelves available or store not available</div>
		</no-ssr>
		<!-- </feed> -->
		<!-- </no-ssr> -->
		<!-- <div id="shelf-1">uoooo</div> -->
		<!-- <no-ssr>
			<shelf
				v-for="(shelf, shelfIndex) in shelves"
				:key="shelfIndex"
				:shelf="shelf"
				:shelf-index="shelfIndex"
				:id="`shelf-${shelfIndex}`"
			></shelf>
		</no-ssr>-->
	</div>
</template>

<script>
import Feed from '@/components/feed';
import Shelf from '@/components/shelf';
import Navigation from '@/components/navigation';
import { getCategories, getShelves } from '@/services/api.service';
import '@/icons';
import { mapState } from 'vuex';

export default {
	components: { Feed, Shelf, Navigation },
	async fetch({ store, params }) {
		if (params.storeSlug) {
			await store.dispatch('store/get', params.storeSlug);
		}
	},
	// async asyncData({ params }) {
	// 	try {
	// 		// let categories = [];
	// 		// let shelves = [];

	// 		// if (params.storeSlug) {
	// 		// 	shelves = await getShelves(null, null, params.storeSlug);
	// 		// }

	// 		// // const categories = await getCategories(0);

	// 		// return {
	// 		// 	storeSlug: params.storeSlug,
	// 		// 	categories,
	// 		// 	shelves,
	// 		// };
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// },
	data() {
		return {
			fixerClass: '',
			// shelves: [],
			feedOptions: {
				sectionSelector: '.shelf',
				// slideSelector: '.shelf-content',
				autoScrolling: true,
				licenseKey: '45154D42-6F8E4ACE-AB31A7B3-11A8CE75',
				dragAndMoveKey: 'F5E0D91E-52F94E24-98489795-9E741DA2',
				dragAndMove: true,
				controlArrows: false,
				slidesNavigation: true,
				afterRender: () => {
					// console.log('children', this.$refs.videoEl);
				},
			},
		};
	},
	computed: {
		...mapState({
			shelves: state => state.store.shelves,
			// slug: state => state.store,
		}),
	},
	created() {},
	mounted() {
		// let a = setInterval(function() {
		// 	$(window).scrollTop(-1);
		// 	resize();
		// }, 500);
		// $(window).on('resize', function() {
		// 	resize();
		// });
		// const resize = function() {
		// 	if (window.innerHeight != height) {
		// 		height = window.innerHeight;
		// 		$('.shelf').css('height', height + 'px');
		// 	}
		// };
		// console.log('innerHeight', window.innerHeight);
		// this.$refs.fullpage.build();
		// const el = document.querySelector('#shelf-1');
		// console.log('elll', el);
	},
};
</script>

<style src="../sass/index.scss" lang="scss">
</style>
