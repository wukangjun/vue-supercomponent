<template>
	<div class="vehicle-upload">
        <div style="margin-bottom:20px;text-align:right">
            <el-button @click="downFile" type="primary">下载导入模版</el-button>
        </div>
		<el-form :inline='true'  label-position='top' :model='uploadPar' label-width="100px" :rules='rules' ref='uploadForm'>
			<el-form-item :label="$t('terminal.company1')" prop="enterpriseName">
				<cv-dropdown-tree 
				style="width:260px"
				:placeholder="$t('common.enterprise.affiliated')"
				:interface=" $COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'"
				:is-default="true"
				v-model='uploadPar.enterpriseName'
                @label='getCompany'
				></cv-dropdown-tree>
			</el-form-item>
            <el-form-item :label="$t('cL.subGroup')" prop="fleetName">
                <cv-dropdown-tree v-model="uploadPar.fleetName" :is-fleet="true" :interface="$COMMON.baseUrl + '/fleet/findFleetInfoList'" :is-default="true" :enterprise-id="uploadPar.enterpriseId" @label="vehicleIdCall"></cv-dropdown-tree>
            </el-form-item>
			<el-form-item :label="$t('cL.carType')">
                <el-select v-model="uploadPar.carType" size='small' clearable filterable :placeholder="$t('terminal.placeholder')">
                    <el-option v-for="item in carTypeArry" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('cL.carBrand')" >
                <el-select v-model="uploadPar.brandId" clearable filterable :placeholder="$t('terminal.placeholder')" size='small' @change="getModel">
                    <el-option v-for="item in vehicleBrand" :key="item.id_" :label="item.brandName" :value="item.id_">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('cL.factName')" prop="factoryName">
                <el-input v-model.trim="uploadPar.factoryName" size='small' :disabled='true'>
                </el-input>
            </el-form-item>
            <el-form-item :label="$t('cL.carModel')" prop="vehicleModeId">
                <el-select v-model="uploadPar.vehicleModeId" clearable filterable :disabled='changBrandFlag' :placeholder="$t('terminal.placeholder')" size='small'>
                    <el-option v-for="item in factoryType" :key="item.id+''" :label="item.modeName" :value="item.id+''">
                    </el-option>
                </el-select>
            </el-form-item>
			<el-form-item :label="$t('terminal.manufacturer')" prop='manufacturerId'>
				<el-select v-model="uploadPar.manufacturerId" clearable :placeholder="$t('terminal.placeholder')" class="code" size='small' @change="findModel">
					<el-option v-for='list in manufacturerName' :label='list.name' :value='list.id+""' :key='list.id+""'></el-option>
				</el-select>
			</el-form-item>
			<el-form-item :label="$t('terminal.terminalType1')"  prop='manufacturerModel'>
				<el-select v-model="uploadPar.manufacturerModel" clearable :placeholder="$t('terminal.placeholder')" class="code" size='small' >
					<el-option v-for='list in modelType' :label='list.manufacturerNumber+" & "+list.model' :value='list.id+""' :key='list.id+""'></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="导入文件:">
				<el-upload class="upload-file" drag :action="$COMMON.baseUrl+'/vehicle/importVehicle'" 
				:headers='tokens' :data="uploadPar"
                show-file-list :auto-upload="false" ref="upload"
                :on-change='changeFile'
                :on-remove='changeFile'
                :on-success='successFile'
                :on-error="errorFile">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
			</el-form-item>
            
		</el-form>
		<div class='dialog-footer'>
			<el-button type="primary" v-loading="loading"  @click="confirm">{{ $t('action.confirm') }}</el-button>
			<el-button @click='options.flag=false'>{{ $t('action.cancel') }}</el-button>
		</div>
	</div>
