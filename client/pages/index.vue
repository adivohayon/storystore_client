<template>
	<div id="our-services">
		<!-- HERO SECTION -->
		<section id="hero" class="section">
			<div class="logo show-sm">
				<img src="/storystore_logo.png" alt="Storystore">
				<h2>הקם סטוריסטור לעסק שלך בקלות ובמהירות</h2>
			</div>

			<div class="demo-video">
				<video muted="muted" autoplay src="/storystore_demo.mp4"></video>
			</div>
			<div class="subtitle">
				<div class="logo show-md">
					<img src="/storystore_logo.png" alt="Storystore">
				</div>
				<h2 class="show-md">הקם סטוריסטור לעסק שלך בקלות ובמהירות</h2>
				<p>כל מה שאתה צריך זה מוצרים ותוכן סטוריסטור יעשו את השאר ותוכל להתחיל למכור !</p>
				<button class="btn btn--round">פתח/י סטוריסטור</button>
			</div>
		</section>

		<!-- WHY STORYSTORE SECTION -->
		<section id="why-storystore" class="section">
			<h3>למה סטוריסטור?</h3>
			<ul class="features-list">
				<li
					v-for="(feature, featureIndex) in features"
					:key="featureIndex"
					class="features-list__item"
				>{{feature}}</li>
			</ul>
		</section>

		<!-- PRICING SECTION -->
		<section id="pricing">
			<h3>מסלולים ומחירים</h3>
		</section>
	</div>
</template>

<script>
export default {
	components: {},
	async asyncData({ params }) {},
	data() {
		return {
			features: [
				'ללא עלות הקמה',
				'ממשק קל ונוח לתפעול ולשליטה',
				'יותר מוצרים בפחות זמן - יחס המרה גבוה יותר',
				'חווית משתמש ייחודית וחברתית',
				'דגש על המוצרים ואיכות התוכן  (וידאו, תמונות וטקסטים)',
				'ליווי מקצועי צמוד של הצוות של סטורי סטור',
			],
		};
	},
	mounted() {},
};
</script>

<style src="./our-services.page.scss" lang="scss">
</style>
