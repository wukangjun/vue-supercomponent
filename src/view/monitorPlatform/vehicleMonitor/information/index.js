import {http, COMMON} from '@/utils'
export default{
	actions: {
		// 查询信息管理表格列表接口
		getInformationPage({commit}, params){
			return http({
				url: COMMON.baseUrl + '/information/getInformationPage',
				params: params,
				method:'POST'
			})
		},
		// ID查询单条数据
		getInformationById({commit}, id){
			return http({
				url: COMMON.baseUrl + '/information/getInformationById',
				params: {
					id: id
				}
			})
		},
		// ID删除单条数据
		deleteInformationById({commit}, id){
			return http({
				url: COMMON.baseUrl + '/information/deleteInformationById',
				params: {
					id: id
				}
			})
		},
		// 批量删除单条数据
		deleteInformationByBatch({commit}, ids){
			return http({
				url: COMMON.baseUrl + '/information/deleteInformationByBatch',
				params: {
					ids: ids
				}
			})
		},
		//修改单条信息数据
		updateInformation({commit}, params){
			return http({
				url: COMMON.baseUrl + '/information/updateInformation',
				params: params,
				method:'POST'
			})
		},
		// 新增信息
		insertInformation({commit}, params){
			return http({
				url: COMMON.baseUrl + '/information/insertInformation',
				params: params,
				method:'POST'
			})
		},
		// 获取所有集合对象列表
		getAllInformationTypeList({commit}){
			return http({
				url: COMMON.baseUrl + '/informationType/getAllInformationTypeList',
				method:'POST'
			})
		}
	}
}