</template>
<script>
	import { COMMON } from '@/utils'
	export default{
		mixins: [],
		props: {
			options: {}
		},
		data(){
			return{
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
                vehicleBrand:[],
				factoryType:[],
				manufacturerName:[],
				modelType:[],
				tokens:{
					Accept:'application/json, text/plain',
					// Cookie:"token="+localStorage.getItem('token'),
					token:localStorage.getItem('token')
				},
                changBrandFlag:true,
                loading:false,
				uploadPar:{
                    enterpriseName:'',
                    enterpriseId:'',
                    fleetName:'',
                    fleetId:'',
                    carType:'',
                    carModel:'',
                    fileLen:'0',
                    brandId:'',
                    factoryName:'',
					vehicleModeId:'',
					manufacturerId:'',
					manufacturerModel:''
                },
                rules:{
                    enterpriseName:{required: true,message: this.$t('filter.noempty'),trigger: 'blur,change'},
                    fleetName:{required: true,message: this.$t('filter.noempty'),trigger: 'blur,change'},
                    file:[
                        {required: true,message: '请选择导入文件',trigger: 'blur,change'},
                        {validator: this.isFile,trigger: 'blur,change'}
					],
					manufacturerId:{required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
					manufacturerModel:{required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
					carType:{required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
					brandId:{required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                }
			}
		},
		methods: {
			confirm(){
				let _self=this;
               this.$refs['uploadForm'].validate(valid => {
					if (valid) {
                        if(_self.uploadPar.fileLen!=0 && _self.uploadPar.fileLen !='0'){
                            _self.loading=true;
                            // this.$store.dispatch("importVehicleFile", {"brandId": this.uploadPar.brandId}).then(data => {
                            //     data.flag ? (this.factoryType = data.data, this.changBrandFlag = false) : (this.factoryType = [], this.changBrandFlag = true);
							// });
							// console.log(this.$COMMON.baseUrl+'/vehicle/importVehicle')
                            _self.$refs.upload.submit();
                        }else{
							this.$message.warning("请选择导入文件");
						}
                    }
                });
            },
            successFile(response, file, fileList){
				if(response.flag){
					this.loading=false;
					this.$message.success(this.$t('action.addSuccess'));
					this.$emit('confirm')
					this.options.flag = false;
				}else{
					this.loading=false;
					this.options.flag = false;
					// console.log(response.errorCode)
					// if(response.errorCode){
					// 	this.$message.error(this.$t("error."+response.errorCode));
					// 	return false;
					// }
					let _item=response.data.split(',');
					if(_item.length>1){
						this.$message.error("导入文件的"+_item[0]+"行,"+_item[1]+"列，数据有误！");
					}else{
						this.$message.error("导入文件的"+_item[0]+"行,数据有误！");
					}
				}
                
            },
            errorFile(err, file, fileList){
                this.loading=false;
                this.$message.error(this.$t('action.addFail'));
                this.options.flag = false;
            },
			getCompany(val){
                val.id == 'empty'?(this.uploadPar.enterpriseId=''):(this.uploadPar.enterpriseId=val.id);
                this.getBrand();
            },
            vehicleIdCall(val){
                val.id == 'empty'?(this.uploadPar.fleetId=''):(this.uploadPar.fleetId=val.id);
            },
            //根据品牌ID,查询型号
			getModel() {
				let vehicleBrand = this.vehicleBrand;
				this.uploadPar.factoryName = '';
				this.uploadPar.vehicleModeId = '';
				for (let i in vehicleBrand) {
					if (vehicleBrand[i].id == this.uploadPar.brandId) {
						this.uploadPar.factoryName = vehicleBrand[i].manufacturerName;
	
					}
				}
				this.$store.dispatch("getFindModel", {"brandId": this.uploadPar.brandId}).then(data => {
					data.flag ? (this.factoryType = data.data, this.changBrandFlag = false) : (this.factoryType = [], this.changBrandFlag = true);
				});
			},
			//根据品牌ID,查询型号
			getBrand() {
				this.$store.dispatch("getFindBrand", {"enterpriseId": this.uploadPar.enterpriseId}).then(data => {
					data.flag ? (this.vehicleBrand = data.data) : (this.vehicleBrand = []);
				});
            },
            downFile(){
                const uploadUrl = this.$service.winParams(this.$COMMON.baseUrl + '/temp/defaultTemplate.xls'); 
                window.location.href=uploadUrl;
            },
            changeFile(file,fileList){
                this.uploadPar.fileLen=fileList.length;
            },
            isFile(rules, value, callback) {
				if (!this.$service.isContext(value)) {
					if(value !='0'){
                        callback();
                    }else{
                        callback(new Error('请选择导入文件'));
                    }
				}
			},
			//制造商数据
			findManu(){
				this.$store.dispatch("findManufacturerList").then((data) => {
					data.flag ? (this.manufacturerName = data.data) :(this.manufacturerName = []);
				});
			},
			//终端型号以及编号数据获取
			findModel(){ 
				this.$store.dispatch("findModelList",{manufacturerId:this.uploadPar.manufacturerId}).then((data) => {
					data.flag ? (this.modelType = data.data,this.manufacturerModel="") :(this.modelType = []);
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
        mounted() {
			this.findManu();
        }
	}
</script>
<style lang='scss'>
.vehicle-upload{
    .el-select,.el-input,.el-upload-dragger{
        width: 260px;
    }
    .el-upload-dragger{
        .el-icon-upload{
            font-size: 50px;
        }
    }
}
</style>