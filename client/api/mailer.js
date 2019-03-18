// 'use strict';

const express = require('express');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
	'99041986803-fea397j8dnkjp22rj05psdh8q302fuiu.apps.googleusercontent.com',
	'PzE1-kMiJiSZT9WCDWfKaOum',
	'https://developers.google.com/oauthplayground' // Redirect URL
);

const app = express();
app.use(express.json());

// MAILER FUNCTION
const sendMail = async (sendTo, subject, html) => {
	try {
		console.log('sendmail funcs');
		oauth2Client.setCredentials({
			refresh_token: '1/GXkUfFRWb5gXmcvcDFD8kESeelA1WX97w1OgyknhlgI',
		});
		const tokens = await oauth2Client.refreshAccessToken();
		const accessToken = tokens.credentials.access_token;

		const smtpSettings = {
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: 'adiv@shop-together.io',
				clientId:
					'99041986803-fea397j8dnkjp22rj05psdh8q302fuiu.apps.googleusercontent.com',
				clientSecret: 'PzE1-kMiJiSZT9WCDWfKaOum',
				refreshToken: '1/GXkUfFRWb5gXmcvcDFD8kESeelA1WX97w1OgyknhlgI',
				accessToken: accessToken,
			},
		};
		let transporter = nodemailer.createTransport(smtpSettings);
		return transporter.sendMail({
			from: 'adiv@shop-together.io',
			to: sendTo,
			subject,
			html,
		});
	} catch (err) {
		console.error('err', err);
		throw new Error(err);
	}
};

// API ENDPOINT
app.post('/', async function(req, res) {
	const companyName = req.body.companyName || '';
	const companyUrl = req.body.companyUrl || '';
	const contactName = req.body.contactName || '';
	const contactPhone = req.body.contactPhone || '';
	const contactEmail = req.body.contactEmail || '';

	const html = `
		Company Name: ${companyName} <br />
		Company URL: ${companyUrl} <br />
		Contact Name: ${contactName} <br />
		Contact Phoner: ${contactPhone} <br />
		Contact Email: ${contactEmail} <br />
	`;

	const sendTo =
		'hai@shop-together.io, adiv@shop-together.io, ben@shop-together.io';
	const subject = 'Storystore: Contact Form';

	try {
		await sendMail(sendTo, subject, html);
		res.status(200).json({ message: 'Your mail send successfully' });
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

// uncomment for local dev
// app.listen(4000, () => console.log(`Example app listening on port ${4000}!`));

module.exports = {
	path: '/api/mailer',
	handler: app,
};
