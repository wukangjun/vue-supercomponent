export default {
    methods: {
          // 信息接口
          findSysLogDetail(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/report/findSysLogDetail',
                params: params
            })
        },
      
        
    }
}