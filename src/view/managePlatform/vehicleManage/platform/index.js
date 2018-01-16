/**
 * author:张婵玉
 * time:2017/10
 */

export default {
    methods: {
        queryList(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/vehicleAttachPlat/queryAttachInfoByCar',
                params: params
            });
        },
        delitem(params){
            return this.$http({
                url:this.$COMMON.baseUrl + '/vehicleAttachPlat/deleteAttachPlat',
                params:params
            })
        },
        queryOtherProtocolGroup(params){
            return this.$http({
                url:this.$COMMON.baseUrl + '/vehicleAttachPlat/queryOtherProtocolGroup',
                params:params
            })
        },
        addAttachPlat(params){
            return this.$http({
                url:this.$COMMON.baseUrl + '/vehicleAttachPlat/addAttachPlat',
                params:params
            })
        }
    }
}