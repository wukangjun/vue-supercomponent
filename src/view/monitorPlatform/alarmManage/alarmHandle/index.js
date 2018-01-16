export default{
	methods: {
		// 查询报警表格接口
		getAlarmSearch(params){
			return this.$http({
				url: this.$COMMON.baseUrl + '/alarmInfo/findAlarmInfoList.do',
				params: params
			})
		}	 
	}
}