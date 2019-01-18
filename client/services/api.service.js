import axios from 'axios';
import { shelves } from './mock.server';

export const getCategories = storeId => {
	return new Promise(resolve => {
		resolve(['שמלות', 'אקססוריז', 'חולצות', 'מכנסיים']);
	});
};

export const getShelves = (storeId, categoryId = 0) => {
	return new Promise(resolve => {
		resolve(shelves);
	});
};

export const contactStorystore = formData => {
	console.log('formData', formData);
	return axios.post('/api/mailer', { ...formData });
	// return new Promise(resolve => {
	// 	resolve();
	// });
};
