const XYZ_LOOKUP_WORD = 'translate3d(';

const getXYtranslateFromStyle = str => {
	const lookupIndex = str.lastIndexOf(XYZ_LOOKUP_WORD);

	return lookupIndex > -1
		? str
				.substring(lookupIndex + lookupWord.length, str.length - 2)
				.split('px, ', 2)
				.map(v => Number(v))
		: [0, 0];
};

const isShelfChange = mutation => {
	// METHOD 1
	return mutation.target.id === 'fullpage';
	// METHOD 2
	// return (
	// 	mutation.attributeName === 'class' && mutation.oldValue.startsWith('shelf')
	// );
};
const mutationObserverFunc = ([mutation]) => {
	if (mutation.type === 'attributes') {
		const [xTranslate, yTranslate] = getXYtranslateFromStyle(mutation.oldValue);
		const translate = isShelfChange(mutation) ? yTranslate : xTranslate;
		const comparator = isShelfChange(mutation)
			? document.body.offsetHeight
			: document.body.offsetWidth;
		const uiToggle = handleUIToggling(translate, comparator);
		// if (isShelfChange(mutation)) {

		// }
	}
};

const handleUIToggling = (translate, comparator) => {
	if (translate === 0) {
		console.log('DISABLE UI');
		// this.$store.dispatch('toggleHiddenLoader', true);
		return true;
	}

	if (
		(translate + 1) % comparator === 0 ||
		(translate - 1) % comparator === 0
	) {
		console.log('ENABLE UI');
		return false;
		// this.$store.dispatch('toggleHiddenLoader', false);
	} else {
		// this.$store.dispatch('toggleHiddenLoader', true);
		console.log('DISABLE UI');
		return true;
	}
};

const observeActiveSectionSlides = mutationObserver => {
	mutationObserver.disconnect();
	mutationObserver.observe(
		document.querySelector('.shelf.active .fp-slidesContainer'),
		{
			attributes: true,
			characterData: true,
			attributeOldValue: true,
			characterDataOldValue: true,
			attributeFilter: ['style'],
		}
	);
};
