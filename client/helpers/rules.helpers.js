export const checkRule = (condition, comparator) => {
	if (condition.type) {
		switch (condition.rule) {
			case 'GREATER_THAN':
				return comparator > condition.amount;
			default:
				return false;
		}
	}
};
