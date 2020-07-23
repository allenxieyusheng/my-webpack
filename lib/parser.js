//babel 编译

const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default; //可以用来遍历更新@babel/parser生成的AST，寻找特定的节点
const { transformFromAst } = require("@babel/core");


module.exports = {
	getAst: fileName => {
		//分析模块 获取AST抽象语法树 JSON
		let content = fs.readFileSync(fileName,"utf-8") //读取文件，
		return parser.parse(content,{ //模块化转换
			sourceType: "module" 
		})
	},

	//获取依赖

	getDependencies: (ast,fileName) => {
		const dependencies = {} //依赖OBJ
		traverse(ast,{
			ImportDeclaration({node}){
				const dirname = path.dirname(fileName); //解析地址.相对地址
				const newPath = "./"+path.join(dirname,node.source.value) //绝对地址
				//一个模块的依赖的对象 key:value key是相对地址，value是绝对地址	
				dependencies[node.source.value] = newPath;
			}
		})
		return dependencies

	},
	getCode: ast => {
    const { code } = transformFromAst(ast, null, {
	      presets: ["@babel/preset-env"]
	    });
	    return code;
  	}
}