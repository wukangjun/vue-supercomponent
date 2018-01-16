export default{
	methods: {
		// 搜索车辆表格接口
		getMultimediaSearch(params){
			return this.$http({
				url: this.$COMMON.baseUrl + '/media/query',
				params: params,
				method:'POST'
			})
		}	 
	}
}