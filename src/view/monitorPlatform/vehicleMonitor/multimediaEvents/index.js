export default{
	methods: {
		// 搜索车辆表格接口
		getMediaEventsPage(params){
			return this.$http({
				url: this.$COMMON.baseUrl + '/mediaEvents/getMediaEventsPage',
				params: params,
				method:'POST'
			})
		}	 
	}
}