const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const DotEnv = require("dotenv-webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const output = {
	filename: "[name].js",
	path: path.resolve(__dirname, "public"),
	libraryTarget: "window",
	clean: true,
};

const resolve = {
	extensions: [".js"],
};

const plugins = [
	new HtmlWebpackPlugin({
		filename: "index.html",
		template: "src/index.html",
		inject: true,
		chunks: ["main"],
	}),
	new MiniCssExtractPlugin({
		filename: "[contenthash].css",
	}),
	new DotEnv(),
];

const optimization = {
	minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
	minimize: true,
	splitChunks: {
		chunks: "all",
	},
};

const config = {
	entry: {
		main: ["./src/index.js"],
		locationClass: ["./src/js/CurrentLocation.js"],
		dataFunctions: ["./src/js/dataFunctions.js"],
		domFunctions: ["./src/js/domFunctions.js"],
	},
	mode: process.env.NODE_ENV === "development" ? "development" : "production",
	output,
	module: {
		rules: [
			{
				test: /\.(jpeg|jpg|png|gif|JPG)$/,
				loader: "file-loader",
				options: {
					outputPath: "img",
					name: "[name].[ext]",
				},
			},
			{
				test: /\.(scss)$/,
				use: [
					{ loader: MiniCssExtractPlugin.loader },
					{
						loader: "css-loader",
					},
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: () => [require("autoprefixer")],
							},
						},
					},
					{
						loader: "sass-loader",
					},
				],
			},
			{ test: /\.css$/, use: ["style-loader", "css-loader"] },
		],
	},
	resolve,
	plugins,
	stats: "minimal",
	optimization,
	devServer: {
		static: path.resolve(__dirname, "public"),
		compress: true,
		port: 8080,
		hot: true,
	},
};

module.exports = config;
