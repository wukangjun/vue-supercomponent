import {http, COMMON} from '@/utils'
export default{
	actions: {
		// 查询信息类型管理表格列表接口
		getInformationTypePage({commit}, params){
			return http({
				url: COMMON.baseUrl + '/informationType/getInformationTypePage',
				params: params,
				method:'POST'
			})
		},
		// ID查询单条数据
		getInformationTypeById({commit}, id){
			return http({
				url: COMMON.baseUrl + '/informationType/getInformationTypeById',
				params: {
					id: id
				}
			})
		},
		// ID删除单条数据
		deleteInformationTypeById({commit}, id){
			return http({
				url: COMMON.baseUrl + '/informationType/deleteInformationTypeById',
				params: {
					id: id
				}
			})
		},
		// 批量删除单条数据
		deleteInformationTypeByBatch({commit}, ids){
			return http({
				url: COMMON.baseUrl + '/informationType/deleteInformationTypeByBatch',
				params: {
					ids: ids
				}
			})
		},
		//修改单条信息类型数据
		updateInformationType({commit}, params){
			return http({
				url: COMMON.baseUrl + '/informationType/updateInformationType',
				params: params,
				method:'POST'
			})
		},
		// 新增信息类型
		insertInformationType({commit}, params){
			return http({
				url: COMMON.baseUrl + '/informationType/insertInformationType',
				params: params,
				method:'POST'
			})
		}
	}
}