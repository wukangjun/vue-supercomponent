import {http, COMMON} from '@/utils'
export default{
	actions: {
		// 查询事件定义管理表格列表接口
		getEventInfoPageEventDefine({commit}, params){
			return http({
				url: COMMON.baseUrl + '/eventinfo/getEventInfoPage',
				params: params,
				method:'POST'
			})
		},
		// ID查询单条数据
		getEventInfoById({commit}, id){
			return http({
				url: COMMON.baseUrl + '/eventinfo/getEventInfoById',
				params: {
					id: id
				}
			})
		},
		// ID删除单条数据
		deleteEventInfoById({commit}, id){
			return http({
				url: COMMON.baseUrl + '/eventinfo/deleteEventInfoById',
				params: {
					id: id
				}
			})
		},
		// 批量删除单条数据
		deleteEventInfoByBatch({commit}, ids){
			return http({
				url: COMMON.baseUrl + '/eventinfo/deleteEventInfoByBatch',
				params: {
					ids: ids
				}
			})
		},
		//修改单条事件定义数据
		updateEventInfo({commit}, params){
			return http({
				url: COMMON.baseUrl + '/eventinfo/updateEventInfo',
				params: params,
				method:'POST'
			})
		},
		// 新增事件定义
		insertEventInfo({commit}, params){
			return http({
				url: COMMON.baseUrl + '/eventinfo/insertEventInfo',
				params: params,
				method:'POST'
			})
		}
	}
}