# node-require
commonjs 模块加载模拟实现

加载流程

- 路径分析：依据标识符确定模块位置
- 文件定位：确定目标模块中具体的文件及文件类型
- 编译执行：采用对应的方式完成文件的编译执行

js 文件的编译执行：
- 使用 fs 模块同步读入目标文件内容
- 对文件进行语法包装，生成可执行 js 函数
- 调用函数时传入 exports、module、require 等属性值

json 文件的编译执行
- 将读取到的内容通过 JSON.parse() 进行解析

测试

```
  const obj = myRequire('./m')  //加载 ./m.js

  const data = myRequire('./data')   //加载 ./data.json
```