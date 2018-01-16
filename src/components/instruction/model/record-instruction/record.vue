<template>
		<el-form label-width="100px"  :rules="rules" ref="ruleForm" :model="formData" class="intrusion-record">
		  <el-form-item label="录音命令:" prop="tape">
			       <el-radio-group v-model="formData.radio3">
    					<el-radio :label="1">开始录音</el-radio>
    					<el-radio :label="0">结束录音</el-radio>
  					</el-radio-group>
		  </el-form-item>
		  <el-form-item label="录制时间:" prop="time">
			  <el-input v-model="formData.time" placeholder="" style="width:310px" size="small"></el-input>(s)
		  </el-form-item>
		<el-form-item label="音频采样率:" prop="frequency">
			    <el-select  v-model="formData.recordType" size='small' style="width:330px">
                        <el-option v-for="list in recordList" :key="list.id" :value='list.id' :label="list.name"></el-option>
                    </el-select>
		  </el-form-item>
		<el-form-item label="上传模式:" prop="upType">
			      <el-radio-group v-model="formData.upload">
    					<el-radio :label="1">保存</el-radio>
    					<el-radio :label="0">实时上传</el-radio>
  					</el-radio-group>
		  </el-form-item>
	<div class="dialog-footer">
	<el-button type="primary"  @click="confirm" :loading="loading">确认</el-button>
	<el-button type="" @click="cancel">取消</el-button>
	</div>
</el-form>
</template>
<script>

import { publicApi, instructCallback } from "../../src/instruction.public.api";
export default {
  props: {
    options: {}
  },
  data() {
    return {
      loading:false,
      formData:{
        time:'',
        radio3: 1,
	      recordType: "0",
	      upload: 1,
      },

      recordList: [
        { id: "0", name: "8kbs" },
        { id: "1", name: "11kbs" },
        { id: "2", name: "23kbs" },
        { id: "3", name: "32kbs" }
      ],
      rules: {
        time: [    {
            required: true,
            message: this.$t("filter.notEmpty"),
            trigger: "blur"
          }],
		
      }
    };
  },
  methods: {
    confirm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let params = {
            vehicleId: this.options.id,
            enterpriseId: this.options.enterpriseId,
            stop: this.formData.radio3,
            recordSec: this.formData.time ,
            sendtoServer: this.formData.upload,
            soundRate: this.formData.recordType
          };
          this.loading = true;
            publicApi({
              url:"/sendOrder/sound",
              params: params
            }).then(data => {
        instructCallback(data, this.options);
        this.loading=false;
            });
        } else {
            return false;
        }
      });
    },
    cancel() {
      this.options.flag = false;
    }
  },
  watch:{}
};
</script>
<style lang="scss" scoped>
.intrusion-record{
  padding-left:60px;
}
</style>
