/**
 * author:张婵玉
 * time:2017/10
 */

export default {
    methods: {
        queryData(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/gbParameterModify/getGbParameterModifyPage',
                params: params
            });
        },
        queryList(params){
            return this.$http({
                url: this.$COMMON.baseUrl + '/gbParameterModify/getGbParameterModifyDetailPage',
                params: params
            });
        }
    }
}