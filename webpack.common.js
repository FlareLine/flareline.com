const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	entry: './src/index.tsx',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'esbuild-loader',
				options: {
					loader: 'tsx',
					target: 'es2015',
				},
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [
			'.js',
			'.ts',
			'.tsx',
		],
	},
	output: {
		filename: 'bundle.[chunkhash].js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: './public/index.html',
		}),
	],
};
