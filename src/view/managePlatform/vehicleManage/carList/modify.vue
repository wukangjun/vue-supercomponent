<template>
	<div class='carListTabs'>
		<el-tabs v-model="activeName">
			<el-tab-pane label="基础信息" name="first" ref='first'>
				<el-row class="container" :gutter="20">
					<el-col :span="24">
						<el-form :model="modify" label-position="top" :rules="rules" :inline="false" ref="modifyForm">
							<!-- 所属企业  -->
							<el-col :span="8">
								<el-form-item :label="$t('dm.company')" prop="enterpriseName">
									<cv-dropdown-tree :interface="$COMMON.baseUrl + '/enterprise/getEnterpriseTreeList'" v-model="modify.enterpriseName" @label="getCompany" readonly="readonly"></cv-dropdown-tree>
								</el-form-item>
							</el-col>
							<!-- 车牌号  -->
							<el-col :span="8">
								<el-form-item :label="$t('cL.carNumber')" prop="plateCode">
									<el-input v-model.trim="modify.plateCode" ref="code" size='small' :disabled='isTerminal' :maxlength='10'></el-input>
								</el-form-item>
							</el-col>
							<!-- 车辆颜色  -->
							<el-col :span="8">
								<el-form-item :label="$t('cL.carColor')" prop="plateColor">
									<el-select v-model="modify.plateColor" clearable :placeholder="$t('terminal.placeholder')" size='small' >
										<el-option :label="$t('filter.colorBlue')" value="1"></el-option>
										<el-option :label="$t('filter.colorYellow')" value="2"></el-option>
										<el-option :label="$t('filter.colorBlack')" value="3"></el-option>
										<el-option :label="$t('filter.colorWhite')" value="4"></el-option>
										<el-option :label="$t('filter.colorGreen')" value="5"></el-option>
										<el-option :label="$t('filter.color')" value="9"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<!-- 所属分组  -->
							<el-col :span="8">
								<el-form-item :label="$t('cL.subGroup')" prop="fleetName">
									<cv-dropdown-tree v-model="modify.fleetName" :is-fleet="true" :interface="$COMMON.baseUrl + '/fleet/findFleetInfoList'" :enterprise-id="modify.enterpriseId" @label="vehicleIdCall"></cv-dropdown-tree>
								</el-form-item>
							</el-col>
							<!-- 车架号  -->
							<el-col :span="8">
								<el-form-item :label="$t('cL.vechicleCar')" prop="carVin">
									<el-input v-model.trim="modify.carVin" size='small' :maxlength='17'></el-input>
								</el-form-item>
							</el-col>
							<!-- 车辆类型  -->
							<el-col :span="8">
								<el-form-item :label="$t('cL.carType')" prop="carType">
									<el-select v-model="modify.carType" size='small' clearable filterable :placeholder="$t('terminal.placeholder')">
										<el-option v-for="item in carTypeArry" :key="item.code" :label="item.name" :value="item.code">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<!-- 车辆品牌  -->
							<el-col :span="8">
								<el-form-item :label="$t('cL.carBrand')" prop="brandId">
									<el-select v-model="modify.brandId" clearable  filterable  :placeholder="$t('terminal.placeholder')" size='small' @change="getModel">
										<el-option v-for="item in vehicleBrand" :key="item.id" :label="item.brandName" :value="item.id">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<!-- 厂家名称 -->
							<el-col :span="8">
								<el-form-item :label="$t('cL.factName')" prop="factoryName">
									<el-tooltip class="item" effect="dark" :content="modify.factoryName" placement="top-end" :disabled="modify.factoryName == ''?true:false">
										<el-input v-model.trim="modify.factoryName"  size='small' :disabled='true'>
										</el-input>
									</el-tooltip>
								</el-form-item>
							</el-col>
							<!-- 车辆型号  -->
							<el-col :span="8">
								<el-form-item :label="$t('cL.carModel')" prop="vehicleModeId">
									<el-select v-model="modify.vehicleModeId" clearable filterable :disabled='changBrandFlag' :placeholder="$t('terminal.placeholder')" size='small'>
										<el-option v-for="item in factoryType" :key="item.id+''" :label="item.modeName" :value="item.id+''">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<!-- 内部编码  -->
							<el-col :span="8">
								<el-form-item :label="$t('cL.nextCode')" prop="alias">
									<el-input v-model.trim="modify.alias" size='small' :maxlength='20'></el-input>
								</el-form-item>
							</el-col>
							<!-- 设备  -->
							<el-col :span="8">
								<el-form-item :label="$t('cL.equipment')" prop="terminalId">
									<el-select v-model="modify.terminalId" clearable filterable :placeholder="$t('terminal.placeholder')" class="choess" size='small' :disabled="isLogoutFlag">
										<el-option v-for='list in terminals' :label='list.manufacturerModelCode' :value='list.id+""' :key='list.id+""'></el-option>
									</el-select>
									<el-button icon="plus" @click="addTerminal" size='small' :disabled="terminalAddFlag"></el-button>
								</el-form-item>
							</el-col>
							<!-- 司机  -->
							<el-col :span="8">
								<el-form-item :label="$t('cL.drive')" prop="driver">
									<el-select v-model="modify.driverId" clearable filterable :placeholder="$t('terminal.placeholder')" class="choess" size='small' >
										<el-option v-for='list in drivers' :label='list.username' :value='list.id' :key='list.id'></el-option>
									</el-select>
									<el-button icon="plus" @click="addMation" size='small' :disabled="driverAddFlag"></el-button>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="车主">
									<el-select v-model="modify.vehicleOwnerId" clearable filterable :placeholder="$t('terminal.placeholder')" class="choess" size='small' >
										<el-option v-for='list in VehicleMaster' :label='list.username' :value='list.id' :key='list.id'></el-option>
									</el-select>
									<el-button icon="plus" @click="addMaster" size='small' :disabled="masterAddFlag"></el-button>
								</el-form-item>
							</el-col>
							<el-col :span="8">
							<el-form-item label="车辆上级平台" prop="">
								<el-input size='small' v-model="modify.superiorPlatformName" readonly @click.native="bindSuperior" :icon="modify.superiorPlatformName == ''?'':'circle-close'" :on-icon-click="del"></el-input>
								<!-- <cv-icon 
								name="remove"
								style="position:absolute;right:0px;top:11px;"
								@click.native="del"
								v-show="modify.superiorPlatformName == ''?false:true">
								</cv-icon> -->
							</el-form-item>
						</el-col>
							<!-- 车辆行车证  -->
							<!--<el-col :span="8">
								<el-form-item :label="$t('cL.vehicLisence')" prop="vehiclelicenseImg">
									<el-input v-model="modify.vehiclelicenseImg" size='small'></el-input>
								</el-form-item>
							</el-col>-->
							<!--车身照片-->
							<!--<el-col :span="8">
								<el-form-item :label="$t('cL.carPhone')" prop="vehicleImg">
									<el-input v-model="modify.vehicleImg" size='small'></el-input>
								</el-form-item>
							</el-col>-->
						</el-form>
					</el-col>
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="视频设置" name="second" ref='second'>
				<el-row class="container" :gutter="10">
					<el-col :span="24">
						<el-form :model="modify" label-position="top" :rules="rules" :inline="false" ref="modifyForms">
							<el-col :span="24">
								<el-form-item :label="$t('cL.equipmentType')">
									<el-select v-model="hello"  size='small' @change='changeType' style='width:270px;'>
										<el-option v-for='list in equpmentTypes' :label='list.name' :value='list.code' :key='list.code'></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item :label="$t('cL.accessID')" prop="dvrId">
									<el-input v-model.trim="modify.dvrId" size='small':maxlength='10' :disabled='dvrFlag'></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item :label="$t('cL.userChannels')" prop="channelCount">
									<el-input v-model.trim="modify.channelCount" size='small':maxlength='3' :disabled='dvrFlag'></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item :label="$t('cL.serverPort')" prop="port">
									<el-input v-model.trim="modify.port" size='small':maxlength='5' :disabled='dvrFlag'></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item :label="$t('cL.ipAddress')" prop="ip">
									<el-input v-model.trim="modify.ip" size='small':maxlength='50' :disabled='dvrFlag'></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item :label="$t('cL.username')" prop="username">
									<el-input v-model.trim="modify.username"  size='small' :disabled='dvrFlag' :maxlength='15'>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item :label="$t('cL.loginPassword')" prop="password">
									<el-input v-model.trim="modify.password" size='small' :maxlength='15' :disabled='dvrFlag'></el-input>
								</el-form-item>
							</el-col>
						</el-form>
					</el-col>
				</el-row>
			</el-tab-pane>
		</el-tabs>
		<el-col :span="24" class="dialog-footer">
			<el-button :loading="loading" type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</el-col>
	</div>
	
