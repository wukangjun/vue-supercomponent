import {http, COMMON} from '@/utils'
export default{
	actions: {
		// 获取车辆分页数据列表
		findAllVehiclePage({commit}, params){
			return http({
				url: COMMON.baseUrl + '/vehicle/findAllVehiclePage',
				params: params,
				method:'POST'
			})
		},
		// 文本信息发送接口
		textSendDown({commit}, params){
			return http({
				url: COMMON.baseUrl + '/sendOrder/textWithIntFlag',
				params: params,
				method:'POST'
			})
		}
	}
}