<template>
	<div class="cv-authorization">
		<h2>授权页面</h2>
	</div>
</template>

<script>
	export default{
		methods: {
			async loginMonitor(query = {}){
				let params = {
	                enterpriseCode: query.enterpriseCode,
	                account: query.account,
	                password: query.password,
	                language: query.language
	            };
	            const {data, flag, errorCode} = await this.$store.dispatch('getToken', params);
	            flag
	            ?(this.$store.dispatch('setUser', data), this.$router.push('/monitor')) 
	            :this.$message.error({ message: this.$t("error." + errorCode) });
			}
		},
		created(){
			this.loginMonitor(this.$route.query);
			// ?enterpriseCode=111111111&account=admin&password=e10adc3949ba59abbe56e057f20f883e&language=zh-cn
		}
	}
</script>

<style lang="scss" scoped>
	.cv-authorization{
		margin-top: 100px;
		text-align: center;
	}
</style>