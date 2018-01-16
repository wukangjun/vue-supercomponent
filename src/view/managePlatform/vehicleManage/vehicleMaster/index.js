/**
 * author:张婵玉
 * time:2017/7
 * effect:设备管理功能的相关接口请求
 */

export default {
    methods: {
        //查询列表
        queryList(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/vehicleMaster/getVehicleMasterPage',
                params: params
            });
        },
        //删除单挑记录
        delitem(params){
            return this.$http({
                url: this.$COMMON.baseUrl + '/vehicleMaster/deleteVehicleMasterById',
                params: params
            });
        },
        //新增车主
        addVehicleMaster(params){
            let _url='';
            params.id ? (_url='/vehicleMaster/updateVehicleMaster') :(_url='/vehicleMaster/insertVehicleMaster');
            return this.$http({
                url: this.$COMMON.baseUrl + _url,
                params: params
            });
        },
        //修改初始化
        updataInit(params){
            return this.$http({
                url: this.$COMMON.baseUrl + '/vehicleMaster/getVehicleMaterById',
                params: params
            });
        },
        //查询拥有车辆
        findVehicleInfo(params){
            return this.$http({
                url: this.$COMMON.baseUrl + '/vehicleMaster/getOwnerVehiclePage',
                params: params
            });
        },
        //验证账号是否重复
        checkEntUser( params){
			return this.$http({
				url:this.$COMMON.baseUrl +'/user/checkEntUserIsAt',
				params: params
			})
		}
      
    }
}