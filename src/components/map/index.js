import baidu from './baidu.vue'
import google from './google.vue'
export default{
	install(Vue, options){
		var {ak, key, plugins, control} = options;
		// 默认地图为空对象
		Vue.prototype.$map = {};
		Vue.prototype.$map.ak = ak;
		Vue.prototype.$map.key=key;
		Vue.prototype.$map.plugins = plugins;
		Vue.prototype.$map.control = control;
		// 百度地图组件
		Vue.component('baiduMap', baidu);
		Vue.component('googleMap',google);
	}
}