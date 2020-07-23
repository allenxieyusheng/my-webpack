// 编译器 
// 1. 寻找依赖关系
// 2. babel 转换代码


const fs = require("fs")
const path = require("path")


const {getAst, getDependencies, getCode }  = require ('./parser.js')


// 导出class
module.exports = class Complier{
	/**
		@param options webpack 配置
	*/	

	constructor(options){
		this.entry = options.entry;
		this.output = options.output;
		this.module = [] //所有的模块集合
	}
	
	run(){
		const info  =  this.build(this.entry) //先入口文件解析
		this.module.push(info)

		// 重点来了 如何循环的遍历
		for (var i = 0; i<this.module.length;i++) {
			const item = this.module[i];
			const { dependencies }  = item;
			if(dependencies){
				//如果当前模块存在依赖，那么遍历这个 加入到this.module里面
				for(let j in dependencies){
					console.log(dependencies[j])
					this.module.push(this.build(dependencies[j]))
				}
			}
		}

		//转换this.module里面的数据结构，成浏览器可以直接运行的语法结构

		//key 是名称 value是依赖和code
		const obj = {};
		this.module.forEach(item=> {
		  obj[item.fileName] = {
		  	dependencies: item.dependencies,
		  	code: item.code
		  }
		})

		console.log(obj)

		//生成代码文件
		this.file(obj)
	}
	/**
	* 解析出模块的名称，模块的依赖，以及bable编译后的代码	
	* @params fileName
	*/
	build(fileName){
		//ast 抽象语法树 --》json
		let ast = getAst(fileName)
		//依赖obj
		let dependencies = getDependencies(ast,fileName)
		//bable编译的code
		let code = getCode(ast)
		return {
			fileName,
			dependencies,
			code
		}


	}
	/**
	* 将生成的全部依赖以及相关的code 转换成浏览器可以运行的代码
	* 执行的顺序是从深到入口
	*/
	file(code){
		//获取输出信息
		 const filePath = path.join(this.output.path,this.output.filename)
		 const newCode = JSON.stringify(code) 

		 //code里面有require 这个方法，需要自定义
		 const bundle = `(function(graph){
        function require(module){
        	
            function localRequire(relativePath){
               return require(graph[module].dependencies[relativePath])
            }

            var exports = {};

            (function(require,exports,code){
                eval(code)
            })(localRequire,exports,graph[module].code)

            console.log("111",exports)

            return exports;
        }
        require('${this.entry}') //./src/index.js

        console.log("graph",graph)
    })(${newCode})`;

		 // 1. 创建文件夹
		 fs.mkdir("dist",err=>{ //创建失败是因为之前有
			//写入文件
			 fs.writeFileSync(filePath, bundle, "utf-8")

		})


	}


	 //graph code obj list
	 // start(graph) {
		// 	//定义require方法,
		// 	function require(module) {
		// 		//获取绝对路径
		// 	   function localRequire(relativePath) {
		// 	   	 return require(graph[module].dependencies[relativePath])
		// 	   }
		// 	   var exports = {}
		// 	   (function (require,exports,graph[module].code) {
		// 	   	eval(code)
		// 	   })(localRequire,exports,graph[module].code)
		// 	   return 	
		// 	}

		// 	require('${this.entry}')	 //入口文件路径	
	 // }



}










//this.module里面的数据结构



// [
//   {
//     fileName: './src/index.js',  //文件绝对地址
//     dependencies: { './hello.js': './src/hello.js' }, //文件依赖
//。    转换后的代码
//     code: '"use strict";\n' + 
//       '\n' +
//       'var _hello = require("./hello.js");\n' +
//       '\n' +
//       '//基本思路\n' +
//       '// 获取配置（webpack的默认配置） 根据配置启动webpack 执行\n' +
//       '//   1. 从入口的模块开始分析\n' +
//       '//    \t！有哪些依赖\n' +
//       '//    \t！转换代码   \t这里通过bable去转换\n' +
//       '//   2. 递归的分析相关的模块，有哪些依赖，转换代码\n' +
//       '//   3. 生成浏览器\t端可以执行的bundle文件\n' +
//       'document.write("Hello" + (0, _hello.say)("webpack"));'
//   },
//   {
//     fileName: './src/hello.js',
//     dependencies: { './add.js': './src/add.js' },
//     code: '"use strict";\n' +
//       '\n' +
//       'Object.defineProperty(exports, "__esModule", {\n' +
//       '  value: true\n' +
//       '});\n' +
//       'exports.say = void 0;\n' +
//       '\n' +
//       'var _add = require("./add.js");\n' +
//       '\n' +
//       'var say = function say(str) {\n' +
//       '  return str + (0, _add.add)();\n' +
//       '};\n' +
//       '\n' +
//       'exports.say = say;'
//   }
// ]








