<template>
<!-- 锁车 -->
<el-form label-width="100px" :model="localCar" ref="ruleForm">	 
<el-form-item label="锁车:" prop="localCar">
     <el-radio-group v-model="localCar.radio2">
    <el-radio :label="0">车门解锁</el-radio>
    <el-radio :label="1">车门加锁</el-radio>
  </el-radio-group>
</el-form-item>
	<div class="dialog-footer" >
	<el-button type="primary" class="intrusion-lalCar" @click="confirm" :loading="localCar.loading">确认</el-button>
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
  data() {
    return {
      localCar:{
        radio2: '',
        loading: false
      }
    };
  },
  methods: {
    confirm() {
      let params = {
        vehicleId: this.options.id,
        type: this.localCar.radio2,
        enterpriseId: this.options.enterpriseId
      };
      (this.localCar.loading = true),
        this.$http({
          url: this.$COMMON.baseUrl + "/sendOrder/lockDoor",
          params: params
        }).then(data => {
          if (!data.flag && !!data.errorCode)
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
          else {
            this.$message.success("指令下发成功");
          }
          this.localCar.loading = false;
          this.options.flag = false;
        });
    },

    cancel() {
      this.options.flag = false;
    }
  },
  mounted() {},
  watch() {}
};
</script>
<style lang="scss" scoped>
.intrusion-lalCar {
  margin-left: 200px;
}
</style>
