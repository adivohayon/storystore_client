# st_product-page

> My amazing Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).


## Dev Setup

1. `npm install`
2. SSL certificate setup:
	* [Follow this tutorial](https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec)
	* Add `server.crt` & `server.key` to project root
3. Update `/etc/hosts` for subdomains:
	```
	127.0.0.1 storystore.dev
	127.0.0.1 www.storystore.dev
	127.0.0.1 simplyfashion.storystore.dev
	127.0.0.1 nostore.storystore.dev
	```
4. `npm run dev`
5. [https://simplyfashion.storystore.dev](https://simplyfashion.storystore.dev)
6. To run on mobile:
	* `openssl x509 -inform PEM -in rootCA.pem -outform DER -out storystore.cer`
	* Send to phone


### Local SSL
1. 