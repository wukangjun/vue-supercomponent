
<template>
    <el-row :gutter="20">
        <el-col :span="24">
		<el-form :inline='false'  label-position='top'  :model='options.modify' :rules='rules' ref='formItem'>
            <el-col :span="12">
			<el-form-item :label="$t('companyManage.n')"  prop='name' >
				<el-input v-model="formData.name" size="small">
				</el-input>
			</el-form-item>
            </el-col>
             <el-col :span="12">
			<el-form-item :label="$t('dM.shortName')"  prop='alias'>
				<el-input v-model="formData.alias" size="small">
				</el-input>
			</el-form-item>
            </el-col>
            <el-col :span="24">
					<el-form-item :label="$t('dM.remark')" prop='remark'>
								<el-input
  									type="textarea"
  									:rows="3"
  									resize="none"
  									placeholder="请输入内容"
  									v-model="formData.remark"
									size="small">
								</el-input>
					</el-form-item>
				</el-col>
		</el-form>
        </el-col>
		<div class='dialog-footer'>
			<el-button :loading="loading" type="primary"  @click="saveEvent">{{ $t('action.confirm') }}</el-button>
			<el-button @click='options.flag=false'>{{ $t('action.cancel') }}</el-button>
		</div>

    </el-row>
</template>
<script>
import port from './index.js'

    export default{
		mixins: [port],
		props:{
			options:{

			}
        },
     
		data(){
			return{
				formData:{
					name:'',
					alias:'',
					remark:''
				},
				loading:false,
				rules:{//验证规则
				name: [
					{ required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
					{ min: 1, max: 45, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 1, max: 45 }) },
				
				],
				alias: [
					{ required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
					{ min: 1, max: 45, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 1, max: 45 }) },
				],
				remark: [
					{ min: 1, max: 120, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 1, max: 120 }) },
				],
				}
			}
		},
		methods: {
		
			saveEvent(){
				this.$refs['formItem'].validate(valid => {
					 if(valid){
                        let params ={
                            name:this.formData.name,
                            alias:this.formData.alias,
                            remark:this.formData.remark,
							id:this.options.modify.id
						};
						this.loading = true;
                this.insertTerminalAbility(params).then(data => {
                	this.loading = false
							if(data.flag){
								this.$message.success(this.$t('action.modifySuccess'));
                                this.$emit('confirm')
                                this.options.flag = false;
							}else{
								this.$message.error(this.$t('action.modifyFail'));
								
							}
						}).catch(()=>{
							this.loading=false
						})
					}else{
						return false
				 }
				});
			}
		
		},
		watch: {//监听弹框是否打开
			"options.flag"(newVal){
				if(!newVal){
					this.options.name = "";
				}
			}
		},
		mounted(){
			this.formData.name = this.options.modify.name
			this.formData.alias = this.options.modify.alias
			this.formData.remark = this.options.modify.remark
		}
	}
</script>
<style lang='scss' scoped>
	.options.modifyTpl{
		.el-select , .el-input{
			width: 192px;
		}
	}
</style>