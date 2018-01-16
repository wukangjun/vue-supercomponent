export default{
	methods:{
		findMediaSelectBackList(params){
			return this.$http({
			   url:this.$COMMON.baseUrl + "/mediaUpload/findMediaSelectBackList",
			   params:params
			})
		},
		sendMediaUploadCmd(params){
			return this.$http({
			   url:this.$COMMON.baseUrl + "/mediaUpload/sendMediaUploadCmd",
			   params:params
			})
		},
		
	}
}