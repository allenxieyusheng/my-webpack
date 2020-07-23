const path = require("path")

//基础的默认的配置
module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname,"./dist")
	}
}