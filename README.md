## Overview

[uniApp-TypeScript](https://github.com/EatMyOneFoot/uniApp-TypeScript) 是 UNI-APP 前端解决方案的一个十分简单的基础模版，偶尔会添加一些在工作中用过的组件进来  
它使用[vue-cli](https://cli.vuejs.org/zh/config/)创建，
接入了[TypeScript](https://www.typescriptlang.org/)，
配置了[uView](https://www.uviewui.com/components/intro.html)  
uView是uni-app生态专用的UI框架，整合了非常多组件，功能丰富、文档清晰，但不支持nvue。当然你也可以选择其他的[全端兼容ui库](https://ask.dcloud.net.cn/article/35489)

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.11-brightgreen.svg" alt="vue">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/typescript-3.6.4-brightgreen.svg" alt="typescript">
  </a>
  <a href="https://uniapp.dcloud.io/api/README">
    <img src="https://img.shields.io/badge/uniApp-HBuilderX版本3.1.4-blue.svg" alt="uniApp">
  </a>
  <a href="http://www.uviewui.com/components/intro.html">
    <img src="https://img.shields.io/badge/uView-1.8.3-brightgreen.svg" alt="uView-ui">
  </a>
</p>


## Project Structure

```bash
├── public                     # public static assets (directly copied)
│   └── index.html             # index.html template
├── src                        # main source code
│   ├── api                    # api service
│   ├── components             # global components
│   ├── pages                  # views
│   ├── static                 # module assets like fonts, images (processed by webpack)
│   ├── store                  # store
│   ├── utils                  # global utils
│   ├── App.vue                # main app component
│   ├── main.ts                # app entry file
│   ├── manifest.json          # 5 + mobile App setting file
│   ├── pages.json             # Global configuration file
│   ├── sfc.d.ts               # type definition shims
│   └── uni.scss               # Global SCSS
├── .env.xxx                   # env variable configuration
├── babel.config.js            # babel config
├── package.json               # package.json
├── tsconfig.json              # typescript config
└── vue.config.js              # vue-cli config
```

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

## Problem

* 因为项目是使用vue-cli创建的，所以打包App的时候可能会出现弹窗提示："当前项目的cli版本和云打包服务器的cli版本不一致，有可能出现兼容性问题请升级项目的cli版本后重新打包或继续打包"
  * <img width="320px" height="240px" src="https://github.com/EatMyOneFoot/uniApp-TypeScript/blob/master/src/static/20210703110525.png">
  * [DCloud 社区给的解决方法](https://ask.dcloud.net.cn/article/35627)
  * 我一般是直接批量修改 package.json 中 uni 相关依赖为指定的版本号('^2.0.0-31420210305001' 改为对应的版本号) 然后重新 yarn install
