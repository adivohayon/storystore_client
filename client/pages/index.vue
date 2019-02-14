<template>
	<div id="page" :class="fixerClass">
		<no-ssr>
			<full-page
				v-if="shelves && shelves.length > 0"
				id="fullpage"
				ref="fullpage"
				:options="feedOptions"
			>
				<shelf
					v-for="(shelf, shelfIndex) in shelves"
					:key="shelfIndex"
					:shelf="shelf"
					:shelf-index="shelfIndex"
				></shelf>
			</full-page>
			<div v-else>No shelves available or store not available</div>
		</no-ssr>
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
			feedOptions: {
				sectionSelector: '.shelf',
				// slideSelector: '.shelf-content',
				autoScrolling: true,
				licenseKey: '45154D42-6F8E4ACE-AB31A7B3-11A8CE75',
				dragAndMoveKey: 'c3RvcnlzdG9yZS5jby5pbF9ZSTBaSEpoWjBGdVpFMXZkbVU9YjYy',
				dragAndMove: true,
				controlArrows: false,
				slidesNavigation: true,
				afterRender: () => {
					// console.log('children', this.$refs.videoEl);
				},
			},
			orderQuery: null,
		};
	},
	computed: {
		hasShelves() {
			return (
				this.$store.state.store.shelves &&
				this.$store.state.store.shelves.length > 0
			);
		},
		...mapState({
			shelves: state => state.store.shelves,
			// slug: state => state.store,
		}),
	},
	created() {},
	mounted() {},
	beforeDestroy() {
		this.feedOptions.dragAndMove = false;
	},
	destroyed() {
		console.log('destroy', fullpage_api);

		fullpage_api.destroy('all');
	},
	methods: {},
};
</script>

<style src="./sass/index.scss" lang="scss"></style>
