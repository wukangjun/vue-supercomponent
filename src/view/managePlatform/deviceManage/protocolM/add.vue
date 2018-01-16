
<template>
    <el-row :gutter="20">
        <el-col :span="24">
		<el-form :inline='false'  label-position='top'  :model='add' :rules='rules' ref='formItem'>
            <el-col :span="12">
			<el-form-item :label="$t('companyManage.n')"  prop='name' >
				<el-input v-model.trim="add.name" size="small">
				</el-input>
			</el-form-item>
            </el-col>
             <el-col :span="12">
			<el-form-item :label="$t('dM.shortName')"  prop='alias'>
				<el-input v-model.trim="add.alias" size="small">
				</el-input>
			</el-form-item>
            </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('dM.protocol')"  prop='protocolVersion'>
				   <el-input v-model.trim="add.protocolVersion" size="small">
				    </el-input>
			  </el-form-item>
      </el-col>
       <el-col :span="12">
          <el-form-item :label="$t('dM.remark')" prop='remark'>
                <el-input
                    :rows="3"
                    resize="none"
                    :placeholder="$t('placeholder.inputValue')"
                    v-model.trim="add.remark"
                  size="small">
                </el-input>
          </el-form-item>
        </el-col>
		</el-form>
        </el-col>
		<div class='dialog-footer'>
			<el-button :loading="loading" type="primary"  @click="confirm">{{ $t('action.confirm') }}</el-button>
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
				add:{
                    name:'',
                    alias:'',
                    remark:'',
                    protocolVersion:''
				},
				loading:false,
				rules:{//验证规则
                    name:[
					{required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
					{min:1,max:45,message:this.$filter.lanReplace(this.$t('filter.Length'),{min:1,max:45})},
                    {validator:this.isName, trigger: 'blur'}
					],
					 alias:[
					{required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
					{min:1,max:45,message:this.$filter.lanReplace(this.$t('filter.Length'),{min:1,max:45})},
                   
					],
					 remark:[
					{min:1,max:120,message:this.$filter.lanReplace(this.$t('filter.Length'),{min:1,max:120})},
					],
					
                  	protocolVersion:[
                  	{ required: true, message: this.$t('companyManage.fk'), trigger: 'blur,change' },
                  	{ min:1,max:11,message:this.$filter.lanReplace(this.$t('filter.Length'),{min:1,max:11})},
                  	]

                    
				}
			}
		},
		methods: {
            //判断名称是否重复
            	isName(rules, value, callback){//终端编号在同一制造商下是否存在
				if(!this.$service.isContext(value)){
						var text=value;
							this.isExistTerminalProtocol({"name":value}).then(data => {
							if(!data.flag){
								 callback(new Error(this.$t("error."+data.errorCode)))
							}else{
								callback();
							}
						});
				
					
				}
			},
        //新增
			confirm(){
				this.$refs['formItem'].validate(valid => {
					if(valid){
						let params={
							name:this.add.name,
							alias:this.add.alias,
							remark:this.add.remark,
							protocolVersion:this.add.protocolVersion
						}
						this.loading = true
						this.insertTerminalProtocol(params).then(data => {
              this.loading = false
						if (!data.flag && !!data.errorCode){
								this.$message.error({message: this.$t("error."+data.errorCode)});
									}else{
                  this.options.flag=false;
									this.$emit('confirm');
									this.$message.success(this.$t('action.modifySuccess'));
									
								}
						}).catch(()=>{
							this.loading = false;
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