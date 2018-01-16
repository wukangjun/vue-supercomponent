
<template>
	<div class='remote-updata' v-loading='dialogFlag'>
		<el-form :inline='true'  label-position='right' label-width='110px' :model='upload' :rules='rules' ref='uploadForm'>
			<el-form-item label="上传新版本:" >
				<el-upload :action="$COMMON.baseUrl+'/upgradeLog/insertUploadBinFileInfo'" :data="upload"
                :auto-upload="false" ref="upload" :headers='tokens'
                :on-change='changeFile'
                :on-remove='changeFile'
                :on-success='successFile'
                :on-error="errorFile"
                accept='.bin'>
                <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
			</el-form-item>
			<el-form-item label="制造商ID:"  prop='manufatureId'>
				<el-input v-model.trim="upload.manufatureId" size="small" :maxlength='12'>
				</el-input>
			</el-form-item>
			<el-form-item label="硬件版本:"  prop='terminalVersion'>
				<el-input v-model.trim="upload.terminalVersion"  size="small" :maxlength='12'>
				</el-input>
			</el-form-item>
			<el-form-item label="固件版本:"  prop='appVersion'>
				<el-input v-model.trim="upload.appVersion" size="small" :maxlength='7'>
				</el-input>
			</el-form-item>
			<el-form-item label="拨号点名称:" prop='dialPointName'>
				<el-input v-model.trim="upload.dialPointName" size="small" :maxlength='12'>
				</el-input>
			</el-form-item>
			<el-form-item label="超时阀值(分):" prop="timeLimit">
				<el-input v-model.trim="upload.timeLimit"  size="small" :maxlength='12'>
				</el-input>
			</el-form-item>
            <el-form-item label="终端型号:">
                <label class="text">{{upload.equipmentMode}}</label>
			</el-form-item>
			<el-form-item label="终端协议版本:">
				<label class="text"> {{upload.protocol}}</label>
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
				upload:{
					fileLen:'0',
					manufatureId:"1",
					terminalVersion:"1.0",
					appVersion:'1.0',
					dialPointName:'',
					timeLimit:'1',
					mehicleType:"",
                    mehicleVersion:'',
                    equipmentMode:'',
                    protocol:''
                },
                tokens:{
					Accept:'application/json, text/plain',
					// Cookie:"token="+localStorage.getItem('token'),
					token:localStorage.getItem('token')
				},
				rules:{//验证规则
					terminalVersion:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                        {pattern:/^\d[\d\.]+\d$/,message:this.$t("filter.type6")},
                    ],
					appVersion:[
						{required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                        {pattern:/^\d[\d\.]+\d$/,message:this.$t("filter.type6")},
					],
					manufatureId:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                        {pattern:/^[0-9]+$/,message:this.$t("filter.type2")},
                    ],
					timeLimit:[
                        {required:true,message:this.$t('filter.notEmpty'),trigger:'blur,change'},
                        {pattern:/^[0-9]+$/,message:this.$t("filter.type2")},
                    ]
				}
			}
		},
		methods: {
			save(){//新增，修改保存
				let _self=this;
                _self.$refs['uploadForm'].validate(valid => {
                    if (valid) {
                        if(_self.upload.fileLen!=0 && _self.upload.fileLen !='0'){
                            _self.loading=true;
                            _self.$refs.upload.submit();
                        }else{
							_self.$message.warning("请选择上传bin文件!");
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
                    this.$message.error(this.$t("error."+response.errorCode));
					this.options.flag = false;
				}
                
            },
            errorFile(err, file, fileList){
                this.loading=false;
                this.$message.error(this.$t('action.addFail'));
                this.options.flag = false;
            },
            changeFile(file,fileList){
                this.upload.fileLen=fileList.length;
            },
            init(){
                this.queryTerminalParam({vehicleId:this.options.vehicleId}).then(data=>{
                    if(data.flag){
                        this.upload.equipmentMode=data.data.equipmentMode;
                        this.upload.protocol=data.data.protocol;
                    }else{
                        this.$message.error(this.$t('error.'+data.errorCode));
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
            this.init();
		}
		
	}
</script>
<style lang='scss'>
	.remote-updata{
		.el-select , .el-input,.el-upload{
			width: 160px;
		}
        .text{
            width: 160px;
            display: inline-block;
        }
	}
</style>