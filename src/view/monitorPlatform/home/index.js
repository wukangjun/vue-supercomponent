export default{
	methods: {
	//获取地图各省份车辆数
	getMapVehcileCount(params){
			return this.$http({
				url:this.$COMMON.baseUrl + "/index/getMapVehcileCount",
				method:'GET',
				params:params
			})
		},
	//在线车辆和离线车辆统计
	findVehicleOnlineCount(params){
			return this.$http({
				url:this.$COMMON.baseUrl + "/index/findVehicleOnlineCount",
				method:'GET',
				params:params
			})
		},
	//获取表格数据
	queryVehicleCountDaily(params){
			return this.$http({
				url:this.$COMMON.baseUrl + "/index/queryVehicleCountDaily.do",
				method:'GET',
				params:params
			})
		}	 
	}
}