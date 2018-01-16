import {http, COMMON} from '@/utils'
export default{
	actions: {
		// 查询车辆数据透传数据列表分页接口
		getTransparentinfoSendlogPage({commit}, params){
			return http({
				url: COMMON.baseUrl + '/transparentinfo/getTransparentinfoSendlogPage',
				params: params,
				method:'POST'
			})
		},
		// 车辆透传下发指令操作
		sendTransparentinfoSendCmd({commit}, params){
			return http({
				url: COMMON.baseUrl + '/sendOrder/sendTransparentinfoSendCmd',
				params: params,
				method:'POST'
			})
		}
	}
}