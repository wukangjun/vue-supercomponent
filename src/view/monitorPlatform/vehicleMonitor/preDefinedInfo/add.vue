<template>

	<el-row class="container" :gutter="20">
	
	<el-col :span="12">
		<el-form :model="formData" label-position="top" :inline="false" :rules="rules" ref="addForm">
				<!-- 显示类型  -->
				<el-col :span="24">
					<el-form-item :label="$t('predefinedInfo.type')" prop="type">
						<el-select v-model="formData.type"  size="small"  style="width:550px;" clearable >
							<el-option :label="$t('predefinedInfo.selectOpt1')" value="0"></el-option>
							<el-option :label="$t('predefinedInfo.selectOpt2')" value="2"></el-option>
							<el-option :label="$t('predefinedInfo.selectOpt3')" value="3"></el-option>
							<el-option :label="$t('predefinedInfo.selectOpt4')" value="4"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<!-- 信息内容  -->
				<el-col :span="24">
					<el-form-item :label="$t('predefinedInfo.msginfo')" prop="msginfo">
						<el-input type="textarea" :rows="3" v-model.trim="formData.msginfo" size="small"  style="width:550px;"></el-input>
					</el-form-item>
				</el-col>
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
import port from './index.js'
	export default{
		props: {
			options: {}
		},
		mixins:[port],
		data(){
			return{
				formData:{
					msginfo: "",
					type:''
					
				},
				loading:false,
				rules: {
					  type: [
                   		{ required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' }
              		],
					msginfo: [
						{ required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' }
					]
				}
			}
		},
		methods: {
		   confirm(){
				this.$refs['addForm'].validate(valid => {
					if(valid){
						let params = {
							type:this.formData.type,
							msginfo:this.formData.msginfo,
							txtLogId:0,
							enterpriseId:this.$store.getters.user.enterpriseId
						};
						this.loading = true
						this.insertPredefinedInfo(params).then(data => {
							this.loading = false
							if (!data.flag && !!data.errorCode){
								this.$message.error({ message: this.$t("error."+data.errorCode) });
							}else{
								this.$emit('confirm');
								this.$message.success(this.$t('action.addSuccess'));
								this.options.flag = false;
							}
						}).catch(error=>{
							this.loading = false;
						});				
					}else{
						return false
					}
				});
			},
			enterpriseId(val){
				this.formData.id = val.id
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
