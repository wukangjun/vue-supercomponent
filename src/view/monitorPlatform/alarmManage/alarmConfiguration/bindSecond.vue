<template>
	<div class="bindSecond">
		<el-row :gutter="20">
			<el-form label-position="top"  :model="form" ref="options.modify">
					<el-col :span="8">
					<el-form-item label="疲劳驾驶报警" prop="title">
  <el-switch
    v-model="fatigueDrive"
    on-color="#13ce66"
    off-color="#ff4949"
    on-value="1"
    off-value="0">
  </el-switch>
			</el-form-item>
				</el-col>	
				<el-col :span="8">
					<el-form-item label="禁行报警" prop="href">
  <el-switch
    v-model="forbid"
    on-color="#13ce66"
    off-color="#ff4949"
    on-value="1"
    off-value="0">
  </el-switch>
</el-form-item>
</el-col>
				<el-col :span="8">
					<el-form-item label="超速报警" prop="href">
  <el-switch
    v-model="overSpeed"
    on-color="#13ce66"
    off-color="#ff4949"
    on-value="1"
    off-value="0">
  </el-switch>
</el-form-item>
</el-col>
				<el-col :span="8">
					<el-form-item label="高速公路超速报警" prop="href">
  <el-switch
    v-model="overSpeedH"
    on-color="#13ce66"
    off-color="#ff4949"
    on-value="1"
    off-value="0">
  </el-switch>
</el-form-item>
</el-col>
				<el-col :span="8">
					<el-form-item label="三分钟超速报警" prop="href">
  <el-switch
    v-model="toversSpeed"
    on-color="#13ce66"
    off-color="#ff4949"
    on-value="1"
    off-value="0">
  </el-switch>
</el-form-item>
</el-col>
				<el-col :span="8">
					<el-form-item label="三分钟高速公路超速报警" prop="href">
  <el-switch
    v-model="toverSpeedH"
    on-color="#13ce66"
    off-color="#ff4949"
    on-value="1"
    off-value="0">
  </el-switch>
</el-form-item>
</el-col>
			</el-form>
			<el-col :span="24" class="dialog-footer">
	    <el-button type="primary" @click="cancel()" class="confirm">上一步</el-button>
				<el-button @click="confirm()">{{'确认'}}</el-button>
			</el-col>
		</el-row>
	</div>
</template>

<script>
export default {
  props: {
    data: {}
  },
  data() {
    return {
      form: {},
      //禁行报警
      forbid: "",
      //疲劳驾驶
      fatigueDrive: "",
      //三分钟超速报警
      toversSpeed: "",
      //超速报警
      overSpeed: "",
      //高速公路超速报警
      overSpeedH: "",
      //三分钟高速超速报警
      toverSpeedH: ""
    };
  },
  methods: {
    //返回上一步
    cancel() {
      this.data.btnClick = false;
      this.data.active = 1;
    },

    confirm(scope) {
      this.$refs["options.modify"].validate(valid => {
        if (valid) {
          let params = {
            forbid: this.forbid,
            fatigueDrive: this.fatigueDrive,
            tOversSpeed: this.toversSpeed,
            overSpeed: this.overSpeed,
            overSpeedH: this.overSpeedH,
            tOverSpeedH: this.toverSpeedH,
            //创建时间 当前时间戳
            recordTime: this.$filter.format(
              new Date().getTime(),
              "yyyy-MM-dd HH:mm:ss"
            ),
            enterpriseId: this.data.enterpriseId,
            vehicleIds: this.data.vehicleIds
          };
          this.$http({
            url: this.$COMMON.baseUrl + "/platFormAlarm/insertPlatFormConfig",
            params: params
          }).then(data => {
            if (!data.flag && !!data.errorCode) {
              this.$message.error({
                message: this.$t("error." + data.errorCode)
              });
            } else {
              let _self = this;
              let pat=_self.$parent.$parent.$parent.$parent.$parent;
              pat.dialog.flag = false;
              pat.alarmConList();
              this.$message.success(this.$t("action.addSuccess"));
            }
          });
        }
      });
    },
    showIconName(val) {
      this.modify.icon = val;
    },
    //获取权限
    power() {
      this.$store.dispatch("findAllAction").then(data => {
        this.menuPower = data.data;
        this.cities = this.menuPower;
      });
    },
    handleCheckAllChange(event) {
      let arr = [];
      this.cities.forEach(data => {
        arr.push(parseInt(data.id));
      });
      this.checkedCities = event.target.checked ? arr : [];
      this.isIndeterminate = false;
    },
    handleCheckedPowerChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    }
  },
  mounted() {},
  watch: {
    "data.vehicleIds"(newVal) {}
  }
};
</script>
<style lang="scss">
.bindSecond {
  .el-input-number__decrease {
    top: 2px;
  }
  .el-input-number__increase {
    top: 2px;
  }
  .el-checkbox {
    margin: 0 20px 10px 0;
  }
  .el-checkbox-group {
    padding: 0 10px;
  }
}
</style>
