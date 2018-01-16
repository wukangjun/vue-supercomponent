import {http, COMMON} from '@/utils'
export default{
	actions: {
		// 查询电话本设置管理表格列表接口
		getPhonebookPage({commit}, params){
			return http({
				url: COMMON.baseUrl + '/phonebook/getPhonebookPage',
				params: params,
				method:'POST'
			})
		},
		// ID查询单条数据
		getPhonebookById({commit}, id){
			return http({
				url: COMMON.baseUrl + '/phonebook/getPhonebookById',
				params: {
					id: id
				}
			})
		},
		// ID删除单条数据
		deletePhonebook({commit}, id){
			return http({
				url: COMMON.baseUrl + '/phonebook/deletePhonebook',
				params: {
					id: id
				}
			})
		},
		//修改单条电话本设置数据
		updatePhonebook({commit}, params){
			return http({
				url: COMMON.baseUrl + '/phonebook/updatePhonebook',
				params: params,
				method:'POST'
			})
		},
		// 新增电话本设置
		insertPhonebook({commit}, params){
			return http({
				url: COMMON.baseUrl + '/phonebook/insertPhonebook',
				params: params,
				method:'POST'
			})
		},
		// 电话本设置指令操作
		sendPhonebookCmd({commit}, params){
			return http({
				url: COMMON.baseUrl + '/sendOrder/sendPhonebookCmd',
				params: params,
				method:'POST'
			})
		}
	}
}