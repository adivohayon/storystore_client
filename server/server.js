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
			cert: `-----BEGIN CERTIFICATE-----
			MIIGWDCCBUCgAwIBAgISA/0eApSUkgVIa9PzLO7y8q3+MA0GCSqGSIb3DQEBCwUA
			MEoxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MSMwIQYDVQQD
			ExpMZXQncyBFbmNyeXB0IEF1dGhvcml0eSBYMzAeFw0xOTAyMTMxNzM5MjVaFw0x
			OTA1MTQxNzM5MjVaMBsxGTAXBgNVBAMTEHN0b3J5c3RvcmUuY28uaWwwggIiMA0G
			CSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDhOQsKUnPPoAfuc5VzMV0QdijTYXvI
			CWNdmATxycWWYEBBF3rIGBYmmuW1NcC6+tb6RX0qbLnBWA2dbV2uj+0xfnapZUkP
			RzhxvbDr7+CmM+7+WGL6Efyh+hwca51TNAc5kAyHYpBak+mrKfXPo9DoeO8V2jE4
			Q5sqUbFEz0Z5GAqBePubuzrL3iCOcvQgFceU2g/JJy7AlnjzkI5WJvpA8tgEN8Ea
			Ur2rSHCN2F11cPQuQsx4Ns4haFuUg8PWP3n1c9y/m+V8EA+qkHNrh0PwN9zLLigb
			fwVTN5k1N273MA0tD5aAbHjNgeOtoUHh66LWS3JurIJMuZxtkHQjLAiJR2wu6SOi
			9KpbsquMAasNjhacJG8Y8uRs4EiBJqdT1oMbTPR0umuTu4bj0esUCCbZlaYSr+FI
			KMluDd0x3rLnPX7q2ZvPcK4tFuaop5ChWd2wjlmbCQ265+5ZACm76IM9K/5B12yx
			ltkS6diT3ymqbEveHfCKDrr1Fe7Zp8Q/mLrGBDuYWGja8WLqM33wZqn7BsRMOWFL
			NzY4d1caM02p75x3pncsicmPof45zz4wK4+iblISUMDS8hC2CN7RBe3rg49isEHi
			DBGTAVmtQfM8LwveEy1C2CpgLea/2tQVlrJQC18OeU1t4xebGdpslWPw9OKN2/+0
			BjDvqTvFDstSZQIDAQABo4ICZTCCAmEwDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQW
			MBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBS2
			8hIhnG5NUkcmGZF1G+WuQn4yZTAfBgNVHSMEGDAWgBSoSmpjBH3duubRObemRWXv
			86jsoTBvBggrBgEFBQcBAQRjMGEwLgYIKwYBBQUHMAGGImh0dHA6Ly9vY3NwLmlu
			dC14My5sZXRzZW5jcnlwdC5vcmcwLwYIKwYBBQUHMAKGI2h0dHA6Ly9jZXJ0Lmlu
			dC14My5sZXRzZW5jcnlwdC5vcmcvMBsGA1UdEQQUMBKCEHN0b3J5c3RvcmUuY28u
			aWwwTAYDVR0gBEUwQzAIBgZngQwBAgEwNwYLKwYBBAGC3xMBAQEwKDAmBggrBgEF
			BQcCARYaaHR0cDovL2Nwcy5sZXRzZW5jcnlwdC5vcmcwggEEBgorBgEEAdZ5AgQC
			BIH1BIHyAPAAdQDiaUuuJujpQAnohhu2O4PUPuf+dIj7pI8okwGd3fHb/gAAAWjo
			KA6fAAAEAwBGMEQCICoi5k2sZ+vOLvcWie/ZPum7UjImqUw0iaVMIrE3cIILAiBx
			Fk9867RNpZ6Ay4TTiK5FcN+2xaDH2jXT9cyUvbW0cgB3ACk8UZZUyDlluqpQ/FgH
			1Ldvv1h6KXLcpMMM9OVFR/R4AAABaOgoEOAAAAQDAEgwRgIhAM7fyO6dleSvazv0
			1ZajJtaUwa9EiJoFdp9Ck9CwXT1qAiEAo+a9Jk0AOCyJiUgvLCXvyUg/m8mNVDxp
			sgK36DTdu64wDQYJKoZIhvcNAQELBQADggEBAH8entSRIXU4Ltl5YfF5YATvh1j0
			J6FoRJRMHfDKTFcGqKs9q4rQFeMrNfwspWrFT9W5ZLkpXlPBu7vmfaOjGQEIcrMr
			d6X/iKyBmY3gjhnD3xwIx7th+QlrmGhQ3Iz4l9ncaiRg9a/elaHpN7kiptQJH0HO
			cAx/PUQPi8DCudf7AclvHJFktHgK6UV0nbtiaCrN2uSfV0kwBL9NFi+ZVHlMqIOW
			z4xZlDwsT//iQ70+aiUgAPpbcSmFaLWebaemCwuriElKC8LY85MoDC+w13WqDpQ7
			zE4WBy7Fo1f4k5BadYnxLlN44LQmEZ3dv+lE1XKdfnZVelvaUsoFIeOez0g=
			-----END CERTIFICATE-----
			-----BEGIN CERTIFICATE-----
			MIIEkjCCA3qgAwIBAgIQCgFBQgAAAVOFc2oLheynCDANBgkqhkiG9w0BAQsFADA/
			MSQwIgYDVQQKExtEaWdpdGFsIFNpZ25hdHVyZSBUcnVzdCBDby4xFzAVBgNVBAMT
			DkRTVCBSb290IENBIFgzMB4XDTE2MDMxNzE2NDA0NloXDTIxMDMxNzE2NDA0Nlow
			SjELMAkGA1UEBhMCVVMxFjAUBgNVBAoTDUxldCdzIEVuY3J5cHQxIzAhBgNVBAMT
			GkxldCdzIEVuY3J5cHQgQXV0aG9yaXR5IFgzMIIBIjANBgkqhkiG9w0BAQEFAAOC
			AQ8AMIIBCgKCAQEAnNMM8FrlLke3cl03g7NoYzDq1zUmGSXhvb418XCSL7e4S0EF
			q6meNQhY7LEqxGiHC6PjdeTm86dicbp5gWAf15Gan/PQeGdxyGkOlZHP/uaZ6WA8
			SMx+yk13EiSdRxta67nsHjcAHJyse6cF6s5K671B5TaYucv9bTyWaN8jKkKQDIZ0
			Z8h/pZq4UmEUEz9l6YKHy9v6Dlb2honzhT+Xhq+w3Brvaw2VFn3EK6BlspkENnWA
			a6xK8xuQSXgvopZPKiAlKQTGdMDQMc2PMTiVFrqoM7hD8bEfwzB/onkxEz0tNvjj
			/PIzark5McWvxI0NHWQWM6r6hCm21AvA2H3DkwIDAQABo4IBfTCCAXkwEgYDVR0T
			AQH/BAgwBgEB/wIBADAOBgNVHQ8BAf8EBAMCAYYwfwYIKwYBBQUHAQEEczBxMDIG
			CCsGAQUFBzABhiZodHRwOi8vaXNyZy50cnVzdGlkLm9jc3AuaWRlbnRydXN0LmNv
			bTA7BggrBgEFBQcwAoYvaHR0cDovL2FwcHMuaWRlbnRydXN0LmNvbS9yb290cy9k
			c3Ryb290Y2F4My5wN2MwHwYDVR0jBBgwFoAUxKexpHsscfrb4UuQdf/EFWCFiRAw
			VAYDVR0gBE0wSzAIBgZngQwBAgEwPwYLKwYBBAGC3xMBAQEwMDAuBggrBgEFBQcC
			ARYiaHR0cDovL2Nwcy5yb290LXgxLmxldHNlbmNyeXB0Lm9yZzA8BgNVHR8ENTAz
			MDGgL6AthitodHRwOi8vY3JsLmlkZW50cnVzdC5jb20vRFNUUk9PVENBWDNDUkwu
			Y3JsMB0GA1UdDgQWBBSoSmpjBH3duubRObemRWXv86jsoTANBgkqhkiG9w0BAQsF
			AAOCAQEA3TPXEfNjWDjdGBX7CVW+dla5cEilaUcne8IkCJLxWh9KEik3JHRRHGJo
			uM2VcGfl96S8TihRzZvoroed6ti6WqEBmtzw3Wodatg+VyOeph4EYpr/1wXKtx8/
			wApIvJSwtmVi4MFU5aMqrSDE6ea73Mj2tcMyo5jMd6jmeWUHK8so/joWUoHOUgwu
			X4Po1QYz+3dszkDqMp4fklxBwXRsW10KXzPMTZ+sOPAveyxindmjkW8lGy+QsRlG
			PfZ+G6Z6h7mjem0Y+iWlkYcV4PIWL1iwBi8saCbGS5jN2p8M+X+Q7UNKEkROb3N6
			KOqkqm57TH2H3eDJAkSnh6/DNFu0Qg==
			-----END CERTIFICATE-----`,
			SNICallback: async (host, cb) => {
				try {
					let ctx = cache.get(host);
					if (ctx) return cb(null, ctx);
					const { Item } = await table
						.get({
							TableName,
							Key: { host: 'daniellalehavi.storystore.co.il' },
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
