<template>
	<div id="page" :class="fixerClass">
		<!-- <nav class="fixed-top">
			<header class="top-header">storystore</header>
			<navigation :categories="categories"></navigation>
		</nav>-->
		<!-- <no-ssr> -->
		<!-- <feed> -->
		<no-ssr>
			<full-page id="fullpage" ref="fullpage" :options="feedOptions">
				<shelf
					v-for="(shelf, shelfIndex) in shelves"
					:key="shelfIndex"
					:shelf="shelf"
					:shelf-index="shelfIndex"
				></shelf>
			</full-page>
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

export default {
	components: { Feed, Shelf, Navigation },
	async asyncData({ params }) {
		try {
			const categories = await getCategories(0);
			const shelves = await getShelves(0);
			return {
				categories,
				shelves,
			};
		} catch (err) {
			console.error(err);
		}
	},
	data() {
		return {
			fixerClass: '',
			feedOptions: {
				// dragAndMove: true,
				sectionSelector: '.shelf',
				// slideSelector: '.shelf-content',
				licenseKey: '45154D42-6F8E4ACE-AB31A7B3-11A8CE75',
				dragAndMoveKey: 'F5E0D91E-52F94E24-98489795-9E741DA2',
				dragAndMove: true,
				controlArrows: false,
				slidesNavigation: true,
				afterRender: () => {
					console.log('children', this.$refs.videoEl);
				},
			},
		};
	},
	mounted() {
		// this.$refs.fullpage.build();
		// const el = document.querySelector('#shelf-1');
		// console.log('elll', el);
	},
};
</script>

<style src="./sass/index.scss" lang="scss">
</style>
