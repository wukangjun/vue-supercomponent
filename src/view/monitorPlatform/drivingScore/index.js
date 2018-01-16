export default{
    methods:{
        queryPiccWeightsInfo(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/piccWeights/queryPiccWeightsInfo",
               params:params
            })
        },
        updatePiccWeightsInfo(params){
            return this.$http({
               url:this.$COMMON.baseUrl + "/piccWeights/updatePiccWeightsInfo",
               params:params
            })
        },
        
    }
}