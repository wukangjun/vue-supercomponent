<template>
    <div class='instruction-video'>
        <el-form :model="videoParams" label-position='right' label-width='120px' :rules="rules" :inline="true" ref="video" >
            <el-form-item label="摄像头:" prop='channel'>
                <el-select v-model="videoParams.channel" placeholder="请选择" size="small">
                    <el-option label="1号" value="1"></el-option>
                    <el-option label="2号" value="2"></el-option>
                    <el-option label="3号" value="3"></el-option>
                    <el-option label="4号" value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="录制时间:" prop='interval'>
                <el-input v-model="videoParams.interval" :maxlength="2" size="small"> </el-input>
            </el-form-item>
            <el-form-item label="图片分辨率:" prop='resolution'>
                <el-select v-model="videoParams.resolution" placeholder="请选择" size="small">
                    <el-option value="1" label="320*240"></el-option>
                    <el-option value="2" label="640*480"></el-option>
                    <el-option value="3" label="800*600"></el-option>
                    <el-option value="4" label="1024*768"></el-option>
                    <el-option value="5" label="176*144"></el-option>
                    <el-option value="6" label="352*288"></el-option>
                    <el-option value="7" label="704*288"></el-option>
                    <el-option value="8" label="704*576"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="图像质量:" prop='quality'>
				<el-input-number v-model="videoParams.quality" :step="1" size="small" :min="1" :max='10'></el-input-number>
            </el-form-item>
            <el-form-item label="亮度:" prop='lightness'>
				<el-input-number v-model="videoParams.lightness" :step="1" size="small" :min="0" :max='255'></el-input-number>
            </el-form-item>
            <el-form-item label="对比度:" prop='contrast'>
				<el-input-number v-model="videoParams.contrast" :step="1" size="small" :min="0" :max='127'></el-input-number>
            </el-form-item>
            <el-form-item label="色度:" prop='color'>
				<el-input-number v-model="videoParams.color" :step="1" size="small" :min="0" :max='255'></el-input-number>
            </el-form-item>
            <el-form-item label="饱和度:" prop='saturation'>
				<el-input-number v-model="videoParams.saturation" :step="1" size="small" :min="0" :max='127'></el-input-number>
            </el-form-item>
			<el-form-item label="录像命令:" prop='photoNum'>
                <el-radio-group v-model="videoParams.photoNum">
                    <el-radio class="radio" label="65535">开始录像</el-radio>
                    <el-radio class="radio" label="0">停止录像</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="上传模式:" prop='sendtoServer'>
                <el-radio-group v-model="videoParams.sendtoServer">
                    <el-radio class="radio" label="1">保存</el-radio>
                    <el-radio class="radio" label="0">实时上传</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class='dialog-footer'>
            <el-button type="primary" v-loading="loading"  @click="save">{{ $t('action.confirm') }}</el-button>
            <el-button @click="options.flag=false">{{ $t('action.cancel') }}</el-button>
        </div>
    </div>
</template>

<script>
    import { getEventInfoPage } from '../../src/instruction.other.api'
    import { publicApi, instructCallback } from '../../src/instruction.public.api'
    export default {
        props: {
			options: {}
        },
        data(){
            return{
                loading:false,
                videoParams:{
                    channel:"1",//摄像头
                    photoNum:"65535",//录像命令
                    interval:"1",//录制时间
                    resolution:"1",//图片分辨率
                    quality:'1',//图像质量
                    lightness:"0",//亮度
                    contrast:"0",//对比度
                    color:"0",//色度
                    saturation:"0",//饱和度
                    sendtoServer:"1",//上传模式
					vehicleId:this.options.id,
					enterpriseId:this.options.enterpriseId
                },
                rules:{
                    interval:{required: true,message: this.$t('filter.noempty'),trigger: 'blur,change'}
                   
                }
            }
        },
        methods:{
            save(){
                this.$refs['video'].validate(valid => {
                    publicApi({url: '/sendOrder/video',params:this.videoParams}).then(data=>{
                        instructCallback(data, this.options);
                        this.loading = false;
                    }).catch(_=>{
                        this.options.flag = false;
                        this.$message.error(this.$t('error.'+data.errorCode));
                        this.loading = false;
                    });
                });
            }   
        }
    }
</script>
<style lang="scss">
.instruction-video{
	.el-input , .el-select , .el-input-number ,.el-radio-group{
		width: 200px;;
	}
}
</style>



