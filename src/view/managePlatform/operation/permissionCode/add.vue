<template>
	<el-row class="container" :gutter="20">
		<el-col :span="24">
			<el-form :model="formData" label-position="top" :rules="rules" :inline="false" ref="addForm">				
					<el-col :span="12">
					<el-form-item :label="$t('pM.permissionName')" prop="name">
						<el-input v-model.trim="formData.name" :maxlength='20'></el-input>
					</el-form-item>
					</el-col>
					<el-col :span="12">
					<el-form-item :label="$t('pM.permissionCode')" prop="code">
						<el-input v-model.trim="formData.code" :maxlength='10'></el-input>
					</el-form-item>
					</el-col>
				</el-form>
		</el-col>
		<el-col :span="24" class="dialog-footer">
			<el-button :loading="loading" type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</el-col>
	</el-row>
</template>

<script>
	export default{
		props: {
			options: {}
		},
		data(){
			return{
				formData:{
					name: "",
					code: ""
				},
				loading:false,
				rules: {
					name: [
					{required: true, message: this.$t('filter.noempty'), trigger: 'blur,change'},
					{ min:0, max: 20, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:20}) },
					],
					code:[
					{required: true, message: this.$t('filter.noempty'), trigger: 'blur,change'},
					{ min:0, max: 10, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:0,max:10}) },
					]
				}
			}
		},
		methods: {
				confirm(){
				this.$refs['addForm'].validate(valid => {
					if(valid){
						let params = {
						  name:this.formData.name,
						  code:this.formData.code
						};
                      
            this.loading = true;
						this.$store.dispatch('insertAction', params).then(data => {
							//请求到数据，loading解除
							this.loading = false;
						if (!data.flag && !!data.errorCode){
								// this.$notify.error({message: this.$t("error."+data.errorCode)});
								this.$message.error({ message: this.$t("error."+data.errorCode) });
								
						}else{
                  this.options.flag=false;
									this.$emit('confirm');
									// this.$notify.success(this.$t('action.addSuccess'));
									this.$message.success(this.$t('action.addSuccess'));
							}
						}).catch(error=>{
              this.loading = false;
            })	
					}else{
						return false
					}
				})
			}

			},
			watch: {
			'options.flag'(newVal){
				!newVal?
				(this.$refs['addForm'].resetFields(),this.loading = false) : null;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.dialog-search{
		margin-top: 24px;
	}

</style>