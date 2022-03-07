const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const path = require('path');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		static: path.join(__dirname, 'public'),
		compress: true,
		port: 9000,
	},
});
