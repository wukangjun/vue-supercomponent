<template>
	<el-row class="container" :gutter="20">	
		<el-col :span="24">
			<el-form :model="formData" label-position="top" :inline="false" :rules="rules" ref="addForm">
				 <el-form-item :label="$t('eventInfo.eventinfo')" prop="eventinfo">
					<el-input v-model.trim="formData.eventinfo " size="small" :maxlength='100'></el-input>
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
					eventinfo : ""	
				},
				loading:false,
				 rules: {
                    eventinfo: [
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
							eventinfo :this.formData.eventinfo ,
							enterpriseId:this.$store.getters.user.enterpriseId
						};
						this.loading = true;
						this.$store.dispatch('insertEventInfo', params).then(data => {
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
