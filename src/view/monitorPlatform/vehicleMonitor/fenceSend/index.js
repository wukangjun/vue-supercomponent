
export default {
    methods: {
		//围栏信息分页查询
		queryFenceruleList(params){
			return this.$http({
                url: this.$COMMON.baseUrl + '/fenece/queryfencerulepage',
                params: params
            });
		},
		//围栏信息分页查询
		queryrulebyvehicleIdList(params){
			return this.$http({
                url: this.$COMMON.baseUrl + '/fencesend/queryrulebyvehicleid',
                params: params
            });
		},
		//根据车辆id下发围栏
		sendrulebyvehicleid(params){
			return this.$http({
                url: this.$COMMON.baseUrl + '/fencesend/sendrulebyvehicleid',
                params: params
            });
		},
		//更新下发围栏 重发
		updaterulebyvehicleid(params){
			return this.$http({
                url: this.$COMMON.baseUrl + '/fencesend/updaterulebyvehicleid',
                params: params
            });
		},
		//更新下发围栏 重发
		renewRuleByVehicleId(params){
			return this.$http({
                url: this.$COMMON.baseUrl + '/fencesend/renewRuleByVehicleId',
                params: params
            });
		},
		//删除围栏 选择删除区域指令
		deleteFenceRuleByOrder(params){
			return this.$http({
                url: this.$COMMON.baseUrl + '/fencesend/deleteFenceRuleByOrder',
                params: params
            });
		},
		//批量删除围栏 选择删除区域指令
		delAllFenceByType(params){
				return this.$http({
					url: this.$COMMON.baseUrl + '/fencesend/delAllFenceByType',
					params: params
				});
			}
	}
}
