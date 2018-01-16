<template>
		<el-form label-width="100px"  :rules="rules" ref="ruleForm" :model="formData">
		  <el-form-item label="处理意见:" prop="remark">
			    <el-input v-model="formData.remark"  type="textarea"
  :autosize="{ minRows: 4, maxRows: 6}"
  placeholder="请输入内容"></el-input>
		  </el-form-item>
	
	<div class="dialog-footer">
<el-button type="primary" size="small" @click="notHandle" :loading="loading1" >不做处理</el-button>
<el-button type="primary" size="small" @click="futHandle"  :loading="loading2" >将来处理</el-button>	
<el-button type="primary" size="small" @click="handleOver"  :loading="loading3">处理完毕</el-button>
	</div>
</el-form>
</template>

<script>
import alHandle from "./alHandle";
export default {
  props: {
    options: {}
  },
  mixins: [alHandle],
  data() {
    return {
      loading: false,
      formData: {
        remark: ""
      },
      loading1: false,
      loading2: false,
      loading3: false,

      rules: {
        remark: [
          {
            required: true,
            message: this.$t("filter.noempty"),
            trigger: "blur,change"
          }
        ]
      }
    };
  },
  methods: {
    //处理成功之后
    notHandle() {
      // debugger
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (this.loading2 == true || this.loading3 == true) {
            return false;
          } else {
            let params = {
              context: this.formData.remark,
              alarmJson: JSON.stringify(this.options.jsonP),
              status: "2",
              vehicleId: this.$route.query.vehicleId,
              plateColor:this.$route.query.plateColor,
              plateCode:this.$route.query.plateCode

            };
            this.loading1 = true;
            this.$http({
              url: this.$COMMON.baseUrl + "/alarmInfo/updateAlarmInfo",
              params: params
            }).then(data => {
              if (!data.flag && !!data.errorCode) {
                this.$message.error({
                  message: this.$t("error." + data.errorCode)
                });
                this.loading1 = false;
              } else {
                this.$message.success(this.$t("action.noticeSuccess"));
                this.$parent.$parent.LoadGrid();
              }
              this.options.flag = false;
              this.loading1 = false;
              // this.options.jsonP = [];
            });
          }
        } else {
          return false;
        }
      });
    },
    futHandle() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (this.loading1 == true || this.loading3 == true) {
            return false;
          } else {
            let params = {
              context: this.formData.remark,
              alarmJson: JSON.stringify(this.options.jsonP),
              status: "3",
              vehicleId: this.$route.query.vehicleId,
                plateColor:this.$route.query.plateColor,
              plateCode:this.$route.query.plateCode
            };
            this.loading2 = true;
            this.$http({
              url: this.$COMMON.baseUrl + "/alarmInfo/updateAlarmInfo",
              params: params
            }).then(data => {
              if (!data.flag && !!data.errorCode) {
                this.$message.error({
                  message: this.$t("error." + data.errorCode)
                });
                this.loading2 = false;
              } else {
                this.$message.success(this.$t("action.noticeSuccess"));
                this.$parent.$parent.LoadGrid();
              }
              this.options.flag = false;
              this.loading2 = false;
              // this.options.jsonP = [];
            });
          }
        } else {
          return false;
        }
      });
    },
    handleOver() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (this.loading1 == true || this.loading2 == true) {
            return false;
          } else {
            let params = {
              context: this.formData.remark,
              alarmJson: JSON.stringify(this.options.jsonP),
              status: "1",
              vehicleId: this.$route.query.vehicleId,
              plateColor:this.$route.query.plateColor,
              plateCode:this.$route.query.plateCode
            };
            this.loading3 = true;
            this.$http({
              url: this.$COMMON.baseUrl + "/alarmInfo/updateAlarmInfo",
              params: params
            }).then(data => {
              if (!data.flag && !!data.errorCode) {
                this.$message.error({
                  message: this.$t("error." + data.errorCode)
                });
                this.loading3 = false;
              } else {
                this.$message.success(this.$t("action.noticeSuccess"));
                this.$parent.$parent.LoadGrid();
              }
              this.options.flag = false;
              this.loading3 = false;
              // this.options.jsonP = [];
            });
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {},
  watch: {
    "options.flag"(newVal) {
      if (!newVal) {
        this.options.name = "";
      }
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
