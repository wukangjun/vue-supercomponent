import {http, COMMON} from '@/utils'
export default{
	actions: {
		getEnterpriseByID({commit},params){
			return	http({
				url:COMMON.baseUrl+"/enterprise/getEnterpriseById",
				params:params
			});
		},
		//根据公司ID查询,菜单权限
		getEntMenuTreeById({commit},params){
			return http({
				url:COMMON.baseUrl + "/enterprise/getEntMenuTreeById",
				params:params
			})
		},
		//根据公司ID查询,公司树信息
		findEntTreesByEntId({commit},params){
			return http({
				url:COMMON.baseUrl + "/enterprise/findEntTreesByEntId",
				params:params
			})
		},
		//校验公司名称是否重复
		isExistEnterpriseName({commit},params){
			return http({
				url:COMMON.baseUrl + "/enterprise/isExistEnterpriseName",
				params:params
			})
		},
		//校验登录用户是否存在
		checkEntUserIsAt({commit},params){
			return http({
				url:COMMON.baseUrl + "/user/checkEntUserIsAt",
				params:params
			})
		}
	}
}