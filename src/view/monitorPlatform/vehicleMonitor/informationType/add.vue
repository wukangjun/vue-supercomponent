<template>
	<el-row class="container" :gutter="20">	
		<el-col :span="24">
			<el-form :model="formData" label-position="top" :inline="false" :rules="rules" ref="addForm">
				<el-form-item :label="$t('informationType.infoid')" prop="infoid">
					<el-input v-model.trim="formData.infoid" size="small" ></el-input>
				</el-form-item>
				<el-form-item :label="$t('informationType.infoname')" prop="infoname">
					<el-input  v-model.trim="formData.infoname " size="small" ></el-input>
				</el-form-item>
			</el-form>
			</el-col>
		<el-col :span="24" class="dialog-footer">
			<el-button :loading="loading" type="primary" @click="confirm">{{$t('action.save')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</el-col>
	</el-row>
</template>

<script>
import {COMMON} from '@/utils'
	export default{
		props: {
			options: {}
		},
		data(){
			return{
				formData:{
					infoid : "",
					infoname : ""	
				},
				loading:false,
				rules: {
					infoid: [
						{ required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' },
						{ pattern:/^[1-9]\d*$/, message: this.$t('informationType.pleaseInputNumber')},
						{ min:1, max: 5, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:1,max:5}) }
					],
					infoname: [
						{ required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' },
						{ min:1, max: 20, message: this.$filter.lanReplace(this.$t('filter.Length'),{min:1,max:20}) }
					]
				}
			}
		},
		methods: {
		   confirm(){
				this.$refs['addForm'].validate(valid => {
					if(valid){
						let params = {
							infoid :this.formData.infoid ,
							infoname :this.formData.infoname 
						};
						this.loading = true;
						this.$store.dispatch('insertInformationType', params).then(data => {
						   	this.loading = false
						   	if (!data.flag && !!data.errorCode){
								// this.$notify.error({message: this.$t("error."+data.errorCode)});
								this.$message.error({ message: this.$t("error."+data.errorCode) });
						   	}else{
								this.$emit('confirm')
								// this.$notify.success(this.$t('action.addSuccess'));
								this.$message.success(this.$t('action.addSuccess'));
								this.options.flag = false;
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
				if(!newVal){
					this.$refs['addForm'].resetFields()
				}
			}
		}
	}
</script>
<style lang="scss" scoped>

</style>
