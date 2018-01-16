
<template>
	<div class='remote-setting' v-loading='dialogFlag'>
		<el-form :inline='true'  label-position='right' label-width='130px' :model='setting' :rules='rules' ref='uploadForm'>
			<el-form-item label="升级方式:"  prop='type' >
				<el-select v-model="setting.type" placeholder="请选择">
                    <el-option label="终端主动" value="0"></el-option>
                    <el-option label="平台主动" value="1"></el-option>
                </el-select>
			</el-form-item>
			<el-form-item label="选择升级版本:"  prop='text'>
				<el-select v-model="setting.id" placeholder="请选择" @change="iptText">
                    <el-option v-for="item in infoList" :key="item.id" :value='item.id' :label="item.binName"></el-option>
                </el-select>
			</el-form-item>
			<el-form-item label="文件名称:"  prop='binName'>
				<el-input v-model.trim="setting.binName"  size="small" :maxlength='12'>
				</el-input>
			</el-form-item>
			<el-form-item label="硬件版本:"  prop='terminalVersion'>
				<el-input v-model.trim="setting.terminalVersion" size="small" :maxlength='12'>
				</el-input>
			</el-form-item>
			<el-form-item label="固件版本:" prop='appVersion'>
				<el-input v-model.trim="setting.appVersion" size="small" :maxlength='12'>
				</el-input>
			</el-form-item>
			<el-form-item label="URL地址:" >
				<el-input v-model.trim="setting.url"  size="small" >
				</el-input>
			</el-form-item>
            <el-form-item label="制造商ID:" prop='manufatureId'>
                <el-input v-model.trim="setting.manufatureId"  size="small" :maxlength='12'>
				</el-input>
			</el-form-item>
			<el-form-item label="拨号用户名:" prop="dialAccount">
				<el-input v-model.trim="setting.dialAccount"  size="small">
				</el-input>
			</el-form-item>
            <el-form-item label="拨号密码:"  prop='dialPassword'>
				<el-input v-model.trim="setting.dialPassword"  size="small" :maxlength='12'>
				</el-input>
			</el-form-item>
			<el-form-item label="拨号点名称:"  prop='dialPointName'>
				<el-input v-model.trim="setting.dialPointName" size="small" :maxlength='20'>
				</el-input>
			</el-form-item>
            <el-form-item label="服务器地址:"  prop='serverAddr'>
				<el-input v-model.trim="setting.serverAddr"  size="small">
				</el-input>
			</el-form-item>
			<el-form-item label="UDP端口号:"  prop='UDPPort'>
				<el-input v-model.trim="setting.UDPPort" size="small" :maxlength='7'>
				</el-input>
			</el-form-item>
            <el-form-item label="TCP端口号:"  prop='TCPPort'>
				<el-input v-model.trim="setting.TCPPort"  size="small" :maxlength='12'>
				</el-input>
			</el-form-item>
			<el-form-item label="超时阀值(分):"  prop='timeLimit'>
				<el-input v-model.trim="setting.timeLimit" size="small" :maxlength='7'>
				</el-input>
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
import { publicApi, instructCallback } from "../../src/instruction.public.api";
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
                infoList:[],
				setting:{
                    timeLimit:"",
                    vehicleId:this.options.vehicleId ?this.options.vehicleId :this.options.id,
					TCPPort:"",
					UDPPort:'',
					serverAddr:'',
					dialPointName:'',
					dialPassword:"",
                    dialAccount:'',
                    manufatureId:"",
					url:"",
					appVersion:'',
					terminalVersion:'',
					binName:'',
					id:"",
					type:'0',
                },
                tokens:{
					Accept:'application/json, text/plain',
					// Cookie:"token="+localStorage.getItem('token'),
					token:localStorage.getItem('token')
				},
                rules:{//验证规则
                    terminalVersion:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                        {pattern:/^\d||\d[\d\.]+\d$/,message:this.$t("filter.type6")},
                    ],
                    appVersion:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                        {pattern:/^\d||\d[\d\.]+\d$/,message:this.$t("filter.type6")},
                    ],
                    url:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                        // {pattern:/^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/,message:this.$t("filter.type6")},
                        
                    ],
					manufatureId:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                        {pattern:/^\d+$/,message:this.$t("filter.type6")},
                    ],
					UDPPort:{pattern:/^\d+$/,message:this.$t("filter.type6"),trigger:'blur,change'},
					TCPPort:{pattern:/^\d+$/,message:this.$t("filter.type6"),trigger:'blur,change'},
					timeLimit:{pattern:/^\d+$/,message:this.$t("filter.type6"),trigger:'blur,change'},
					serverAddr:{pattern:/^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/,message:this.$t("filter.type6"),trigger:'blur,change'},
				}
			}
		},
		methods: {
            save(){//新增，修改保存
                let _self=this;
                this.$refs['uploadForm'].validate(valid => {
                    if (valid) {
                        _self.submitFalg = true;
                        publicApi({url: "/upgradeLog/insertUpgradeOrderInfo",params: _self.setting}).then(_data => {
                            _self.submitFalg =false;
                            _self.options.flag=false;
                            this.$emit('confirm')
                            instructCallback(_data, _self.options);
                        });
                    }
                });
            },
            changeFile(file,fileList){
                this.upload.fileLen=fileList.length;
            },
            init(){
                this.queryUpgradeLogInfoList().then(data=>{
                    if(data.flag){
                        this.infoList=data.data;
                    }else{
                        this.$message.error(this.$t('error.'+data.errorCode));
                    }
                });
            },
            iptText(id){
                this.infoList.forEach(item=>{
                    if(item.id==id){
                        this.setting.timeLimit=item.timeLimit;
                        this.setting.TCPPort=item.tcpport;
                        this.setting.UDPPort=item.udpport;
                        this.setting.serverAddr=item.serverAddr;
                        this.setting.dialPointName=item.dialPointName;
                        this.setting.dialPassword=item.dialPassword;
                        this.setting.dialAccount=item.dialAccount;
                        this.setting.manufatureId=item.manufatureId;
                        this.setting.url=item.url;
                        this.setting.appVersion=item.appVersion;
                        this.setting.terminalVersion=item.terminalVersion;
                        this.setting.binName=item.binName;
                    }
                })
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
            this.init();
		}
		
	}
</script>
<style lang='scss'>
	.remote-setting{
		.el-select , .el-input{
			width: 200px;
		}
	}
</style>