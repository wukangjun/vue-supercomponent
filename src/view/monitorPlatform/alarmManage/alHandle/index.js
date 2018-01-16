export default{
	methods: {
		// 报警表格接口
		getAlarmSearch(params){
			return this.$http({
				url: this.$COMMON.baseUrl + '/alarmInfo/findAlarmInfoList.do',
				params: params
			})
		},
		//当前告警接口 
		getAlarm(params){
			return this.$http({
				url: this.$COMMON.baseUrl + '/alarmInfo/findAlarmInfoListByVehicleId',
				params: params
			})
		}
		
	}
}