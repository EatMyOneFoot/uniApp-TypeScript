## 总览

[vue-typescript-uniapp](https://github.com/EatMyOneFoot/vue-typescript-uniapp) 是 UNI-APP 前端解决方案的一个十分简单的基础模版, 它基于 [vue](https://github.com/vuejs/vue), [typescript](https://www.typescriptlang.org/) 和 [uView-ui](http://www.uviewui.com/components/intro.html)实现。

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.11-brightgreen.svg" alt="vue">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/typescript-3.6.4-brightgreen.svg" alt="typescript">
  </a>
  <a href="https://uniapp.dcloud.io/api/README">
    <img src="https://img.shields.io/badge/uniApp-blue.svg" alt="uniApp">
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
