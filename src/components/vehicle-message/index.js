import { http, COMMON, service } from '@/utils'
import filter from '@/utils/filter'
export default {
    state: { 
       
        //记住勾选的能力项
        isLocalCar:'',
        //解锁时保存的数据信息
        isAllInfo:{},
        //显示锁车是否
        isShowCar:false,
        //guanbi
        isOptions:true,
        //限制密码的保存
        isLocalPassword:'',
     
    },
    mutations: {
   
        isLocalCar(state, params){
            state.isLocalCar = params;
        },
        isAllInfo(state, params){
            state.isAllInfo= params;
        },

        isShowCar(state, params){
            state.isShowCar = params;
        },
        isOptions(state, params){
            state.isOptions = params;
        },
        isLocalPassword(state, params){
            state.isLocalPassword = params;
        },
      
    },
    actions: {
      
        isLocalPassword({commit}, params){
            commit('isLocalPassword', params)
        },
        isLocalCar({ commit }, params) {
            commit('isLocalCar', params)
        },
        isAllInfo({ commit }, params) {
            commit('isAllInfo', params)
        },
        isShowCar({ commit }, params) {
            commit('isShowCar', params)
        },
        isOptions({ commit }, params) {
            commit('isOptions', params)
        },

    },
    getters: {
        isLocalPassword(state) {
            return state.isLocalPassword
        },
        isLocalCar(state) {
            return state.isLocalCar
        },
        isAllInfo(state) {
            return state.isAllInfo
        },
        isShowCar(state) {
            return state.isShowCar
        },
        isOptions(state) {
            return state.isOptions
        },
    }
}