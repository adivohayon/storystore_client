<template>
	<div id="page" :class="fixerClass">
		<!-- <full-page
				v-if="shelves && shelves.length > 0"
				id="fullpage"
				ref="fullpage"
				:options="feedOptions"
		>-->
		<shelf
			v-for="(shelf, shelfIndex) in shelves"
			:key="shelfIndex"
			:shelf="shelf"
			:shelf-index="shelfIndex"
		></shelf>
		<!-- </full-page> -->
		<!-- <div v-else>No shelves available or store not available</div> -->
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
	layout(ctx) {
		return ctx.app.isMobile ? 'mobile' : 'desktop';
	},
	data() {
		return {
			isMobile: true,
			fixerClass: '',
		};
	},
	computed: {
		...mapState({
			shelves: state => state.store.shelves,
			// slug: state => state.store,
		}),
	},
	created() {},
	mounted() {},
	methods: {},
};
</script>

<style src="./sass/index.scss" lang="scss"></style>
