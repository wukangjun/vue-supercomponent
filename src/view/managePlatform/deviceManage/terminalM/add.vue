
<template>
	<div class='addTpl' v-loading='dialogFlag'>
		<el-form :inline='true'  label-position='right' label-width='136px' :model='add' :rules='rules' ref='formItem'>
			<el-form-item :label="$t('terminal.company1')" prop='enterpriseName' style='display: block;'>
				<cv-dropdown-tree 
				style="width:190px;"
				:placeholder="$t('common.enterprise.affiliated')"
				:interface="this.getEnterpriseTreeList()"
				:is-default="!this.flagCom"
				v-model="add.enterpriseName"
				@label="getCompany" :readonly='this.flagCom' ></cv-dropdown-tree>
			</el-form-item>
			<el-form-item :label="$t('terminal.terminalTel1')"  prop='mobileCode' >
				<el-input v-model.trim="add.mobileCode" :disabled='this.flag' size="small" :maxlength='12'>
				</el-input>
			</el-form-item>
			<el-form-item :label="$t('terminal.manufacturer')"  prop='manufacturerId'>
				<el-select v-model="add.manufacturerId" clearable :placeholder="$t('terminal.placeholder')" @change='showEqType' :disabled='this.flag' size="small">
					<el-option v-for='list in manufacturerName' :label='list.name' :value='list.id+""' :key='list.id' ></el-option>
				</el-select>
			</el-form-item>
			<el-form-item :label="$t('terminal.terminalType1')"  prop='modelId'>
				<el-select v-model="add.modelId" clearable :placeholder="$t('terminal.placeholder')" :disabled='this.flag' size="small">
					<el-option v-for='list in modelType' :label='list.manufacturerNumber+" & "+list.model' :value='list.id+""' :key='list.id+""'></el-option>
				</el-select>
			</el-form-item>
			<el-form-item :label="$t('terminal.code')"  prop='code'>
				<el-input v-model.trim="add.code" :disabled='this.flag ' size="small" :maxlength='7'>
				</el-input>
			</el-form-item>
			<el-form-item :label="$t('terminal.versionProtocol')" prop='protocolVersion'>
				<el-select v-model="add.protocolVersion" clearable :placeholder="$t('terminal.placeholder')" size="small">
					<el-option v-for='list in protocolVersions' :label='list.name' :value='list.protocolVersion' :key='list.protocolVersion'></el-option>
				</el-select>
			</el-form-item>
			<el-form-item :label="$t('terminal.Can')">
				<el-select v-model="add.canCfgVersion" clearable :placeholder="$t('terminal.placeholder')" size="small">
					<el-option v-for='item in canCfgVersion' :label='item.canRemark' :value='item.id' :key="item.id"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<div class='dialog-footer'>
			<el-button type="primary" :loading='submitFalg'  @click="save">{{ $t('action.confirm') }}</el-button>
			<el-button @click='options.flag=false'>{{ $t('action.cancel') }}</el-button>
		</div>
	</div>
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
				submitFalg:false,//确定提交的loading
				dialogFlag:false,//修改初始页面loading
				canCfgVersion:[],//can版本协议
				protocolVersions:[],//终端版本协议
				manufacturerName:[],//制造商名称
				modelType:[],//制造商编号&型号
				flag:false,//判断设备是否注册
				flagCom:false,//根据新增，修改禁止企业选择
				changeFlag:true,
				add:{
					id:"",//设备ID
					enterpriseId:"",//企业ID
					mobileCode:'',//终端手机号
					manufacturerId:'',//制造商ID
					code:'',//终端编码
					enterpriseName:"",//企业名称
					canCfgVersion:'',//can版本协议
					protocolVersion:'',//终端版本协议
					modelId:""//设备型号ID
				},
				rules:{//验证规则
					enterpriseName:{required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
					mobileCode:[
						{required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
						{pattern:/^[0-9]+$/,message:this.$t("filter.type2")},
						{validator:this.isTel, trigger: 'blur' }
					],
					manufacturerId:{required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
					code:[
						{required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
						{pattern:/^[A-Z|0-9]+$/,message:this.$t("filter.type7")},
						{min:7,max:7,message:this.$filter.lanReplace(this.$t('filter.FixedLength'),{len:7})},
						{validator:this.isCode, trigger: 'blur' }
					],
					modelId:{required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'}
				}
			}
		},
		methods: {
			//手机号是否存在
			isTel(rules, value, callback){
				if(!this.$service.isContext(value)){
					let text = value;
					if (text.length < 12) {
						for (let i = text.length,len=12; i<len; i++) {
							text = "0" + text;
						}
					}
					this.add.mobileCode=text;
					if(text !=this.add.text){
						this.isExistTerminalMobile({"mobileCode":text}).then(data =>{
							data.flag ? callback() : callback(new Error(this.$t("terminal.phone")));
						});
					}else{
						callback();
					}
				}
			},
			async isCode(rules, value, callback){//终端编号在同一制造商下是否存在
				if(!this.$service.isContext(value)){
					if(this.add.modelId ==""){
						callback(new Error(this.$t("terminal.teminTypes")));
					}else{
						if(value != this.add.code2){
							let {data,flag} = await this.isExistTerminalCode({"code":value,"modelId":this.add.modelId});
							flag ? callback() : callback(new Error(this.$t("terminal.codeNum")));
						}else{
							callback();
						}
					}
				}
			},
			save(){//新增，修改保存
				this.$refs['formItem'].validate(valid => {
					if(valid){
						let params ={
							id:this.add.id,//设备ID
							enterpriseId:this.add.enterpriseId,//企业ID
							mobileCode:this.add.mobileCode,//终端手机号
							manufacturerId:this.add.manufacturerId,//制造商ID
							code:this.add.code,//终端编码
							canCfgVersion:this.add.canCfgVersion,//can版本协议
							protocolVersion:this.add.protocolVersion,//终端版本协议
							modelId:this.add.modelId
						};
						this.submitFalg=true;
						this.setUpTerminal(params).then(data => {
							if(data.flag){
								this.options.id =="" ? this.$message.success(this.$t('action.addSuccess')) : this.$message.success(this.$t('action.modifySuccess'));
                                this.$emit('confirm', false);
                                this.options.flag = false;
							}else{
								this.options.id =="" ? this.$message.error(this.$t('error.'+data.errorCode)) : this.$message.error(this.$t('error.'+data.errorCode));
							}
							this.submitFalg=false;
						}).catch(_=>{
							this.submitFalg=false;
						});
					}else{
						return false
					}
				});
			},
			showEqType(val){//获取制造商ID
				this.findTerminalModel(val);
			},
			getCompany(val){//获取企业ID，请求查询制造商列表
				this.add.enterpriseId=val.id;
			},
			async getCanCfgVersion(){//查询can版本协议列表
				let {data,flag} = await this.getCanCfgVersionList();
				flag ? (this.canCfgVersion=data) :(this.canCfgVersion=[]);
			},
			async getProtocolVersion(){//查询终端版本协议列表   
			this.changeFlag && (this.add.protocolVersion="");                                          
				let {data,flag} = await this.getProtocolVersionList();
				flag ? (this.protocolVersions=data,this.changeFlag=true) :(this.protocolVersions=[]);
			},
			async getTerminalManufacturer(){//查询制造商列表
				let {data,flag} = await this.getTerminalManufacturerList();
				flag ? (this.manufacturerName=data) :(this.manufacturerName=[]);
			},
			async findTerminalModel(id){  //查询制造商编码和型号列表  
				this.changeFlag && (this.add.modelId="");
				let {data,flag} = await this.findTerminalModelList({"manufacturerId":id});
				flag ? ( this.modelType= data ,this.changeFlag=true) : this.modelType=[];
			}
		},
		watch: {//监听弹框是否打开
			"options.flag"(newVal){
				if(!newVal){
					this.options.name = "";
					if(this.options.id !=""){
						this.flagCom=true;
					}
				}
			}
		},
		mounted(){
			this.getCanCfgVersion();
			this.getProtocolVersion();
			this.getTerminalManufacturer();
			if(this.options.id !=""){
				this.dialogFlag=true;
				this.getTerminalById({"id":this.options.id}).then(_data => {
					if(_data.flag){
						var modifyIpt=this.add;
						this.flagCom=true;
						(_data.data.isLogout!=null && _data.data.isLogout=="0") ? this.flag=true : this.flag=false;
						for(var i in modifyIpt){
							this.add[i]=_data.data[i];
						}
						this.add.code2=_data.data.code;
						this.add.text=_data.data.mobileCode;	
						this.add.mobileCode=_data.data.mobileCode;
						this.add.modelId=_data.data.modelId+"";
						this.add.manufacturerId=_data.data.manufacturerId+"";
						this.changeFlag=false;
						this.findTerminalModel(_data.data.manufacturerId);
					}
					this.dialogFlag=false;
				}).catch(_=>{
					this.dialogFlag=false;
				});
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