export default{
	methods: {
		getPredefinedInfoPage(params){
			return this.$http({
				url: this.$COMMON.baseUrl + '/predefinedinfo/getPredefinedInfoPage',
				params: params,
				method:'POST'
			})
		},
		getPredefinedInfoById(id){
			return this.$http({
				url: this.$COMMON.baseUrl + '/predefinedinfo/getPredefinedInfoById',
				params: {
					id: id
				}
			})
		},
		deletePredefinedInfoById(id){
			return this.$http({
				url: this.$COMMON.baseUrl + '/predefinedinfo/deletePredefinedInfoById',
				params: {
					id: id
				}
			})
		},
		deletePredefinedInfoByBatch(ids){
			return this.$http({
				url: this.$COMMON.baseUrl + '/predefinedinfo/deletePredefinedInfoByBatch',
				params: {
					ids: ids
				}
			})
		},
		updatePredefinedInfo(params){
			return this.$http({
				url: this.$COMMON.baseUrl + '/predefinedinfo/updatePredefinedInfo',
				params: params,
				method:'POST'
			})
		},
		insertPredefinedInfo(params){
			return this.$http({
				url: this.$COMMON.baseUrl + '/predefinedinfo/insertPredefinedInfo',
				params: params,
				method:'POST'
			})
		}
	}
}