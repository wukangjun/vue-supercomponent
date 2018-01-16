<template>
	
		<el-form label-width="100px"  class="intrusion-search">
		  <el-form-item label="摄像头:" >
			       <el-select  v-model="camerType" size='small' class="intrusion-media">
                        <el-option v-for="list in cameraList" :key="list.type" :value='list.type' :label="list.name"></el-option>
                    </el-select>
		  </el-form-item>
		     <el-form-item label="起止时间">
                <el-date-picker v-model="SEtime" size="small" :clearable="false" :editable="false" type="datetimerange" placeholder="选择时间范围" :picker-options="pickerOption" class="intrusion-media">
                </el-date-picker>
            </el-form-item>
		<el-form-item label="多媒体类别:">
			    <el-select  v-model="mType" size='small' class="intrusion-media">
                        <el-option v-for="list in mediaType" :key="list.type" :value='list.type' :label="list.name"></el-option>
                    </el-select>
		  </el-form-item>
		<el-form-item label="事件编码:">
			     <el-select  v-model="handleType" size='small' class="intrusion-media">
                        <el-option v-for="list in handleCode" :key="list.type" :value='list.type' :label="list.name"></el-option>
                    </el-select>
		  </el-form-item>
<div class="dialog-footer">
	<el-button type="primary" class="med" @click="confirm" :loading="loading">确认</el-button>
	<el-button type="" @click="cancel">取消</el-button>
</div>
		</el-form>

</template>
<script>
import { http, COMMON, service } from "@/utils";
export default {
	  props: {
    options: {}
  },
  
data(){
	return{
	  loading:false,
		mType:'1',
		handleType:'1',
		camerType:'0',
		cameraList:[
			{type:'0',name:"所有"},
			{type:'1',name:"1号"},
			{type:'2',name:"2号"},
			{type:'3',name:"3号"},
			{type:'4',name:"4号"},
		],
		mediaType:[
			{type:'0',name:"图片"},
			{type:'1',name:"音频"},
			{type:'2',name:"视频"}
		
		],
		handleCode:[
			{type:'0',name:"平台下发指令"},
			{type:'1',name:"定时动作"},
			{type:'2',name:"抢劫报警触发"},
			{type:'3',name:"碰撞侧翻报警触发"},
			{type:'4',name:"其它"},
		],
		SEtime: [
        this.$filter.timeStamp(
          this.$filter.format(
            new Date(new Date() - 24 * 60 * 60 * 1000),
            "yyyy-MM-dd start"
          )
        ),
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd end")
        )
			],
			// 日期配置
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }

	}
},
methods:{
    confirm() {
      let params = {
		  startTime:this.$filter.format(this.SEtime[0], "yyyy-MM-dd  HH:mm:ss"),
			endTime:this.$filter.format(this.SEtime[1], "yyyy-MM-dd  HH:mm:ss"),
			mediaType:this.mType,
			channel:this.camerType,
			eventType:this.handleType,
			vehicleId:this.options.id,
			 enterpriseId: this.options.enterpriseId
      };
      this.loading = true,
        this.$http({
          url: this.$COMMON.baseUrl + "/sendOrder/mediaQuery",
          params: params
        }).then(data => {
          if (!data.flag && !!data.errorCode)
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
          else {
            this.$message.success("指令下发成功");
          }
          this.loading = false;
          this.options.flag = false;
        });
    },

    cancel() {
      this.options.flag = false;
	},



}


}
</script>
<style lang="scss" scoped>
.intrusion-search{
	padding-left:100px;
.intrusion-media{
	width:330px;

}
}
</style>
