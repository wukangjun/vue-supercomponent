<template>
		<el-form label-width="100px"  :rules="rules" ref="ruleForm" :model="formData" >
  
	 <el-form-item label="初始里程:" prop="pulse">
			  <el-input v-model="formData.pulse" placeholder=""  size="small"></el-input>
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
        pulse: ""
      },
      rules: {
        pulse: [
            {
            required: true,
            message: this.$t("filter.noempty"),
            trigger: "blur,change"
          },
          {
            pattern: /^[A-Z0-9]/,
            message: this.$t("filter.type7")
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
            initialMileage: parseInt(this.formData.pulse),
            type: "196"
          };
          this.loading = true;
          publicApi({
            url: "/grapherOrderSend/sendGrapherInitMileage",
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
