<template>
		<el-form label-width="200px"  :rules="rules" ref="ruleForm" :model="formData" >
		  <el-form-item label="记录仪实时时间:" prop="time" >
  <el-date-picker
      v-model="formData.time"
      type="datetime"
	  size="small"
    :clearable='false'
	   style="width:330px"
      placeholder="选择日期时间">
    </el-date-picker>
		  </el-form-item>
	 <el-form-item label="脉冲系数:" prop="pulse">
			  <el-input v-model="formData.pulse" placeholder=""  style="width:330px" size="small"></el-input>
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
          this.$filter.format(new Date(), "yyyy-MM-dd HH:mm:ss")
        ),
        pulse: ""
      },
      rules: {
        pulse:[
          {
            required: true,
            pattern: /^[A-Z0-9]/,
            message: this.$t("filter.type2"),
            trigger: "change"
          },
          {
            min: 0,
            max: 65535,
            message: this.$filter.lanReplace(this.$t("filter.Length"), {
              len: 65535
            })
          }
        ]
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
            currentTime: this.$filter.format(
              this.formData.time,
              "yyyy-MM-dd HH:mm:ss"
            ),
            feature: parseInt(this.formData.pulse),
            type: "195"
          };
          this.loading = true;
          publicApi({
            url: "/grapherOrderSend/sendGrapherPulseOrder",
            params: params
          }).then(data => {
            instructCallback(data, this.options);
            this.loading = false;
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
  watch: {}
};
</script>
<style lang="scss" scoped>

</style>
