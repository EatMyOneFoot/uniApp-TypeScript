import Vue from 'vue'
import App from './App.vue'
import store from '@/store'
// 引入uView
import uView from "uview-ui";
Vue.use(uView);
// // 尝试判断在根目录的/store中是否有$u.mixin.ts
// let vuexStore = require('@/store/$u.mixin.ts');
// Vue.mixin(vuexStore);

Vue.config.productionTip = false

new App({ store }).$mount()
