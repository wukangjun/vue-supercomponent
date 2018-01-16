import {http, COMMON} from '@/utils'
export default{
	actions: {
		// 查询车辆点播设置管理表格列表接口
		getVehicleInformationPage({commit}, params){
			return http({
				url: COMMON.baseUrl + '/vehicleInformation/getVehicleInformationPage',
				params: params,
				method:'POST'
			})
		},
		// ID查询单条数据
		getVehicleInfomationById({commit}, id){
			return http({
				url: COMMON.baseUrl + '/vehicleInformation/getVehicleInfomationById',
				params: {
					id: id
				}
			})
		},
		// 删除几条数据
		deleteSomeVehicleInformationSettingsCmd({commit}, params){
			return http({
				url: COMMON.baseUrl + '/sendOrder/deleteSomeVehicleInformationSettingsCmd',
				params:params,
				method:'POST'
			})
		},
		// 删除全部数据
		deleteAllVehicleInformationSettingsCmd({commit}, params){
			return http({
				url: COMMON.baseUrl + '/sendOrder/deleteAllVehicleInformationSettingsCmd',
				params:params,
				method:'POST'
			})
		},
		//追加车辆点播设置数据
		appendVehicleInformationSettingsCmd({commit}, params){
			return http({
				url: COMMON.baseUrl + '/sendOrder/appendVehicleInformationSettingsCmd',
				params: params,
				method:'POST'
			})
		},
		// 全部更新车辆点播设置
		updateAllVehicleInformationSettingsCmd({commit}, params){
			return http({
				url: COMMON.baseUrl + '/sendOrder/updateAllVehicleInformationSettingsCmd',
				params: params,
				method:'POST'
			})
		},
		// 发送修改车辆点播设置
		updateVehicleInformationSettingsCmd({commit}, params){
			return http({
				url: COMMON.baseUrl + '/sendOrder/updateVehicleInformationSettingsCmd',
				params: params,
				method:'POST'
			})
		}
	}
}