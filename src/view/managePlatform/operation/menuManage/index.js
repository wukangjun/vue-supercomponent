import {http, COMMON} from '@/utils'
export default{
	actions: {
		// 查询菜单表格列表接口
		findMenuPageMenuInfo({commit}, params){
			return http({
				url: COMMON.baseUrl + '/menu/findMenuPage',
				params: params
			})
		},
		// 删除单条数据
		deleteMenuByIdMenuInfo({commit}, id){
			return http({
				url: COMMON.baseUrl + '/menu/deleteMenuById',
				params: {
					id:id
				}
			})
		},
		//修改单条菜单数据
		updateMenu({commit},params){
			return http({
				url: COMMON.baseUrl + '/menu/updateMenuById',
				params:params
				
			})
		},
		//根据id查询菜单
		getMenuById({commit},params){
			return http({
				url: COMMON.baseUrl + '/menu/getMenuById',
				params:params
				
			})
		},
		//菜单类型数据
		menuStuats({commit}, params){
			return http({
				url: COMMON.baseUrl + '/sys/findAllPlatForm',
				params: params
			})
		},
		// 新增菜单数据
		insertMenuInfo({commit}, params){
			return http({
				url: COMMON.baseUrl + '/menu/insertMenu',
				params: params
			})
		},
		//权限数据
		findAllAction({commit}, params){
			return http({
				url: COMMON.baseUrl + '/action/findAllAction',
				params: params
			})
		}
	
	}
}