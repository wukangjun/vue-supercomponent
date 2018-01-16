import {http, COMMON} from '@/utils'
export default{
	actions: {
		// 查询司机管理表格列表接口
		findDriverPage({commit}, params){
			return http({
				url: COMMON.baseUrl + '/driver/findDriverPage',
				params: params
			})
		},
		// 删除单条数据
		deleteDriver({commit}, id){
			return http({
				url: COMMON.baseUrl + '/driver/deleteDriver',
				params: {
					id: id
				}
			})
		},
		//修改单条司机数据
		updateDriverInfo({commit}, params){
			return http({
				url: COMMON.baseUrl + '/driver/updateDriver',
				params: params
			})
		},
		// 新增司机
		insertDriver({commit}, params){
			return http({
				url: COMMON.baseUrl + '/driver/insertDriver',
				params: params
			})
		}
	}
}