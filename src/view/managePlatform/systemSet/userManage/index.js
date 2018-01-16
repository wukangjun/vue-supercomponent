import {http, COMMON} from '@/utils'
export default{
	actions: {
	queryUserInfoList({commit}, params){
			return http({
				url: COMMON.baseUrl + '/userrole/findUserAndRoleCondition',
				params: params
			})
		},
	checkEntUser({commit}, params){
			return http({
				url: COMMON.baseUrl + '/user/checkEntUserIsAt',
				params: params
			})
		}
	}
}