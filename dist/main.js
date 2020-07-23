(function(graph){
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
        require('./src/index.js') //./src/index.js

        console.log("graph",graph)
    })({"./src/index.js":{"dependencies":{"./hello.js":"./src/hello.js"},"code":"\"use strict\";\n\nvar _hello = require(\"./hello.js\");\n\n//基本思路\n// 获取配置（webpack的默认配置） 根据配置启动webpack 执行\n//   1. 从入口的模块开始分析\n//    \t！有哪些依赖\n//    \t！转换代码   \t这里通过bable去转换\n//   2. 递归的分析相关的模块，有哪些依赖，转换代码\n//   3. 生成浏览器\t端可以执行的bundle文件\ndocument.write(\"Hello\" + (0, _hello.say)(\"webpack\"));"},"./src/hello.js":{"dependencies":{"./add.js":"./src/add.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.say = void 0;\n\nvar _add = require(\"./add.js\");\n\nvar say = function say(str) {\n  return str + (0, _add.add)();\n};\n\nexports.say = say;"},"./src/add.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.add = void 0;\n\nvar add = function add() {\n  return \"我是模块三\";\n};\n\nexports.add = add;"}})