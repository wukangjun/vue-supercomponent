import {http, COMMON} from '@/utils'
export default{
	actions: {
		// 查询事件管理表格列表接口
		getEventInfoPage({commit}, params){
			return http({
				url: COMMON.baseUrl + '/eventinfo/getEventInfoPage',
				params: params,
				method:'POST'
			})
		},
		// 车辆事件管理表格列表查询接口
		getVehicleEventPage({commit}, params){
			return http({
				url: COMMON.baseUrl + '/eventinfo/getVehicleEventPage',
				params: params,
				method:'POST'
			})
		},
		// 车辆事件指令操作
		sendVehicleEventCmd({commit}, params){
			return http({
				url: COMMON.baseUrl + '/sendOrder/sendVehicleEventCmd',
				params: params,
				method:'POST'
			})
		}
	}
}