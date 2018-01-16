/**
 * author:张婵玉
 * time:2017/10
 */

export default {
    methods: {
         //升级信息初始化
         queryUpgradeLogInfoList(params){
            return this.$http({
                url: this.$COMMON.baseUrl + '/upgradeLog/queryUpgradeLogInfoList',
                params: params
            });
        },
    }
}