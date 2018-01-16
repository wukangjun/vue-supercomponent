<template>
		<el-form label-width="150px"  ref="ruleForm" :model="formData" >
		  <el-form-item label="记录仪器初始日期:" prop="time">
			     <el-date-picker
      v-model="formData.time"
      :clearable='false'
	  size="small"
      type="date"
      placeholder="选择日期"
	 
   >
    </el-date-picker>
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
      loading: false,
      formData: {
        time: this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd ")
        )
      }
      // pickerOptions0: {
      //         disabledDate(time) {
      //           return time.getTime() < Date.now();
      // 	  }
      // },
    };
  },
  methods: {
    confirm() {
          let params = {
            vehicleId: this.options.id,
            enterpriseId: this.options.enterpriseId,
            currentTime: this.$filter.format(this.formData.time, "yyyy-MM-dd"),
            type: 0
          };
          this.loading = true;
          publicApi({
            url: "/grapherOrderSend/setRealTime",
            params: params
          }).then(data => {
            instructCallback(data, this.options);
            this.loading = false;
          });
  
    },
    cancel() {
      this.options.flag = false;
    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
.item {
  text-align: center;
}
</style>
