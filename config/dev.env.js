'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
Vue.config.silent = true;

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
})
