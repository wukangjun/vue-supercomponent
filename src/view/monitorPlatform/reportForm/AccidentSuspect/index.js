export default{
	methods: {
		// 查询疑点表格接口
		troubleRecord(params){
			return this.$http({
				url: this.$COMMON.baseUrl + '/driverRecord/troubleRecord',
				params: params
			})
		},
		//详情查看的表格数据接口
		troubleRecoirdInfo(params){
			return this.$http({
				url: this.$COMMON.baseUrl + '/driverRecord/troubleRecoirdInfo',
				params: params
			})
		},
		//查看图表数据接口
		queryDoubtFlash(params){
				return this.$http({
					url: this.$COMMON.baseUrl + '/driverRecord/queryDoubtFlash',
					params: params
				})
		},
		//疑点位置查询数据接口
		queryDoubtAddr(params){
				return this.$http({
					url: this.$COMMON.baseUrl + '/driverRecord/queryDoubtAddr',
					params: params
				})
		},	 
	}
}