'use strict';
const https = require('https');
const tls = require('tls');
const AWS = require('aws-sdk');
const express = require('express');
const app = require('./nuxt');

const PORT = +process.env.PORT || 3000;
const TableName = 'StoryStoreCertificates';

const table = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const cache = new Map();

setTimeout(() => cache.clear(), 3600000);

https
	.createServer(
		{
			key:
				'-----BEGIN RSA PRIVATE KEY-----\r\n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\r\n-----END RSA PRIVATE KEY-----\r\n',
			cert:
				`-----BEGIN CERTIFICATE-----
				MIIDSjCCAjKgAwIBAgIQRK+wgNajJ7qJMDmGLvhAazANBgkqhkiG9w0BAQUFADA/
				MSQwIgYDVQQKExtEaWdpdGFsIFNpZ25hdHVyZSBUcnVzdCBDby4xFzAVBgNVBAMT
				DkRTVCBSb290IENBIFgzMB4XDTAwMDkzMDIxMTIxOVoXDTIxMDkzMDE0MDExNVow
				PzEkMCIGA1UEChMbRGlnaXRhbCBTaWduYXR1cmUgVHJ1c3QgQ28uMRcwFQYDVQQD
				Ew5EU1QgUm9vdCBDQSBYMzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
				AN+v6ZdQCINXtMxiZfaQguzH0yxrMMpb7NnDfcdAwRgUi+DoM3ZJKuM/IUmTrE4O
				rz5Iy2Xu/NMhD2XSKtkyj4zl93ewEnu1lcCJo6m67XMuegwGMoOifooUMM0RoOEq
				OLl5CjH9UL2AZd+3UWODyOKIYepLYYHsUmu5ouJLGiifSKOeDNoJjj4XLh7dIN9b
				xiqKqy69cK3FCxolkHRyxXtqqzTWMIn/5WgTe1QLyNau7Fqckh49ZLOMxt+/yUFw
				7BZy1SbsOFU5Q9D8/RhcQPGX69Wam40dutolucbY38EVAjqr2m7xPi71XAicPNaD
				aeQQmxkqtilX4+U9m5/wAl0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAOBgNV
				HQ8BAf8EBAMCAQYwHQYDVR0OBBYEFMSnsaR7LHH62+FLkHX/xBVghYkQMA0GCSqG
				SIb3DQEBBQUAA4IBAQCjGiybFwBcqR7uKGY3Or+Dxz9LwwmglSBd49lZRNI+DT69
				ikugdB/OEIKcdBodfpga3csTS7MgROSR6cz8faXbauX+5v3gTt23ADq1cEmv8uXr
				AvHRAosZy5Q6XkjEGB5YGV8eAlrwDPGxrancWYaLbumR9YbK+rlmM6pZW87ipxZz
				R8srzJmwN0jP41ZL9c8PDHIyh8bwRLtTcm1D9SZImlJnt1ir/md2cXjbDaJWFBM5
				JDGFoqgCWjBH4d1QB7wCCZAA62RjYJsWvIjJEubSfZGL+T0yjWW06XyxV3bqxbYo
				Ob8VZRzI9neWagqNdwvYkQsEjgfbKbYK7p2CNTUQ
				-----END CERTIFICATE-----
				\n`,
			SNICallback: async (host, cb) => {
				try {
					let ctx = cache.get(host);
					if (ctx) return cb(null, ctx);
					const { Item } = await table
						.get({
							TableName,
							Key: { host },
							AttributesToGet: ['cert', 'privkey', 'privateKey'],
							ReturnConsumedCapacity: 'NONE',
						})
						.promise();
					if (!Item) throw new Error(`Missing certificate for ${host}`);
					console.log(Item.cert);
					ctx = tls.createSecureContext({
						key: Item.privateKey || Item.privkey,
						cert: Item.cert,
					});
					cache.set(host, ctx);
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
