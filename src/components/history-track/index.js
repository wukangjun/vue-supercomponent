export default{
	methods: {
		//轨迹查询--type: 'json'
		getVehicleTrackByBigData(params, type='arraybuffer'){
			return this.$http({
				//url: this.$COMMON.baseUrl + '/vtrack/getVehicleTrackByBigData.do',
				url: this.$COMMON.baseUrl + '/vtrack/findDailyMileage.do',
				responseType: type,
				params: params
			})
		}
	}
}