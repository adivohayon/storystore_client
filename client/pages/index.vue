<template>
	<section class="container">
		<feed></feed>
		<no-ssr>
			<shelf></shelf>
		</no-ssr>
	</section>
</template>

<script>
import Feed from '@/components/feed';
import Shelf from '@/components/shelf';
export default {
	components: { Feed, Shelf },
};
</script>

<style>
.container {
}
</style>
