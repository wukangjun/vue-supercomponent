/**
 * author:纪旭宇
 * time:2017/10
 */

export default {
    methods: {
        getHistoryEwaybillPage(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/log/getHistoryEwaybillPage',
                params: params,
               
            });
        },
     
    }
}