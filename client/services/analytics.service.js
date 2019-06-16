export class Analytics {
	constructor(gtmId) {
		this.gtmId = gtmId; //GTM-TQKQL2Z

		this.headScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer','${this.gtmId}');`;

		this.noScript = `<iframe src="https://www.googletagmanager.com/ns.html?id=${
			this.gtmId
		}"
		height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
	}

	addToCart(shelfSlug, variationSlug) {
		window.dataLayer.push({
			event: 'addToCart',
			variationSlug,
			shelfSlug,
		});
		console.log('window', window.dataLayer);
	}

	goToCart(numberOfItems) {
		console.log('goToCart', dataLayer);
		window.dataLayer.push({
			event: 'goToCart',
			numberOfItems,
		});
	}

	goToCheckout(totalValue) {
		window.dataLayer.push({
			event: 'goToCheckout',
			totalValue,
		});
	}

	productView(shelfSlug, variationSlug) {
		console.log('window', window.dataLayer);
		if (window.dataLayer) {
			window.dataLayer.push({
				event: 'productView',
				variationSlug,
				shelfSlug,
			});
		}
	}
}
