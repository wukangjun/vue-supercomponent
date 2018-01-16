/**
 * author:纪旭宇
 * time:2017/10
 */

export default {
    methods: {
        logPage(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/log/getNosetErrorlogPage',
                params: params,
               
            });
        },
     
    }
}