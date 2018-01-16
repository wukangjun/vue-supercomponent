import {http, COMMON} from '@/utils'
export default{
	actions: {
		// 上级平台协议分组分页列表
		getProtocolTransferGroupPage({commit}, params){
			return http({
				url: COMMON.baseUrl + '/superiorPlatform/getProtocolTransferGroupPage',
				params: params,
				method:'POST'
			})
		},
		// 上级平台数据交换-普通车辆数据转发分页
		getProtocolTransferVehiclePage({commit}, params){
			return http({
				url: COMMON.baseUrl + '/superiorPlatform/getProtocolTransferVehiclePage',
				params: params,
				method:'POST'
			})
		},
		// 上级平台数据交换-跨域货车数据转发分页
		getDownCrossVanStaticinfoPage({commit}, params){
			return http({
				url: COMMON.baseUrl + '/superiorPlatform/getDownCrossVanStaticinfoPage',
				params: params,
				method:'POST'
			})
		},
		// 上级平台数据交换-跨域客车数据转发分页
		getDownCrossCoachStaticinfoPage({commit}, params){
			return http({
				url: COMMON.baseUrl + '/superiorPlatform/getDownCrossCoachStaticinfoPage',
				params: params,
				method:'POST'
			})
		},
		// 上级平台数据交换指令发送
		sendSkipAreaVehicleLocationCmd({commit}, params){
			return http({
				url: COMMON.baseUrl + '/sendOrder/sendSkipAreaVehicleLocationCmd',
				params: params,
				method:'POST'
			})
		}
	}
}