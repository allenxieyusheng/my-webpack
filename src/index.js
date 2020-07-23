//基本思路
// 获取配置（webpack的默认配置） 根据配置启动webpack 执行
//   1. 从入口的模块开始分析
//    	！有哪些依赖
//    	！转换代码   	这里通过bable去转换
//   2. 递归的分析相关的模块，有哪些依赖，转换代码
  
//   3. 生成浏览器	端可以执行的bundle文件

import { say } from './hello.js'

document.write("Hello"+say("webpack"))