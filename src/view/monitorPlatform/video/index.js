/*
* @Author: admin
* @Date:   2017-09-29 10:05:57
* @Last Modified by:   admin
* @Last Modified time: 2017-09-29 15:05:01
*/
import Vue from 'vue'
import { http, COMMON, service } from '@/utils'
export default{
  state: {
    videoType: {
      7: "/RMvideo",
      13: "/video"
    }
  },
  mutations: {
    getVideoLogin(state, params){
      if('dvrType' in params){
        localStorage.setItem('VideologinData',JSON.stringify(params));
        state.videoType[params.dvrType]!= undefined ? service.winOpen(state.videoType[params.dvrType]) : null;

      }
    }
  },
  actions:{
    getVideoLogin({commit}, id){
      http({
          url: COMMON.baseUrl + '/vehicle/queryVehicleDVRInfo',
          params: {
            vehicleId: id
          }
      }).then(data => {
          if(data.flag && !service.isArray(data.data)){
            commit('getVideoLogin', data.data)
          }else{
            Vue.prototype.$message.error('该车辆暂无视频');
          }       
      })
    }
  }
}