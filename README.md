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


## Store Settings
1. `hasCart: true [Boolean]` - Enables cart components.
2. `primaryColor: #000000 [String]` - Should be a valid CSS color format. Used in the 'page-header' component
3. `sendEmail: false [Boolean]` - If true, sends an email to the store info email on checkout response.
4. `showSeeMore: true [Boolean]` - shows the 'See More' button in the first shelf.

## Shelf Types
1. `ADD_TO_CART` [default] - Shelf is shoppable and can be added to cart.
2. `SCROLL_TO` - makes the button scroll to section. Possible values are: `0` (first shelf), `4` (fifth shelf), `LAST_SHELF`.
3. `LINK` - links outside of storystore to a url. `url` property must be present in `data` column.
4. `CONTACT_FORM` - sends an email. Requires an `email[]` (array of emails) property in `data` column.

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


# CDN Sync
aws s3 sync ./client/static s3://storystore-api/ --exclude ".DS_STORE" --delete

# Register new store in production
http://store_slug .storystore.co.il/register