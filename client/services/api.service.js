import axios from 'axios';

export const getCategories = storeId => {
	return new Promise(resolve => {
		resolve(['שמלות', 'אקססוריז', 'חולצות', 'מכנסיים']);
	});
};
