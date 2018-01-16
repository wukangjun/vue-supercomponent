<template>
    <div class='instruction-mediaUpload'>
        <el-form :model="mediaUploadParams" label-position='right' label-width='150px'  :inline="false" ref="mediaUpload" >
            <el-form-item label="摄像头:" prop='channelId'>
                <el-select v-model="mediaUploadParams.channelId" placeholder="请选择" size="small">
					<el-option label="全部" value="0"></el-option>
                    <el-option label="1号" value="1"></el-option>
                    <el-option label="2号" value="2"></el-option>
                    <el-option label="3号" value="3"></el-option>
                    <el-option label="4号" value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="起始时间:" prop='dateTime'>
                <el-date-picker v-model="mediaUploadParams.dateTime" :editable='false' :clearable='false' type="datetimerange" placeholder="选择时间范围"></el-date-picker>
            </el-form-item>
            <el-form-item label="多媒体类别:" prop='mediaType'>
                <el-select v-model="mediaUploadParams.mediaType" placeholder="请选择" size="small">
                    <el-option label="图片" value="0"></el-option>
                    <el-option label="音频" value="1"></el-option>
                    <el-option label="视频" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="删除标志:" prop='delFlag'>
                <el-select v-model="mediaUploadParams.delFlag" placeholder="请选择" size="small">
                    <el-option value="0" label="保留"></el-option>
                    <el-option value="1" label="删除"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="事件编码:" prop='eventType'>
                <el-select v-model="mediaUploadParams.eventType" placeholder="请选择" size="small">
                    <el-option value="0" label="平台下发指令"></el-option>
                    <el-option value="1" label="定时动作"></el-option>
                    <el-option value="2" label="抢劫报警触发"></el-option>
                    <el-option value="3" label="碰撞侧翻报警触发"></el-option>
                    <el-option value="4" label="其他"></el-option>
                </el-select>
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
                mediaUploadParams:{
                    channelId:"1",//摄像头
                    dateTime:[
						this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd start')),
						this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd end'))	
					],
					mediaType:"0",//图片类型
                    delFlag:"0",//删除标志
                    eventType:'0',//事件编码
					vehicleId:this.options.id,
					enterpriseId:this.options.enterpriseId
                },
//                 rules:{
//                     channelId:{required: true,message: this.$t('filter.noempty'),trigger: 'blur,change'},
//                     dateTime:{required: true,message: this.$t('filter.noempty'),trigger: 'blur,change'},
//                     mediaType:{required: true,message: this.$t('filter.noempty'),trigger: 'blur,change'},
//                     delFlag:{required: true,message: this.$t('filter.noempty'),trigger: 'blur,change'},
// 					eventType:{required: true,message: this.$t('filter.noempty'),trigger: 'blur,change'}
//                 }
            }
        },
        methods:{
            save(){
                this.$refs['mediaUpload'].validate(valid => {
                    this.loading=true;
					let _params=this.mediaUploadParams;
					_params.startTime=this.$filter.format(this.mediaUploadParams.dateTime[0],'yyyy-MM-dd HH:mm:ss');
					_params.endTime=this.$filter.format(this.mediaUploadParams.dateTime[1],'yyyy-MM-dd HH:mm:ss');
                    publicApi({url: '/sendOrder/mediaUpload',params:_params}).then(data=>{
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
.instruction-mediaUpload{
	.el-input , .el-select{
		width: 350px;;
	}
}
</style>
