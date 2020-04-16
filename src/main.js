// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import lodash from "lodash"
import moment from "moment"
import cookies from 'js-cookies'
import 'normalize.css/normalize.css'
import './assets/styles/common.less'
import './theme/index.css'
import ElementUI from 'element-ui'
import * as Components from '@/components'
import { post, getFuzz, postFuzz } from "common/request"
import './assets/iconfont/iconfont.css'


Vue.use(ElementUI);
Vue.config.productionTip = false;


Vue.prototype._ = lodash;
Vue.prototype.$cookies = cookies;
Vue.prototype.post = post;
Vue.prototype.moment = moment;
Vue.prototype.getFuzz = getFuzz;
Vue.prototype.postFuzz = postFuzz;

Object.keys(Components).forEach(key => {
    const component = Components[key];
    Vue.component(component.name, component)
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})