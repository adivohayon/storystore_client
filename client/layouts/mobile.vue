<template>
	<div :style="{ backgroundColor: bgColor }" class="layout layout--mobile">
		<page-header v-if="showHeader"></page-header>
		<loader v-if="showLoader"></loader>
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
import PageHeader from '@/components/page-header';
import _get from 'lodash.get';

export default {
	components: {
		Loader,
		PageHeader,
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
		showHeader() {
			return (
				this.$route.name === 'index' ||
				this.$route.name === 'cart' ||
				!this.autostartStories ||
				this.storiesStarted
			);
		},
		primaryColor() {
			return _get(this.$store.state, 'store.settings.primaryColor', '#ffffff');
		},
		bgColor() {
			return '#000000';
		},
		showLoader() {
			return this.$store.state.loader.show;
		},
		hideLoaderElements() {
			return this.$store.state.loader.hideElements;
		},
		autostartStories() {
			// console.log('autostartStories');
			return _get(this.$store.state, 'store.settings.stories.autostart', false);
		},
		storiesStarted() {
			// console.log('storiesStarted');
			return (
				this.autostartStories &&
				_get(this.$store.state, 'store.settings.stories.started', false)
			);
		},
		// hasShelves() {
		// 	return (
		// 		this.$store.state.store.shelves &&
		// 		this.$store.state.store.shelves.length > 0
		// 	);
		// },
	},
	created() {
		// console.log('! ! ! mobile vue created');
		this.$store.dispatch('toggleLoader', true);
	},
	mounted() {
		console.log('mobile vue mounted', this.$analytics);
		// Full height fix
		const vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		// this.orderQuery = this.$route.query.order;
		this.$store.dispatch('toggleLoader', false);
	},
	methods: {
		test() {
			console.log('test');
		},
	},
};
</script>

<style lang="scss">
* {
	font-family: 'Simpler', 'system-ui', sans-serif;
}
body {
	// background-color: #000000;
}
.layout--mobile {
	$page-header-height: 3.2rem;
	// $viewport-height: var(--vh, 1vh) * 100;

	padding-top: $page-header-height;
	color: #000000;

	display: grid;
	grid-template-rows: [page-header] auto [page] auto;
	overflow: hidden;
	// height: calc(var(--vh, 1vh) * 100);
	.page-header {
		grid-row: page-header;
		position: fixed;
		z-index: 40;
		top: 0;
		left: 0;
		width: 100%;
		height: $page-header-height;
	}
	.page {
		grid-row: page;
		// background-color: #f5f5f5;
		overflow: hidden;
	}

	.feed {
		-webkit-overflow-scrolling: touch;
		color: #ffffff;
		& > .shelf {
			height: calc(100vh - #{$page-header-height});
			position: relative;
		}
		// & > .shelf {
		// 	min-height: calc(calc(var(--vh, 1vh) * 100) - 3.2rem);
		// }
	}

	.story {
		&__view {
			height: calc(100vh);
			position: relative;
		}
	}

	/* overflow: hidden; */
}

.btn {
	outline: none;
	border: none;
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
body {
	overscroll-behavior-y: contain;
}
*,
*:before,
*:after {
	box-sizing: border-box;
	margin: 0;
}
</style>
