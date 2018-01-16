<template>
<div class='carListTabs'>
	<el-tabs v-model="activeName">
		<el-tab-pane label="基础信息" name="first" ref='first'>
			<el-row class="container" :gutter="10">
				<el-col :span="24">
					<el-form :model="addData" label-position="top" :rules="rules" :inline="false" ref="add">
						<!-- 所属企业  -->
						<el-col :span="8">
							<el-form-item :label="$t('dm.company')" prop="enterpriseName">
								<cv-dropdown-tree :interface="$COMMON.baseUrl + '/enterprise/getEnterpriseTreeList'"  v-model="addData.enterpriseName" @label="getEntId"></cv-dropdown-tree>
							</el-form-item>
						</el-col>
						<!-- 车牌号  -->
						<el-col :span="8">
							<el-form-item :label="$t('cL.carNumber')" prop="plateCode">
								<el-input v-model.trim="addData.plateCode" size='small' :maxlength='10'></el-input>
							</el-form-item>
						</el-col>
						<!-- 车辆颜色  -->
						<el-col :span="8">
							<el-form-item :label="$t('cL.carColor')" prop="plateColor">
								<el-select v-model="addData.plateColor" clearable :placeholder="$t('terminal.placeholder')" size='small'>
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
								<cv-dropdown-tree v-model="addData.fleetName" :interface="$COMMON.baseUrl + '/fleet/findFleetInfoList'" :is-fleet="true"  :enterprise-id="addData.enterpriseId" @label="vehicleIdCall"></cv-dropdown-tree>
							</el-form-item>
						</el-col>
						<!-- 车架号  -->
						<el-col :span="8">
							<el-form-item :label="$t('cL.vechicleCar')" prop="carVin">
								<el-input v-model.trim="addData.carVin" size='small' :maxlength='17'></el-input>
							</el-form-item>
						</el-col>
						<!-- 车辆类型  -->
						<el-col :span="8">
							<el-form-item :label="$t('cL.carType')" prop="carType">
								<el-select v-model="addData.carType" size='small' clearable filterable :placeholder="$t('terminal.placeholder')">
									<el-option v-for="item in carTypeArry" :key="item.code" :label="item.name" :value="item.code">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<!-- 车辆品牌  -->
						<el-col :span="8">
							<el-form-item :label="$t('cL.carBrand')" prop="brandId">
								<el-select v-model="addData.brandId" clearable filterable :placeholder="$t('terminal.placeholder')" size='small' @change="getModel">
									<el-option v-for="item in vehicleBrand" :key="item.id" :label="item.brandName" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<!-- 厂家名称 -->
						<el-col :span="8">
							<el-form-item :label="$t('cL.factName')" prop="factoryName">
								<el-tooltip :disabled="addData.factoryName == ''?true:false" class="item" effect="dark" :content="addData.factoryName" placement="top-end">
									<el-input v-model.trim="addData.factoryName" size='small' :disabled='true'>
									</el-input>
								</el-tooltip>
							</el-form-item>
						</el-col>
						<!-- 车辆型号  -->
						<el-col :span="8">
							<el-form-item :label="$t('cL.carModel')" prop="vehicleModeId">
								<el-select v-model="addData.vehicleModeId" clearable filterable :disabled='changBrandFlag' :placeholder="$t('terminal.placeholder')" size='small'>
									<el-option v-for="item in factoryType" :key="item.id+''" :label="item.modeName" :value="item.id+''">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<!-- 内部编码  -->
						<el-col :span="8">
							<el-form-item :label="$t('cL.nextCode')" prop="alias">
								<el-input v-model.trim="addData.alias" size='small' :maxlength='20'></el-input>
							</el-form-item>
						</el-col>
						<!-- 设备  -->
						<el-col :span="8">
							<el-form-item :label="$t('cL.equipment')" prop="terminalId">
								<el-select v-model="addData.terminalId" clearable filterable :placeholder="$t('terminal.placeholder')" class="choess" size='small'>
									<el-option v-for='list in terminals' :label='list.manufacturerModelCode' :value='list.id' :key='list.id'></el-option>
								</el-select>
								<el-button icon="plus" @click="addTerminal" size='small' :disabled="terminalAddFlag"></el-button>
							</el-form-item>
						</el-col>
						<!-- 司机  -->
						<el-col :span="8">
							<el-form-item :label="$t('cL.drive')" prop="driverId">
								<el-select v-model="addData.driverId" clearable filterable :placeholder="$t('terminal.placeholder')" class="choess" size='small'>
									<el-option v-for='list in drivers' :label='list.username' :value='list.id' :key='list.id'></el-option>
								</el-select>
								<el-button icon="plus" @click="addMation" size='small' :disabled="driverAddFlag"></el-button>
							</el-form-item>
						</el-col>
						<!-- 车主 -->
						<el-col :span="8">
							<el-form-item label="车主">
								<el-select v-model="addData.vehicleOwnerId" clearable filterable :placeholder="$t('terminal.placeholder')" class="choess" size='small'>
									<el-option v-for='list in VehicleMaster' :label='list.username' :value='list.id' :key='list.id'></el-option>
								</el-select>
								<el-button icon="plus" @click="addMaster" size='small' :disabled="masterAddFlag"></el-button>
							</el-form-item>
						</el-col>
						<!-- 车辆上级平台 -->
						<el-col :span="8">
							<el-form-item label="车辆上级平台" prop="">
								<el-input size='small' v-model="addData.superiorNames" readonly @click.native="bindSuperior" :icon="addData.superiorNames == ''?'':'circle-close'" :on-icon-click="del"></el-input>
								<!-- <cv-icon 
								name="remove"
								style="position:absolute;right:0px;top:11px;"
								@click.native="del"
								v-show="addData.superiorNames == ''?false:true">
								</cv-icon> -->
							</el-form-item>
						</el-col>
						<!-- 车辆行车证  -->
						<!--<el-col :span="8">
									<el-form-item :label="$t('cL.vehicLisence')" prop="vehiclelicenseImg">
										<el-input v-model="addData.vehiclelicenseImg" size='small' :maxlength='20'></el-input>
									</el-form-item>
								</el-col>-->
						<!-- 车身照片  -->
						<!--<el-col :span="8">
									<el-form-item :label="$t('cL.carPhone')" prop="vehicleImg">
										<el-input v-model="addData.vehicleImg" size='small'></el-input>
									</el-form-item>
								</el-col>-->
					</el-form>
				</el-col>
			</el-row>
		</el-tab-pane>
		<el-tab-pane label="视频设置" name="second" ref='second'>
			<el-row class="container" :gutter="10">
				<el-col :span="24">
					<el-form :model="addData" label-position="top" :rules="rules" :inline="false" ref="addFrom">
						<el-col :span="24">
							<el-form-item :label="$t('cL.equipmentType')" prop="dvrType">
								<el-select v-model="addData.dvrType" size='small' @change='changeType' style='width:270px;'>
									<el-option v-for='list in equpmentTypes' :label='list.name' :value='list.code' :key='list.code'></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item :label="$t('cL.accessID')" prop="dvrId">
								<el-input v-model.trim="addData.dvrId" size='small' :maxlength='10' :disabled='addData.flag'></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item :label="$t('cL.userChannels')" prop="channelCount">
								<el-input v-model.trim="addData.channelCount" size='small' :maxlength='3' :disabled='addData.flag'></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item :label="$t('cL.serverPort')" prop="port">
								<el-input v-model.trim="addData.port" size='small' :maxlength='5' :disabled='addData.flag'></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item :label="$t('cL.ipAddress')" prop="ip">
								<el-input v-model.trim="addData.ip" size='small' :maxlength='50' :disabled='addData.flag'></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item :label="$t('cL.username')" prop="username">
								<el-input v-model.trim="addData.username" size='small' :disabled='addData.flag' :maxlength='15'>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item :label="$t('cL.loginPassword')" prop="password">
								<el-input v-model.trim="addData.password" size='small' :disabled='addData.flag' :maxlength='15'></el-input>
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
import {
	COMMON
} from '@/utils'
export default {
	props: {
		options: {}
	},
	data() {
		return {
			activeName: 'first',
			equpmentTypes: [{
					code: 0,
					name: '无视频设备'
				},
				{
					code: 7,
					name: 'N9M'
				},
				{
					code: 13,
					name: '通力'
				},
			],
			carTypeArry: [{
					code: "1",
					name: this.$t("vt.carType1")
				},
				{
					code: "2",
					name: this.$t("vt.carType2")
				},
				{
					code: "3",
					name: this.$t("vt.carType3")
				},
				{
					code: "4",
					name: this.$t("vt.carType4")
				},
				{
					code: "5",
					name: this.$t("vt.carType5")
				},
				{
					code: "6",
					name: this.$t("vt.carType6")
				},
				{
					code: "7",
					name: this.$t("vt.carType7")
				},
				{
					code: "8",
					name: this.$t("vt.carType8")
				},
				{
					code: "9",
					name: this.$t("vt.carType9")
				},
				{
					code: "10",
					name: this.$t("vt.carType10")
				},
				{
					code: "11",
					name: this.$t("vt.carType11")
				},
				{
					code: "12",
					name: this.$t("vt.carType12")
				},
				{
					code: "13",
					name: this.$t("vt.carType13")
				},
				{
					code: "14",
					name: this.$t("vt.carType14")
				},
				{
					code: "15",
					name: this.$t("vt.carType15")
				},
				{
					code: "16",
					name: this.$t("vt.carType16")
				},
				{
					code: "17",
					name: this.$t("vt.carType17")
				},
				{
					code: "18",
					name: this.$t("vt.carType18")
				},
				{
					code: "19",
					name: this.$t("vt.carType19")
				},
				{
					code: "20",
					name: this.$t("vt.carType20")
				},
				{
					code: "21",
					name: this.$t("vt.carType21")
				},
				{
					code: "22",
					name: this.$t("vt.carType22")
				},
				{
					code: "23",
					name: this.$t("vt.carType23")
				},
				{
					code: "24",
					name: this.$t("vt.carType24")
				},
				{
					code: "25",
					name: this.$t("vt.carType25")
				}

			], //车辆类型数据
			terminalAddFlag: true,
			driverAddFlag: true,
			masterAddFlag: true,
			vehicleBrand: [], //车辆品牌
			VehicleMaster: [],
			terminals: [], //设备列表
			factoryType: [], //车辆型号
			drivers: [], //司机列表
			loading: false,
			changBrandFlag: true,
			addData: {
				enterpriseId: "", //所属企业
				alias: "", //内部编码
				vehicleOwnerId: '',
				vehiclelicenseImg: "", //行车证图片地址
				carType: "", //车辆类型
				plateColor: "", //车牌颜色
				plateCode: "", //车牌号
				vehicleModeId: "", //车型
				vehicleImg: "", //车辆图片
				factoryName: "", //厂家名称
				enterpriseName: "",
				brandId: "", //车辆品牌
				fleetId: "", //车组id
				fleetName: "",
				terminalId: "", //设备id
				driverId: "", //司机id
				carVin: "", //车架编号
				dvrId: "",
				dvrType: 0, //设备类型
				channelCount: "", //设备通道数
				ip: "", //服务器IP地址
				port: 0, //服务器端口
				username: "", //登陆用户名
				password: "", //登陆用户密码,
				flag: true,
				superiorNames:''

			},
			rules: {
				enterpriseName: [{
					required: true,
					message: this.$t('filter.noempty'),
					trigger: 'blur,change'
				}],
				dvrId: [{
						required: false,
						message: this.$t('filter.noempty'),
						trigger: 'blur,change'
					},
					{
						pattern: /^[0-9]/,
						message: this.$t("filter.type2")
					}
				],
				port: [{
					pattern: /^[0-9]/,
					message: this.$t("filter.type2")
				}],
				ip: [{
					pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/,
					message: this.$t("filter.type6")
				}],
				channelCount: [{
					required: false,
					message: this.$t('filter.noempty'),
					trigger: 'blur,change'
				}, {
					pattern: /^[0-9]/,
					message: this.$t("filter.type2")
				}],
				plateCode: [{
						required: true,
						message: this.$t('filter.noempty'),
						trigger: 'blur,change'
					},
					{
						pattern: /^[\u4e00-\u9fa5|WJ]{1}[A-Z]{1}[A-Z0-9]{5,6}$/,
						message: this.$t("filter.type6")
					},
					{
						validator: this.isPlateCode,
						trigger: 'blur'
					}
				],
				alias: {
					pattern: /^[A-Z0-9]/,
					message: this.$t("filter.type7"),
					trigger: 'change'
				},
				fleetName: [{
					required: true,
					message: this.$t('filter.noempty'),
					trigger: 'blur,change'
				}],
				plateColor: [{
					required: true,
					message: this.$t('filter.noempty'),
					trigger: 'blur,change'
				}],
				carVin: [{
						pattern: /^[A-Z0-9]/,
						message: this.$t("filter.type7"),
						trigger: 'change'
					},
					{
						min: 17,
						max: 17,
						message: this.$filter.lanReplace(this.$t('filter.FixedLength'), {
							len: 17
						})
					}
				]
			}
		}
	},
	methods: {
		del(e){
			e.preventDefault();
			e.stopPropagation();
			this.options.dialog1.superiorPlatformIds = '';
			this.options.dialog1.superiorPlatformNames = '';
			this.addData.superiorNames = '';
		},
		isPlateCode(rules, value, callback) { //车牌是否存在
			if (!this.$service.isContext(value)) {
				var textlen = value.substring(0, 1);
				var textReg = new RegExp("^[\u4e00-\u9fa5|WJ]");
				var reg;
				if (textReg.test(textlen)) {
					reg = new RegExp("^[\u4e00-\u9fa5|WJ]{1}[A-Z]{1}[A-Z0-9]{5,6}$");
				} else {
					reg = new RegExp("^[A-Za-z0-9]+$");
				}
				if (reg.test(value)) {
					this.$store.dispatch('isExistPlateCode', {
						"plateCode": value
					}).then(data => {
						if (!data.flag) {
							callback(new Error(this.$t("vt.isPlateCode")));
						} else {
							callback();
						}
					});
				} else {
					callback(new Error(this.$t("filter.type6")));
				}
			}
		},
		confirm() {
			var _self = this;
			let _first = _self.$refs['first'].$el,
				_second = _self.$refs['second'].$el;
			_self.$refs['add'].validate(valid => {
				if (valid) {
					_self.$refs['addFrom'].validate(valids => {
						if (valids) {
							let params = {
								superiorPlatformIds:this.options.dialog1.superiorPlatformIds,
								enterpriseId: _self.addData.enterpriseId, //所属企业、
								vehicleOwnerId: _self.addData.vehicleOwnerId,
								alias: _self.addData.alias, //内部编码
								vehiclelicenseImg: _self.addData.vehiclelicenseImg, //行车证图片地址
								carType: _self.addData.carType, //车辆类型
								plateColor: _self.addData.plateColor, //车牌颜色
								plateCode: _self.addData.plateCode, //车牌号
								vehicleModeId: _self.addData.vehicleModeId, //车型
								vehicleImg: _self.addData.vehicleImg, //车辆图片
								factoryName: _self.addData.factoryName, //厂家名称
								brandId: _self.addData.brandId, //车辆品牌
								fleetId: _self.addData.fleetId, //车组id
								terminalId: _self.addData.terminalId, //设备id
								driverId: _self.addData.driverId, //司机id
								carVin: _self.addData.carVin, //车架编号
								vehicleVideoDevice: {
									dvrId: _self.addData.dvrId,
									dvrType: _self.addData.dvrType, //设备类型
									channelCount: _self.addData.channelCount == "" ? 0 : parseInt(_self.addData.channelCount), //设备通道数
									ip: _self.addData.ip, //服务器IP地址
									port: _self.addData.port, //服务器端口
									username: _self.addData.username, //登陆用户名
									password: _self.addData.password, //登陆用户密码,
								}

							}
							_self.loading = true
							_self.$store.dispatch('insertVehicle', params).then(data => {
								if (data.flag) {
									this.$message.success(this.$t('action.addSuccess'));
									this.$emit('confirm')
									this.options.flag = false;
								} else {
									this.$message.error(this.$t('error.'+data.errorCode));
								}
								this.loading = false;
							}).catch(_ => {
								_self.loading = false;
							});
						} else {
							_self.activeName = 'second';
							_self.$myJq.css(_second, "display", 'block');
							_self.$myJq.css(_first, "display", 'none');
							return false;
						}
					});
				} else {
					_self.activeName = 'first';
					_self.$myJq.css(_second, "display", 'none');
					_self.$myJq.css(_first, "display", 'block');
					return false;
				}
			})
		},
		//添加司机弹框事件
		addMation() {
			this.options.dialog1.flag = true;
			this.options.dialog1.size = 'dialog-small';
			this.options.dialog1.name = 'addMation';
			this.options.dialog1.title = this.$t('vt.drive');
		},
		//添加司机弹框事件
		addMaster() {
			this.options.dialog1.flag = true;
			this.options.dialog1.size = 'dialog-large';
			this.options.dialog1.name = 'addMaster';
			this.options.dialog1.title = '车主添加';
		},
		//添加设备弹框事件
		addTerminal() {
			this.options.dialog1.flag = true;
			this.options.dialog1.size = 'dialog-small';
			this.options.dialog1.name = 'addTerminal';
			this.options.dialog1.title = this.$t('vt.getTer');
		},
		// 企业信息回调
		getEntId(val) {
			this.addData.enterpriseId = val.id + "";
			this.getTerminal();
			this.getDrivers();
			this.getBrand();
			this.getVehicleMaster();
			this.addData.fleetName = ''
		},
		// 车辆信息回调
		vehicleIdCall(val) {
			this.addData.fleetId = val.id;
		},
		//获取公司下的设备列表
		async getTerminal() {
			let {
				data,
				flag
			} = await this.$store.dispatch("findUnbindTerminalList", {
				"enterpriseId": this.addData.enterpriseId
			});
			flag ? (this.terminals = data) : (this.terminals = []);
		},
		//获取公司下的司机列表
		async getDrivers() {
			let {
				data,
				flag
			} = await this.$store.dispatch("findDriverList", {
				"enterpriseId": this.addData.enterpriseId
			});
			flag ? (this.drivers = data) : (this.drivers = []);
		},
		//根据品牌ID,查询型号
		getModel() {
			let vehicleBrand = this.vehicleBrand;
			this.addData.factoryName = '';
			this.addData.vehicleModeId = '';
			for (let i in vehicleBrand) {
				if (vehicleBrand[i].id == this.addData.brandId) {
					this.addData.factoryName = vehicleBrand[i].manufacturerName;

				}
			}
			this.$store.dispatch("getFindModel", {
				"brandId": this.addData.brandId
			}).then(data => {
				data.flag ? (this.factoryType = data.data, this.changBrandFlag = false) : (this.factoryType = [], this.changBrandFlag = true);
			});
		},
		//根据品牌ID,查询型号
		getBrand() {
			this.$store.dispatch("getFindBrand", {
				"enterpriseId": this.addData.enterpriseId
			}).then(data => {
				data.flag ? (this.vehicleBrand = data.data) : (this.vehicleBrand = []);
			});
		},
		//根据品牌ID,查询型号
		getVehicleMaster() {
			this.$store.dispatch("getVehicleMaster", {
				"enterpriseId": this.addData.enterpriseId
			}).then(data => {
				data.flag ? (this.VehicleMaster = data.data) : (this.VehicleMaster = []);
			});
		},
		//切换视频设备类型
		changeType() {
			if (this.addData.dvrType == "0") {
				this.rules.dvrId[0].required = false;
				this.rules.channelCount[0].required = false;
				this.addData.channelCount = ""; //设备通道数
				this.addData.ip = ""; //服务器IP地址
				this.addData.port = 0; //服务器端口
				this.addData.username = ""; //登陆用户名
				this.addData.password = ""; //登陆用户密码,
				this.addData.dvrId = ""; //登陆用户密码,
				this.addData.flag = true;
				document.getElementsByClassName('el-form-item__error')[0].style.display = 'none';
				document.getElementsByClassName('el-form-item__error')[1].style.display = 'none';
			} else {
				this.rules.dvrId[0].required = true;
				this.rules.channelCount[0].required = true;
				this.addData.flag = false;
				document.getElementsByClassName('el-form-item__error')[0].style.display = 'block';
				document.getElementsByClassName('el-form-item__error')[1].style.display = 'block';

			}
		},
		getPower() {
			let power = this.$store.getters.manageMenus;
			let _self = this;
			for (let i = 0; i < power.length; i++) {
				for (let j = 0; j < power[i].child.length; j++) {
					if (power[i].child[j].title == '车主管理') {
						if (power[i].child[j].power.indexOf("add") > 0) {
							_self.masterAddFlag = false;
						}
					} else if (power[i].child[j].title == '司机管理') {
						if (power[i].child[j].power.indexOf("add") > 0) {
							_self.driverAddFlag = false;
						}
					} else if (power[i].child[j].title == '终端管理') {
						if (power[i].child[j].power.indexOf("add") > 0) {
							_self.terminalAddFlag = false;
						}
					}
				}
			}
		},
		//绑定上级平台弹框
		bindSuperior(){
			this.options.dialog1.flag = true;
			this.options.dialog1.name = 'addSuperior';
			this.options.dialog1.size = 'dialog-middle';
			this.options.dialog1.title = '上级平台管理';
		}
	},
	//监听事件
	watch: {
		"options.flag" (newVal) {
			if (!newVal) {
				this.options.name = "";
				this.options.dialog1.superiorPlatformNames = ''
				this.options.dialog1.superiorPlatformIds = ''
			}
		},
		"options.dialog1.insterTerminal" (newVal) {
			if (newVal) {
				this.getTerminal();
				this.options.dialog1.insterTerminal = false;
			}
		},
		"options.dialog1.insterMation" (newVal) {
			if (newVal) {
				this.getDrivers();
				this.options.dialog1.insterMation = false;
			}
		},
		"options.dialog1.superiorPlatformNames"(newVal){
			if(newVal){
				this.addData.superiorNames = newVal;
			}
		},
		"options.dialog1.insertVehicleMaster"(newVal){
			if (newVal) {
				this.getVehicleMaster();
				this.options.dialog1.insertVehicleMaster = false;
			}
		},
		'$store.getters.manageMenus' (newVal) {
		}
	},
	mounted() {
		this.getPower();
	}
}
</script>

<style lang="scss">
.carListTabs {
	.choess {
		width: 126px;
	}

	.el-form-item {
		margin-top: 5px;
	}
	.el-tabs__content {
		overflow: visible;
	}
	.dialog-footer {
		margin-bottom: 20px;
	}
}
</style>