import {http, COMMON} from '@/utils'
export default{
	actions: {
		// 查询车厂管理表格列表接口
		findSysManufacturerPage({commit}, params){
			return http({
				url: COMMON.baseUrl + '/vmanuf/findSysManufacturerPage',
				params: params
			})
		},
		// 删除单条数据
		deleteManufacturersInfo({commit}, id){
			console.log(id)
			return http({
				url: COMMON.baseUrl + '/vmanuf/deleteSysManufacturer',
				params: {
					id: id
				}
			})
		},
		//修改单条数据
		updateManufacturersInfo({commit}, params){
			return http({
				url: COMMON.baseUrl + '/vmanuf/updateSysManufacturer',
				params: params
			})
		},
		// 新增车厂
		insertSysManufacturer({commit}, params){
			return http({
				url: COMMON.baseUrl + '/vmanuf/insertSysManufacturer',
				params: params
			})
		}
	}
}