</template>
<script>
import { COMMON } from '@/utils'
export default {
	props: {
		options: {}
	},
	data() {
		return {
			hello: "",
			activeName:'first',
			dvrFlag:true,
			carTypeArry:[
				{code:"1",name:this.$t("vt.carType1")},
				{code:"2",name:this.$t("vt.carType2")},
				{code:"3",name:this.$t("vt.carType3")},
				{code:"4",name:this.$t("vt.carType4")},
				{code:"5",name:this.$t("vt.carType5")},
				{code:"6",name:this.$t("vt.carType6")},
				{code:"7",name:this.$t("vt.carType7")},
				{code:"8",name:this.$t("vt.carType8")},
				{code:"9",name:this.$t("vt.carType9")},
				{code:"10",name:this.$t("vt.carType10")},
				{code:"11",name:this.$t("vt.carType11")},
				{code:"12",name:this.$t("vt.carType12")},
				{code:"13",name:this.$t("vt.carType13")},
				{code:"14",name:this.$t("vt.carType14")},
				{code:"15",name:this.$t("vt.carType15")},
				{code:"16",name:this.$t("vt.carType16")},
				{code:"17",name:this.$t("vt.carType17")},
				{code:"18",name:this.$t("vt.carType18")},
				{code:"19",name:this.$t("vt.carType19")},
				{code:"20",name:this.$t("vt.carType20")},
				{code:"21",name:this.$t("vt.carType21")},
				{code:"22",name:this.$t("vt.carType22")},
				{code:"23",name:this.$t("vt.carType23")},
				{code:"24",name:this.$t("vt.carType24")},
				{code:"25",name:this.$t("vt.carType25")}

			],
			equpmentTypes:[
				{code:0,name:'无视频设备'},
				{code:7,name:'N9M'},
				{code:13,name:'通力'},
			],
			modify: {
				enterpriseId:"",//所属企业
				alias:"",//内部编码
				vehiclelicenseImg:"",//行车证图片地址
				vehicleOwnerId:'',
				carType:"",//车辆类型
				plateColor:"",//车牌颜色
				plateCode:"",//车牌号
				vehicleModeId:"",//车型
				vehicleImg:"",//车辆图片
				factoryName:"",//厂家名称
				enterpriseName:"",
				brandId:"",//车辆品牌
				fleetId:"",//车组id
				fleetName:"",
				terminalId:"",//设备id
				driverId:"",//司机id
				engineCode:"",//车架编号
				id: '',
				text: '',
				dvrId:"",
				dvrTypes:0,//设备类型
				channelCount:"",//设备通道数
				ip:"",//服务器IP地址
				port:0,//服务器端口
				username:"",//登陆用户名
				password:"",//登陆用户密码,
				superiorNames:'',
				superiorPlatformIds:''
			},
			terminalAddFlag: true,
			driverAddFlag:true,
			masterAddFlag:true,
			VehicleMaster:[],
			vehicleBrand: [],//车辆品牌
			terminals: [],//设备列表
			factoryType:[],//车辆型号
			drivers:[],//司机列表
			loading:false,
			flag:false,
			changBrandFlag:true,
			isTerminal:false,//判断是否有设备
			isLogoutFlag:false,//判断设备是否注册
			rules: {
				enterpriseName:[{ required: true, message: this.$t('filter.noempty'), trigger:'blur,change' }],
				dvrId: [{
						required: true,
						message: this.$t('filter.noempty'),
						trigger: 'blur,change'
					},
					{
						pattern: /^[0-9A-Za-z]/,
						message: this.$t("filter.type9")
					}
				],
				port:[
					{
						pattern: /^[0-9]/,
						message: this.$t("filter.type2")
					}
				],
				ip:[{
						pattern:/^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/,
						message: this.$t("filter.type6")
					}
				],
				channelCount: [{
						required: true,
						message: this.$t('filter.noempty'),
						trigger: 'blur,change'
					},{
						pattern: /^[0-9]/,
						message: this.$t("filter.type2")
					}
				],
				plateCode: [
					{required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' },
					{pattern:/^[\u4e00-\u9fa5|WJ]|[A-Za-z]|[0-9]+$/,message:this.$t("filter.type6")},
					{validator:this.isPlateCode, trigger: 'blur' }
				],
				alias:{pattern:/^[A-Z0-9]/,message:this.$t("filter.type7"),trigger: 'change' },
				fleetName:[{ required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' }],
				plateColor:[{required: true, message: this.$t('filter.noempty'), trigger: 'blur,change' }],
				carVin:[
					{pattern:/^[A-Z0-9]/,message:this.$t("filter.type7"),trigger: 'change' },
					{min:17,max:17,message:this.$filter.lanReplace(this.$t('filter.FixedLength'),{len:17})}
				]	
			}
		}
	},
	methods: {
		del(e){
			e.preventDefault();
			e.stopPropagation();
			this.modify.superiorPlatformIds = '';
			this.modify.superiorPlatformName = '';
		},
		bindSuperior(){
			this.options.dialog1.flag = true;
			this.options.dialog1.name = 'addSuperior';
			this.options.dialog1.title = '上级平台管理';
		},
		isPlateCode(rules, value, callback){//车牌是否存在
			if(!this.$service.isContext(value)){
				var textlen=value.substring(0,1);
				var textReg= new RegExp("^[\u4e00-\u9fa5|WJ]");
				var reg;
				if(textReg.test(textlen)){
					reg = new RegExp("^[\u4e00-\u9fa5|WJ]{1}[A-Z]{1}[A-Z0-9]{5,6}$");
				}else{
					reg = new RegExp("^[A-Za-z0-9]+$");
				}
				if(reg.test(value)){
					if(value != this.modify.text){
						this.$store.dispatch('isExistPlateCode', {"plateCode":value}).then(data => {
							if(!data.flag){
									callback(new Error(this.$t("vt.isPlateCode")));
							}else{
								callback();
							}
						});
					}else{
						callback();
					}
				}else{
					callback(new Error(this.$t("filter.type6")));
				}
			}
		},
		confirm() {
			let _self=this;
			let _first=_self.$refs['first'].$el,_second=_self.$refs['second'].$el;
			this.$refs['modifyForm'].validate(valid => {
				if (valid) {
					this.$refs['modifyForms'].validate(valids => {
						if (valids) {
							let params = {	
								enterpriseId:this.modify.enterpriseId,//所属企业
								alias:this.modify.alias,//内部编码
								vehiclelicenseImg:this.modify.vehiclelicenseImg,//行车证图片地址
								carType:this.modify.carType,//车辆类型
								plateColor:this.modify.plateColor,//车牌颜色
								plateCode:this.modify.plateCode,//车牌号
								vehicleModeId:this.modify.vehicleModeId,//车型
								vehicleImg:this.modify.vehicleImg,//车辆图片
								factoryName:this.modify.factoryName,//厂家名称
								brandId:this.modify.brandId,//车辆品牌
								fleetId:this.modify.fleetId,//车组id
								vehicleOwnerId:this.modify.vehicleOwnerId,
								terminalId:this.modify.terminalId,//设备id
								driverId:this.modify.driverId,//司机id
								carVin:this.modify.carVin,//车架编号
								id: this.modify.id,
								superiorPlatformIds:this.modify.superiorPlatformIds,
								vehicleVideoDevice: {
									dvrId: this.modify.dvrId,
									dvrType:this.hello, //设备类型
									channelCount:this.modify.channelCount !="" ? parseInt(this.modify.channelCount) : 0, //设备通道数
									ip: this.modify.ip, //服务器IP地址
									port: this.modify.port, //服务器端口
									username: this.modify.username, //登陆用户名
									password: this.modify.password, //登陆用户密码,
								}
							}
							this.loading = true
							this.$store.dispatch('updateVehicle', params).then(data => {
								if (data.flag) {
									this.$message.success(this.$t('action.modifySuccess'));
									this.$emit('confirm')
									this.options.flag=false;
								}else{
									this.$message.error(this.$t('action.modifyFail'));
								}
								this.loading = false
							});
						}else {
							_self.activeName='second';
							_self.$myJq.css(_second,"display",'block');
							_self.$myJq.css(_first,"display",'none');
							return false;
						}
					});
				}else {
					_self.activeName='first';
					_self.$myJq.css(_second,"display",'none');
					_self.$myJq.css(_first,"display",'block');
					return false;
				}
			})
		},
		getCompany(val) {
			this.modify.id = val.id;
			this.changeTerminal();
			this.changeDriver();
			this.getBrand();
			this.getVehicleMaster();
		},
		vehicleIdCall(val) {
			this.modify.fleetId= val.id;
		},
		//添加弹框事件
		addMation() {
			this.options.dialog1.flag = true;
			this.options.dialog1.size = 'dialog-small';
			this.options.dialog1.name = 'addMation';
			this.options.dialog1.title = this.$t('vt.drive');
		},
		addTerminal() {
			this.options.dialog1.flag = true;
			this.options.dialog1.size = 'dialog-small';
			this.options.dialog1.name = 'addTerminal';
			this.options.dialog1.title = this.$t('vt.getTer');
		},
		//添加司机弹框事件
		addMaster() {
			this.options.dialog1.flag = true;
			this.options.dialog1.size = 'dialog-large';
			this.options.dialog1.name = 'addMaster';
			this.options.dialog1.title = '车主添加';
		},
		//获取设备下拉列表
		changeTerminal(){
			let params = {
				enterpriseId: this.modify.enterpriseId,
				id:this.modify.terminalId
			}
			this.$store.dispatch("findUnbindTerminalList", params).then((data) => {
				data.flag ? (this.terminals = data.data) :(this.terminals = []);
			});
		},
		//根据品牌ID,查询型号
		getVehicleMaster(id,name) {
			this.$store.dispatch("getVehicleMaster", {
				"enterpriseId": this.modify.enterpriseId
			}).then(data => {
				if(data.flag){
					this.VehicleMaster = data.data;
				}else{
					this.VehicleMaster = [];
				}
			});
		},
		//获取司机下拉列表
		changeDriver(){
			let params = {
				enterpriseId: this.modify.enterpriseId
			}
			this.$store.dispatch("findDriverList", params).then((data) => {
				data.flag ? (this.drivers = data.data) :(this.drivers = []);
			});
		},
		//根据品牌ID,查询型号
		getModel() {
			let vehicleBrand=this.vehicleBrand;
			this.modify.factoryName='';
			this.flag  && (this.modify.vehicleModeId='') ;
			for(let i in vehicleBrand){
				if(vehicleBrand[i].id==this.modify.brandId){
					this.modify.factoryName=vehicleBrand[i].manufacturerName;
					this.$store.dispatch("getFindModel", {"brandId": this.modify.brandId}).then(data=>{
						data.flag ? (this.factoryType = data.data , this.flag=true,this.changBrandFlag=false) :(this.factoryType = [],this.changBrandFlag=true);
						
					});
				}
			}
		},
		//根据品牌ID,查询型号
		getBrand() {
			this.$store.dispatch("getFindBrand", {"enterpriseId":this.modify.enterpriseId}).then(data=>{
				if(data.flag){
					data.flag ? (this.vehicleBrand = data.data) :(this.vehicleBrand = []);
					if(this.modify.brandId!=""){
						this.getModel();
					}
				}

			});
		},
		//切换视频设备类型
		changeType(){
			if(this.hello==0) {
				this.rules.dvrId[0].required=false;
				this.rules.channelCount[0].required=false;
				this.modify.channelCount="";//设备通道数
				this.modify.ip="";//服务器IP地址
				this.modify.port=0;//服务器端口
				this.modify.username="";//登陆用户名
				this.modify.password="";//登陆用户密码,
				this.modify.dvrId="";//登陆用户密码,
				this.dvrFlag=true;
				if(document.getElementsByClassName('el-form-item__error').length > 0){
					document.getElementsByClassName('el-form-item__error')[0].style.display='none';
					document.getElementsByClassName('el-form-item__error')[1].style.display='none';
				}
			}else{
				this.rules.dvrId[0].required=true;
				this.rules.channelCount[0].required=true;
				this.dvrFlag=false;
				if(document.getElementsByClassName('el-form-item__error').length>0){
					document.getElementsByClassName('el-form-item__error')[0].style.display='block';
					document.getElementsByClassName('el-form-item__error')[1].style.display='block';
				}
			} 
		},
		getPower(){
			let power=this.$store.getters.manageMenus;
			let _self=this;
			for(let i=0 ;i<power.length;i++){
				for(let j=0;j<power[i].child.length;j++){
					if(power[i].child[j].title=='车主管理'){
						if(power[i].child[j].power.indexOf("add") >0){
							_self.masterAddFlag=false;
						}
					}else if(power[i].child[j].title=='司机管理'){
						if(power[i].child[j].power.indexOf("add") >0){
							_self.driverAddFlag=false;
						}
					}else if(power[i].child[j].title=='终端管理'){
						if(power[i].child[j].power.indexOf("add") >0){
							_self.terminalAddFlag=false;
						}
					}
				}
			}
		}
	 },
	watch: {
		'options.flag'(newVal) {
			if (!newVal) {
				this.options.name = "";
				this.options.dialog1.superiorPlatformNames = ''
				this.options.dialog1.superiorPlatformIds = ''
			}
		},
		"options.dialog1.insterTerminal"(newVal){
			if(newVal){
				this.changeTerminal();
				this.options.dialog1.insterTerminal=false;
			}
		},
		"options.dialog1.insterMation"(newVal){
			if(newVal){
				this.changeDriver();
				this.options.dialog1.insterMation=false;
			}
		},
		"options.dialog1.superiorPlatformNames"(newVal){
			if(newVal){
				this.modify.superiorPlatformName = newVal;
			}
		},
		"options.dialog1.insertVehicleMaster"(newVal){
			if (newVal) {
				this.getVehicleMaster();
				this.options.dialog1.insertVehicleMaster = false;
			}
		},
		"options.dialog1.superiorPlatformIds"(newVal){
			if(newVal){
				this.modify.superiorPlatformIds = newVal;
			}
		},
	},
	mounted() {
		this.$store.dispatch('getVehicleById', this.options.id).then(data => {
			if(data.flag){
				this.modify = data.data;
				this.modify.vehicleModeId=data.data.vehicleModeId+"";
				this.modify.terminalId=data.data.terminalId+"";	
				this.modify.text=data.data.plateCode;
				this.modify.terminalId != "null" ? (this.isTerminal=true) : ((this.modify.terminalId="") && (this.isTerminal=false));
				this.modify.isLogout == "0"  ?  (this.isLogoutFlag=true) : (this.isLogoutFlag=false);
				this.modify.driverId=data.data.driverId;
				this.modify.superiorPlatformName = data.data.superiorPlatformName;
				this.modify.superiorPlatformIds = data.data.superiorPlatformIds;
				if(data.data.vehicleVideoDevice){
					this.modify.channelCount=data.data.vehicleVideoDevice.channelCount+"";//设备通道数
					this.modify.ip=data.data.vehicleVideoDevice.ip;//服务器IP地址
					this.modify.port=data.data.vehicleVideoDevice.port;//服务器端口
					this.modify.username=data.data.vehicleVideoDevice.username;//登陆用户名
					this.modify.password=data.data.vehicleVideoDevice.password;//登陆用户密码,
					this.modify.dvrId=data.data.vehicleVideoDevice.dvrId;//登陆用户密码,
					this.hello=data.data.vehicleVideoDevice.dvrType; //登陆用户密码
				 }else{
					 this.hello=0;
				 }
				// this.hello==0 ? this.dvrFlag=true: this.dvrFlag=false;
				this.changeTerminal();
				this.changeDriver();
				this.getBrand();
				this.getVehicleMaster();
			}
		});
		this.getPower();
	}
}
</script>
<style lang="scss" scoped>
.carListTabs {
	.choess {
		width: 120px;
		margin-right: 5px
	}
	.el-form-item{
		margin-top: 5px;
	}
	.dialog-footer {
		margin-bottom: 20px;
	}
}

</style>