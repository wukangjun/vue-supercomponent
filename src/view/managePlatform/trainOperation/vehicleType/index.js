export default{
	methods: {
		queryVehicleMsg(params){
			return this.$http({
				url: this.$COMMON.commonPath + 'vehicleMode/queryVehicleModeInfoList.do',
				params: params
			})
		}
	}
}
