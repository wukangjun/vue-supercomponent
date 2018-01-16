import {http, COMMON} from '@/utils'
export default{
	actions: {
		// 查询数据字典表格列表接口
		findDictPageDictDataInfo({commit}, params){
			return http({
				url: COMMON.baseUrl + '/sysdict/findDictPage',
				params: params
			})
		},
		// 删除单条数据
		deleteSysDictDataInfo({commit}, id){
			return http({
				url: COMMON.baseUrl + '/sysdict/deleteSysDict',
				params: {
					id: id
				}
			})
		},
		//修改单条数据
		updateSysDictDataInfo({commit}, params){
			return http({
				url: COMMON.baseUrl + '/sysdict/updateSysDict',
				params:params
				
			})
		},
		// 新增字典数据
		insertDictDataInfo({commit}, params){
			return http({
				url: COMMON.baseUrl + '/sysdict/insertDict',
				params: params
			})
		}
	}
}