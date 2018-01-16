
<template>
	<div class='server-setting' >
		<el-form :inline='true'  label-position='right' label-width='130px' :model='setting' :rules='rules' ref='uploadForm'>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="切换平台:"  prop='control' >
                        <el-radio-group v-model="setting.control" @change='setType'>
                            <el-radio label="1">默认平台</el-radio>
                            <el-radio label="0">指定平台</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
			<el-row v-show="showFlag">
                <el-col :span="12">
                    <el-form-item label="拨号用户名:" prop="dialAccount">
                        <el-input v-model.trim="setting.dialAccount"  size="small" :maxlength='12'>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="拨号密码:"  prop='dialPassword'>
                        <el-input v-model.trim="setting.dialPassword"  size="small" :maxlength='12'>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-show="showFlag">
                <el-col :span="12">
                    <el-form-item label="拨号点名称:"  prop='dialPointName'>
                        <el-input v-model.trim="setting.dialPointName" size="small" :maxlength='20'>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="服务器地址:"  prop='serverAddr'>
                        <el-input v-model.trim="setting.serverAddr"  size="small">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
			<el-row v-show="showFlag">
                <el-col :span="12">
                    <el-form-item label="UDP端口号:"  prop='UDPPort'>
                        <el-input v-model.trim="setting.UDPPort" size="small" :maxlength='7'>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="TCP端口号:"  prop='TCPPort'>
                        <el-input v-model.trim="setting.TCPPort"  size="small" :maxlength='12'>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-show="showFlag">
                <el-col :span="12">
                    <el-form-item label="平台鉴权码:"  prop='authCode'>
                        <el-input v-model.trim="setting.authCode" size="small" :maxlength='12'>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="超时阀值:"  prop='timeLimit'>
                        <el-input v-model.trim="setting.timeLimit" size="small" :maxlength='7'>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
		</el-form>
		<div class='dialog-footer'>
			<el-button type="primary" :loading='submitFalg'  @click="save">{{ $t('action.confirm') }}</el-button>
			<el-button @click='options.flag=false'>{{ $t('action.cancel') }}</el-button>
		</div>
	</div>
</template>
<script>
import { publicApi, instructCallback } from "../../src/instruction.public.api";
	export default{
		mixins: [],
		props:{
			options:{

			}
		},
		data(){
			return{
                submitFalg:false,//确定提交的loading
                showFlag:false,
				setting:{
                    cmdType:2,
                    timeLimit:"",
                    control:"1",
                    vehicleId:this.options.id,
                    enterpriseId: this.options.enterpriseId,
					TCPPort:"",
					UDPPort:'',
					serverAddr:'',
					dialPointName:'',
					dialPassword:"",
                    dialAccount:'',
					authCode:'',
                },
                rules:{//验证规则
                    control:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                    ],
                    dialPointName:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'}
                    ],
                    dialPassword:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'}
                    ],
                    dialAccount:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'}
                    ],
					manufatureId:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                        {pattern:/^\d+$/,message:this.$t("filter.type6")},
                    ],
                    authCode:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'}
                    ],
					UDPPort:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                        {pattern:/^\d+$/,message:this.$t("filter.type6"),trigger:'blur,change'}
                    ],
                    TCPPort:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                        {pattern:/^\d+$/,message:this.$t("filter.type6"),trigger:'blur,change'}
                    ],
					timeLimit:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                        {pattern:/^\d+$/,message:this.$t("filter.type6"),trigger:'blur,change'}
                    ],
					serverAddr:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                        {pattern:/^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/,message:this.$t("filter.type6"),trigger:'blur,change'},
                    ]
                }
			}
		},
		methods: {
            save(){//新增，修改保存
                let _self=this;
                if(this.setting.control=="1"){
                    _self.send();
                }else{
                    _self.$refs['uploadForm'].validate(valid => {
                        if (valid) {
                            _self.submitFalg = true;
                            _self.send();
                        }
                    });
                }
            },
            send(){
                publicApi({url: "/sendOrder/terminalControl",params: this.setting}).then(_data => {
                    this.submitFalg =false;
                    this.options.flag=false;
                    instructCallback(_data, this.options);
                });
            },
            setType(val){
                val==0 ? this.showFlag=true: this.showFlag=false;
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
<style lang='scss'>
	.server-setting{
		.el-select , .el-input{
			width: 200px;
		}
	}
</style>