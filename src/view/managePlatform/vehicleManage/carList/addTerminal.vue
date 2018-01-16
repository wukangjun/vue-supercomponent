<template>
	<el-row class="container" :gutter="20">
		<el-col :span="24">
			<el-form :model="temData" :inline="false" label-position="top" ref="addT" :rules="rules">
				<!-- 所属企业  -->
				<el-col :span="12">
					<el-form-item :label="$t('terminal.company1')" prop='company'>
						<cv-dropdown-tree :placeholder="$t('common.enterprise.affiliated')" 
						:interface="$COMMON.baseUrl + '/enterprise/getEnterpriseTreeList'" 
						:is-default="true" 
						v-model="temData.company" 
						@label="getCompany" class="code">
						</cv-dropdown-tree>
					</el-form-item>
				</el-col>
				<!-- 终端手机号  -->
				<el-col :span="12">
					<el-form-item :label="$t('terminal.terminalTel')" prop='mobileCode'>
						<el-input v-model.trim="temData.mobileCode" size='small' :maxlength="12"></el-input>
					</el-form-item>
				</el-col>
				<!-- 制造商名称  -->
				<el-col :span="12">
					<el-form-item :label="$t('terminal.manufacturer')" prop='manufacturerId'>
						<el-select v-model="temData.manufacturerId" clearable :placeholder="$t('terminal.placeholder')" class="code" size='small' @change="findModel">
							<el-option v-for='list in temData.manufacturerName' :label='list.name' :value='list.id+""' :key='list.id+""'></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<!-- 制造商型号&编号  -->
				<el-col :span="12">
				<el-form-item :label="$t('terminal.terminalType1')"  prop='manufacturerModel'>
				<el-select v-model="temData.manufacturerModel" clearable :placeholder="$t('terminal.placeholder')" class="code" size='small' >
					<el-option v-for='list in temData.modelType' :label='list.manufacturerNumber+" & "+list.model' :value='list.id+""' :key='list.id+""'></el-option>
				</el-select>
				</el-form-item>
				</el-col>
				<!-- 终端编号  -->
				<el-col :span="12">
					<el-form-item :label="$t('terminal.code')" prop='code'>
						<el-input v-model.trim="temData.code" size='small' :maxlength="7"></el-input>
					</el-form-item>
				</el-col>
				<!-- 终端版本协议  -->
				<el-col :span="12">
					<el-form-item :label="$t('terminal.versionProtocol')" prop='protocolVersion'>
						<el-select v-model="temData.protocolVersion" clearable :placeholder="$t('terminal.placeholder')" class="code" size='small'>
							<el-option v-for='list in temData.protocolVersions' :label='list.name' :value='list.protocolVersion' :key='list.protocolVersion'></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			
				<!-- can版本协议 -->
				<el-col :span="12">
					<el-form-item :label="$t('terminal.Can')">
						<el-select v-model="temData.canCfgVersion" clearable :placeholder="$t('terminal.placeholder')" class="code" size='small'>
							<el-option v-for='item in temData.canCfgVersions' :label='item.canRemark' :value='item.id' :key="item.id"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-form>
			<el-col :span="24" class="dialog-footer">
				<el-button type="primary"  :loading='submitFalg' @click="postTerminal">{{$t('action.save')}}</el-button>
				<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
			</el-col>
		</el-col>
	</el-row>
</template>
<script>
import { COMMON } from '@/utils'
export default {
	props: {
		options: {}
	},
	data() {
		return {
			submitFalg:false,
			temData: {
				company: '',
				mobileCode: '',
				code: '',
				manufacturerModel:"",
				canCfgVersions: '',
				protocolVersions:"",
				manufacturerId:"",
				manufacturerName:[],
				modelType:[],
				canCfgVersion: [],
				protocolVersion: []
			},
			rules: {
				company:{required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
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
				manufacturerModel:{required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'}
			}
		}
	},
	methods: {
		async isCode(rules, value, callback){//终端编号在同一制造商下是否存在
			if(!this.$service.isContext(value)){
				if(this.temData.manufacturerModel ==""){
					callback(new Error(this.$t("terminal.teminTypes")));
				}else{
					let {data,flag} = await this.$store.dispatch("isExistTerminalCode",{"code":value,"modelId":this.temData.manufacturerModel});
					flag ? callback() : callback(new Error(this.$t("terminal.codeNum")));
				}
			}
		},
		isTel(rules,value,callback){
			if(!this.$service.isContext(value)){
				let text = value;
				if (text.length < 12) {
					for (let i = text.length,len=12; i<len; i++) {
						text = "0" + text;
					}
				}
				this.temData.mobileCode=text;
				this.$store.dispatch("isExistTerminalMobile", {"mobileCode":text}).then((data) => {
					data.flag ? callback() :  callback(new Error(this.$t("terminal.phone")));
				});
			}
		},
		getCompany(val) {
			this.temData.id = val.id
		},
		postTerminal() {
			this.$refs['addT'].validate(valid => {
				if(valid){
					let params = {
						enterpriseId: this.temData.id,
						mobileCode:this.temData.mobileCode,
						manufacturerId:this.temData.manufacturerId,
						code:this.temData.code,
						protocolVersion:this.temData.protocolVersion,
						modelId:this.temData.manufacturerModel,
						canCfgVersion:this.temData.canCfgVersion
					}
					this.submitFalg=true;
					this.$store.dispatch("insertTerminal", params).then((data) => {
						if (data.flag){
							this.$emit('confirm');
							this.options.insterTerminal=true;
							this.$message.success(this.$t('action.addSuccess'));
						}else{
							this.$message.error(this.$t('action.addFail'));
							this.options.insterTerminal=false;
						}
						this.options.flag=false;
						this.submitFalg=flase;
					}).catch(_=>{
						this.options.flag=false;
						this.submitFalg=false;
					});
				}
			});
		},
		//can版本协议数据
		getCanCfgVersion() {
			this.$store.dispatch("getCanCfgVersionList").then((data) => {
				data.flag ? (this.temData.canCfgVersions = data.data) :(this.temData.canCfgVersions = []);
			});
		},
		//制造商数据
		findManu(){
			this.$store.dispatch("findManufacturerList").then((data) => {
				data.flag ? (this.temData.manufacturerName = data.data) :(this.temData.manufacturerName = []);
			});
		},
		//终端型号以及编号数据获取
		findModel(){ 
			this.$store.dispatch("findModelList",{manufacturerId:this.temData.manufacturerId}).then((data) => {
				data.flag ? (this.temData.modelType = data.data,this.temData.manufacturerModel="") :(this.temData.modelType = []);
			});
		},
		//制造商版本协议
		getProtocolVersion() {
			this.$store.dispatch("getProtocolVersionList").then((data) => {
				data.flag ? (this.temData.protocolVersions = data.data) :(this.temData.protocolVersions = []);
			});
		}
	},
	watch: {
		"options.flag"(newVal){
			if(!newVal){
				this.options.name = "";
			}
		}
	},
	mounted(){
		this.getCanCfgVersion();
		this.getProtocolVersion();
		this.findManu();
	}




}
</script>
<style lang="scss">
.code {
	width: 260px;

}
</style>