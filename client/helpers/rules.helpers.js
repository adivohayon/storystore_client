export const ruleCheck = (something, rule, value) => {
	switch (rule) {
		case 'GREATER_THAN':
			return something > value;
		default:
			return false;
	}
};
