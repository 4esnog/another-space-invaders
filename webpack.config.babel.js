import path from 'path';

export default {
	entry: {
	  script: './target/index.js'
	},
	output: {
		path: path.join(__dirname, 'public'),
		publicPath: '../public/',
		filename: '[name].bundle.js',
		chunkFilename: '[id].bundle.js'
	}
};
