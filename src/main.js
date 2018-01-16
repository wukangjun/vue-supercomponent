// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import './themeColor.scss'
//import 'element-ui/lib/theme-default/index.css'
import business from './components'
import language from './lib/local'
import './assets/css/iconfont.css'

Vue.config.productionTip = false;

Vue.use(VueI18n)
Vue.use(ElementUI)
// Vue.use(VueWebsocket, "ws://ip:8080");
// 全局引入公司业务组件(目前控件:ScaleControl,NavigationControl,CityListControl)
Vue.use(business, {
  key: 'AIzaSyDMvlx7bDzZPe-7Tf7pmmeV-V8oMaYjRac',
  ak:'8GrVRotzGKj3xzIRu07hCzx2',
	//ak: 'B6b128c59f9e96eb37d15805ad3190371121',
	control: ['ScaleControl', 'NavigationControl', 'OverviewMapControl', 'CityListControl']
})

language.forEach(val => {
	Vue.locale(val.name, val)
})

Object.defineProperty(Vue.prototype.$COMMON, 'store', {
  value: JSON.stringify(store.state),
  writable: false,
  enumerable:false,
  configurable: false
});

const textSwitch = {
  gonganju: '公安部第三研究所',
  zhatuche: '智能渣土车监管平台',
  shihang: '上海势航网络科技有限公司'
};
document.title = textSwitch[Vue.prototype.$COMMON.switch];

Vue.config.lang = localStorage.getItem('language') || 'zh-cn'


new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
