export default{
	methods: {
		// 获取信息推送记录分页数据列表
		getInformationSendlogPage(params){
			return this.$http({
				url: this.$COMMON.baseUrl + '/informationSendlog/getInformationSendlogPage',
				params: params,
				method:'POST'
			})
		}
	}
}