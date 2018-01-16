import {http, COMMON} from '@/utils'
export default{
	actions: {
		//品牌表格接口
		queryVehicleBrandInfoList({commit}, params){
			return http({
				url: COMMON.commonPath + 'vehicleBrand/queryVehicleBrandInfoList.do',
				params: params
			})
		}
	}
}