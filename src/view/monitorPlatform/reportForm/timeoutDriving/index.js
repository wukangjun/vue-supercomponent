
export default{
	methods: {
		// 超时驾驶表格接口
		queryOverTimeDrive(params){
			return this.$http({
				url: this.$COMMON.baseUrl + '/overTimeDrive/queryOverTimeDrive',
				params: params
			})
		}	 
	}
}