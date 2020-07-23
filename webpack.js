//启动webpack node webpack.js


const options = require('./webpack.config.js')

// 编译器Complier
 const Complier = require('./lib/complier')

 new Complier(options).run();