<template>
	<div>
		<nav class="fixed-top">
			<header class="top-header">storystore</header>
			<navigation :categories="categories"></navigation>
		</nav>
		<feed>
			<no-ssr>
				<shelf
					v-for="(shelf, shelfIndex) in shelves"
					:key="shelfIndex"
					:shelf="shelf"
					:shelf-index="shelfIndex"
				></shelf>
			</no-ssr>
		</feed>
	</div>
</template>

<script>
import Feed from '@/components/feed';
import Shelf from '@/components/shelf';
import Navigation from '@/components/navigation';
import { getCategories, getShelves } from '@/services/api.service';
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
};
</script>

<style src="./sass/index.scss" scoped lang="scss">
</style>
