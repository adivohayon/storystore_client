'use strict';
const https = require('https');
const tls = require('tls');
const AWS = require('aws-sdk');
const app = require('./nuxt');

const PORT = 3000;
const TableName = 'StoryStoreCertificates';

const table = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });

const cache = new Map();

setTimeout(() => cache.clear(), 3600000);

https
	.createServer(
		{
			SNICallback: async (host, cb) => {
				try {
					let ctx = cache.get(host);
					if (!ctx) {
						let { Item } = await table
							.get({
								TableName,
								Key: { host },
								AttributesToGet: ['cert', 'privkey', 'privateKey'],
								ReturnConsumedCapacity: 'NONE',
							})
							.promise();
						if (!Item) throw new Error(`Missing certificate for ${host}`);

						ctx = tls.createSecureContext({
							key: Item.privateKey || Item.privkey,
							cert: Item.cert,
						});

						cache.set(host, ctx);
					}
					cb(null, ctx);
				} catch (err) {
					console.error(err);
					cb(err);
				}
			},
		},
		app
	)
	.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
