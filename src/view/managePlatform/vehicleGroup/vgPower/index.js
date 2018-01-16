export default{
	methods: {
		//根据车组ID查询车辆分页
		findVehicleByFleetIdforPage(params){
			return this.$http({
				url:this.$COMMON.baseUrl + "/vehicle/findVehicleByFleetIdforPage",
				method:'GET',
				params:params
			})
		},
		//获取车队授权用户列表
		getFleetUserList(params){
			return this.$http({
				url:this.$COMMON.baseUrl + "/fleet/getFleetUserList",
				params:params
			})
		},
		//获取公司下车队未授权的用户
		getEntNoFleetUserList(params){
			return this.$http({
				url:this.$COMMON.baseUrl + "/fleet/getEntNoFleetUserList",
				params:params
			})
		},
		//查询公司下车队可以授权的车辆
		findNoAuthorizeVehicleforPage(params){
			return this.$http({
				url:this.$COMMON.baseUrl + "/fleet/findNoAuthorizeVehicleforPage",
				params:params
			})
		},
		//车队绑定车辆
		addFleetVehicle(params){
			return this.$http({
				url:this.$COMMON.baseUrl + "/fleet/addFleetVehicle",
				params:params
			})
		},
		//删除车队授权用户
		deleteFleetUserList(params){
			return this.$http({
				url:this.$COMMON.baseUrl + "/fleet/deleteFleetUserList",
				params:params
			})
		},
		//添加车队授权用户
		addFleetUser(params){
			return this.$http({
				url:this.$COMMON.baseUrl + "/fleet/addFleetUser",
				params:params
			})
		}
	}
}