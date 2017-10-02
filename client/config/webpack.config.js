const webpackConfig = require('../node_modules/@ionic/app-scripts/config/webpack.config');
const webpack = require('webpack');
//
// const ENV = process.env.IONIC_ENV;
// const envConfigFile = require(`./config-${ENV}.json`);
// const fooConfig = envConfigFile.foo;
// const bazConfig = envConfigFile.baz;

webpackConfig.plugins =

  [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity
    })
  ]
