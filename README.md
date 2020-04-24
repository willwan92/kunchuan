# kunchuan-admin

项目前端工程基于vue cli 2.x构建，基于vue2.x开发

## Build Setup 打包设置

``` bash
# install dependencies 安装依赖
npm install

# serve with hot reload at localhost:8080 在本地运行项目
npm run dev

# build for production with minification 打包生产环境代码
npm run build

# build for production and view the bundle analyzer report 打包生产环境代码并给出代码包分析报告
npm run build --report
```

### 项目结构
     config/ : webpack相关配置, 包括proxy/host/gzip/
     src/ : 源代码
     dist/ : 打包后文件
     build/ : 开发及生产环境下webpack配置, 包括loader/plugins等
     static/ :静态资源- 网站图标
     src/assets/ : less,img,font等资源
     src/common/ : 通用部分, 如工具类函数等
     src/components/ : 通用组件
     src/pages/ : 页面文件
     src/router/ : 前端路由(已实现懒加载)
     
### 插件
    0. package.json里 dependencies: 需要打包上线的插件(npm i xxx -S) devependencies: 本地开发使用 (npm i xxx -D), 不推荐使用cnpm
    1. vue 前端框架
    2. vue-router 前端路由插件
		3. axios http请求函数库
    4. element-ui. UI框架
    5. normalize.css  统一浏览器差异样式文件
 
### 项目web地址及登录账号

[开发环境](http://localhost:8080/)

登录账号: admin; 密码: admin@123

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
