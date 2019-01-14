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
			<ul class="list">
				<li
					v-for="(feature, featureIndex) in features"
					:key="featureIndex"
					class="list__item"
				>{{feature}}</li>
			</ul>
		</section>

		<!-- PRICING SECTION -->
		<section id="pricing" class="section pricing">
			<h3>מסלולים ומחירים</h3>
			<div class="pricing__container">
				<table class="pricing-table">
					<thead>
						<tr class="pricing-table__row">
							<th></th>
							<th>מקסימום מק״טים</th>
							<th>אחוז מכל עסקה</th>
							<th>עמלה מינימלית חודשית</th>
						</tr>
					</thead>
					<tbody>
						<tr class="pricing-table__row pricing-table__row--basic">
							<td>בסיסי</td>
							<td>100 מק״טים</td>
							<td>5%</td>
							<td>290 ש״ח</td>
						</tr>
						<tr class="pricing-table__row pricing-table__row--standard">
							<td>בסיסי</td>
							<td>100 מק״טים</td>
							<td>5%</td>
							<td>290 ש״ח</td>
						</tr>
						<tr class="pricing-table__row pricing-table__row--premium">
							<td>בסיסי</td>
							<td>100 מק״טים</td>
							<td>5%</td>
							<td>290 ש״ח</td>
						</tr>
					</tbody>
				</table>
				<button class="btn btn--round">פתח/י סטוריסטור</button>
			</div>
			<!-- <table> -->
		</section>

		<section id="studio" class="section studio">
			<h3>שירותי סטודיו</h3>
			<div class="studio__container">
				<p>
					תוכן איכותי ומקורי מוכר יותר, לכן סטוריסטור מציעה גם שירותי הפקה שיעזרו לקדם את המוצרים שלך.
					אנחנו מייצרים למוצרים תוכן ויזואלי (סטילס ווידאו) המתאים לאינטרנט.
				</p>
				<p>מבצע ללקוחות סטוריסטור: חבילת סטילס ווידאו ב-99 ש״ח למוצר</p>
				<ul class="list">
					<li
						v-for="(studioFeature, studioFeatureIndex) in studioFeatures"
						:key="studioFeatureIndex"
						class="list__item"
					>{{studioFeature}}</li>
				</ul>
			</div>
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
			studioFeatures: [
				'בניית קונספט',
				'צילום ובימוי',
				'סטודיו וציוד מקצועי',
				'דוגמנים/יות במידת הצורך',
				'הלבשה סטיילנג ואיפור',
				'עריכה ופוסט',
			],
		};
	},
	mounted() {},
};
</script>

<style src="./our-services.page.scss" lang="scss">
</style>
