import {http, COMMON} from '@/utils'
export default{
	actions: {
		findFleetEscrowVehicleList({commit}, params){
			return http({
				url: COMMON.baseUrl + '/fleet/findFleetEscrowVehicleList',
				params: params
			})
		},
		//查询车队可以代管的车辆
		findFleetSureEscrowVehicleList({commit}, params){
			return http({
				url: COMMON.baseUrl + '/fleet/findFleetSureEscrowVehicleList',
				params: params
			})
		},
		//添加车队代管车辆
		addFleetEscrowVehicle({commit}, params){
			return http({
				url: COMMON.baseUrl + '/fleet/addFleetEscrowVehicle',
				params: params
			})
		},
		//批量单个删除车队代管车辆
		deleteFleetEscrowVehicle({commit}, params){
			return http({
				url: COMMON.baseUrl + '/fleet/deleteFleetEscrowVehicle',
				params: params
			})
		}
	}
}