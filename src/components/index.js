/*
* name: 所有公司的业务组件的出口
* author: wukangjun
* time: 2017.07.11
*/
import grid from './grid/grid.vue'
import baidu from './map/baidu.vue'
import google from './map/google.vue'
import gaode from './map/gaode.vue'
import span from './span/span.vue'
import dropdownTree from './dropdown-tree/dropdown.tree.vue'
import powerTool from './power-tool/power.tool.vue'
import tableTool from './power-tool/power.table.tool.vue'
import clickOutHide from './clickOutHide/clickOutSide.js'
// import 'vue-awesome/icons'
// import Icon from 'vue-awesome/components/Icon'
import scrollbar from './scrollbar/scrollbar.vue'
import cvIcon from './icon/icon.vue'
import cvHeader from './cv-header/cv.header.vue'
import cvContent from './cv-content/cv.content.vue'
import cvShowVehicle from './show-vehicle/show.vehicle.vue'
import cvPasswordStrength from './password-strength/password.strength.vue'
import instruction from './instruction'
import instruct from './instruction/src/instruction.public.js'

import COMMON from '@/utils/config'
import http from '@/utils/http'
import myJq from '@/utils/dom'
import service from '@/utils/service'
import filter from '@/utils/filter'


const components = [
	grid,
	baidu,
	google,
	gaode,
	span,
	dropdownTree,
	powerTool,
	tableTool,
	scrollbar,
	cvIcon,
	cvHeader,
	cvContent,
	cvShowVehicle,
	cvPasswordStrength
]

export default{
	install(Vue, options){
		var {ak, key, plugins, control} = options;
		// 默认地图为空对象
		Vue.prototype.$map = {};
		Vue.prototype.$map.ak = ak;
		Vue.prototype.$map.key = key;
		Vue.prototype.$map.plugins = plugins;
		Vue.prototype.$map.control = control;

		// 组件
		components.map(component => {
			Vue.component(component.name, component)
		})

		// 指令
		Vue.directive('clickoutside', clickOutHide)
		Vue.directive('instruction', instruction)
		Vue.prototype.$instruction = instruct;

		// 过滤
		Object.keys(filter).forEach(val => {
			Vue.filter(val, filter[val])
		})

		// 公共服务
		Vue.prototype.$COMMON = COMMON
		Vue.prototype.$http = http
		Vue.prototype.$myJq = myJq
		Vue.prototype.$service = service
		Vue.prototype.$filter = filter
	}
}