
<template>
    <el-row :gutter="20">
        <el-col :span="24">
		<el-form :inline='false'  label-position='top'  :model='add' :rules='rules' ref='formItem'>
            <el-col :span="12">
			<el-form-item :label="$t('companyManage.n')"  prop='name' >
				<el-input v-model="add.name" size="small">
				</el-input>
			</el-form-item>
            </el-col>
             <el-col :span="12">
			<el-form-item :label="$t('dM.shortName')"  prop='alias'>
				<el-input v-model="add.alias" size="small">
				</el-input>
			</el-form-item>
            </el-col>
            <el-col :span="24">
					<el-form-item :label="$t('dM.remark')" prop='remark'>
								<el-input
  									type="textarea"
  									:rows="3"
  									placeholder="请输入内容"
                    resize="none"
  									v-model="add.remark"
									size="small">
								</el-input>
					</el-form-item>
				</el-col>
		</el-form>
        </el-col>
		<div class='dialog-footer'>
			<el-button :loading="loading" type="primary"  @click="save" >{{ $t('action.confirm') }}</el-button>
			<el-button @click='options.flag=false' >{{ $t('action.cancel') }}</el-button>
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
				add:{
                    name:'',
                    alias:'',
                    remark:''
				},
				loading:false,
				rules:{//验证规则
                name: [
					{ required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
					{ min: 1, max: 45, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 1, max: 45 }) },
					{ validator: this.isName, trigger: 'blur' }
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
            //判断名称是否重复
				isName(rules, value, callback){//终端编号在同一制造商下是否存在
				if(!this.$service.isContext(value)){
                        var text=value;
					if(value != this.add.text){
						this.isExistAbilityName({"name":value}).then(data => {
							if(!data.flag){
								 this.$message.error(this.$t('terminal.haveName'));
							}else{
								callback();
							}
						});
					}else{
						callback();
					}
					
				}
			},
        //新增
			save(){
				this.$refs['formItem'].validate(valid => {
					if(valid){
                        let params =this.add;
                        this.loading = true;
						this.insertTerminalAbility(params).then(data => {
              this.loading = false;
							if(data.flag){
								this.$message.success(this.$t('action.addSuccess'));
                                this.$emit('confirm')
                                this.options.flag = false;
							}else{
								this.$message.error(this.$t('action.addFail'));
								
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
					// this.$refs['addForm'].resetFields()
					this.options.name = ""
				}
			}
		}
	}
</script>
<style lang='scss' scoped>
	.addTpl{
		.el-select , .el-input{
			width: 192px;
		}
	}
</style>