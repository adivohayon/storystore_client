// nuxt.js
const express = require('express');
const app = express();
const { Nuxt } = require('nuxt');
const path = require('path');

app.get('/health', (req, res) => res.status(200).end());

app.use('/_nuxt', express.static(path.join(__dirname, '../', '.nuxt', 'dist')));
const config = require('../nuxt.config');
const nuxt = new Nuxt(config);
// app.use(nuxt.render);
app.use((req, res) => setTimeout(() => nuxt.render(req, res), 0));

// app.listen(port, () => console.log(`Example app listening on port ${port}!`));
module.exports = app;
