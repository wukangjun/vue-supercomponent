import {http, COMMON} from '@/utils'
export default{
	actions: {
		// 查询权限码表列表接口
		findActionPage({commit}, params){
			return http({
				url: COMMON.baseUrl + '/action/findActionPage',
				params: params
			})
		},
		// 删除单条数据
		deleteActionById({commit}, id){
			return http({
				url: COMMON.baseUrl + '/action/deleteActionById',
				params: {
					ids: id
				}
			})
		},
		// 新增权限数据
		insertAction({commit}, params){
			return http({
				url: COMMON.baseUrl + '/action/insertAction',
				params: params
			})
		},
		// 修改权限数据
		updateActionById({commit}, params){
			return http({
				url: COMMON.baseUrl + '/action/updateActionById',
				params: params
			})
		}
	}
}