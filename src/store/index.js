import Vue from 'vue'
import Vuex from 'vuex'
import manageStore from './manageStore'
import monitorStore from './monitorStore'
Vue.use(Vuex)

export default new Vuex.Store({
	modules: Object.assign(manageStore, monitorStore)
})