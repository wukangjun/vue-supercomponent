import {http, COMMON} from '@/utils'
export default{
	actions: {
		queryCompanyInfoList({commit}, params){
			return http({
				url: COMMON.baseUrl + '/enterprise/getEnterpriseTreeList',
				params: params
			});
		},
		queryRoleInfoList({commit},params){
			return http({
				url: COMMON.baseUrl + '/role/findRolePage',
				params: params
			});
		},
		getMenuByenterpriseIdAndroleIds({commit},params){
			return http({
				url: COMMON.baseUrl + '/rolemenu/findRoleMenuActionBySysUser',
				params: params
			});
		},
			findRoleMenu({commit},params){
			return http({
				url: COMMON.baseUrl + '/role/findRoleMenu',
				params: params
			});
		}
	}
}