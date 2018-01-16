<template>
<div class="alarmfig">
  <el-row :gutter="20">
    <el-form label-position="top" :model="options.modify" ref="options.modify">
      <el-col :span="8">
        <el-form-item label="疲劳驾驶报警" prop="title">
          <el-switch v-model="fatigueDrive" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0">
          </el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="禁行报警" prop="href">
          <el-switch v-model="forbid" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0">
          </el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="超速报警" prop="href">
          <el-switch v-model="overSpeed" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0">
          </el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="高速公路超速报警" prop="href">
          <el-switch v-model="overSpeedH" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0">
          </el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="三分钟超速报警" prop="href">
          <el-switch v-model="toversSpeed" on-color="#13ce66" off-color="#ff4949" on-value='1' off-value='0'>
          </el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="三分钟高速公路超速报警" prop="href">
          <el-switch v-model="toverSpeedH" on-color="#13ce66" off-color="#ff4949" on-value='1' off-value='0'>
          </el-switch>
        </el-form-item>
      </el-col>
    </el-form>
    <el-col :span="24" class="dialog-footer">
      <el-button :loading="loading" type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
      <el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
    </el-col>
  </el-row>
</div>
</template>
<script>
export default {
  props: {
    options: {}
  },
  data() {
    return {
      loading: false,
      //禁行报警
      forbid: "0",
      //疲劳驾驶
      fatigueDrive: "0",
      //三分钟超速报警
      toversSpeed: "0",
      //超速报警
      overSpeed: "0",
      //高速公路超速报警
      overSpeedH: "0",
      //三分钟高速超速报警
      toverSpeedH: "0"
    };
  },
  methods: {
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
            enterpriseId: this.options.modify.enterpriseId,
            vehicleIds: this.options.modify.vehicleIds,
            //创建时间
            recordTime: this.$filter.format(
              new Date().getTime(),
              "yyyy-MM-dd HH:mm:ss"
            )
          };
          this.loading = true;
          this.$http({
            url: this.$COMMON.baseUrl + "/platFormAlarm/insertPlatFormConfig",
            params: params
          }).then(data => {
            if (!data.flag && !!data.errorCode) {
              this.$message.error({
                message: this.$t("error." + data.errorCode)
              });
            } else {
              this.options.flag = false;
              this.$emit("confirm");
              // this.$notify.success(this.$t('action.modifySuccess'));
              this.$message.success(this.$t("action.modifySuccess"));
              this.loading = false;
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
  mounted() {
    (this.forbid = this.options.modify.forbid),
    (this.fatigueDrive = this.options.modify.fatigueDrive),
    (this.toversSpeed = this.options.modify.toversSpeed),
    (this.overSpeed = this.options.modify.overSpeed),
    (this.overSpeedH = this.options.modify.overSpeedH),
    (this.toverSpeedH = this.options.modify.toverSpeedH);
  },
  watch: {
    "options.flag" (newVal) {
      if (!newVal) {
        this.options.name = "";
      }
    }
  }
};
</script>
<style lang="scss">
.alarmfig {
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
