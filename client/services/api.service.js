import axios from 'axios';
import { shelves } from './mock.server';

export const getCategories = storeId => {
	return new Promise(resolve => {
		resolve(['שמלות', 'אקססוריז', 'חולצות', 'מכנסיים']);
	});
};

export const getShelves = (storeId, categoryId = 0, storeSlug) => {
	return new Promise(resolve => {
		if (storeSlug) {
			resolve(shelves[storeSlug]);
		}
		resolve(shelves);
	});
};

export const submitContactForm = formData => {
	console.log('submitContactForm', formData);
	return axios.post('functions/submit-contact-form', {
		...formData,
	});
};
