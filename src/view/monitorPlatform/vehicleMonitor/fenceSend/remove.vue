
<template>
   <div>
	<p style="margin-bottom:20px;">请选择你要批量删除的围栏类型</p>   
 <el-radio-group v-model="radio2" style="margin-bottom:20px;">
    	<el-radio  label="1">{{'圆形围栏'}}</el-radio >
    	<el-radio  label="2">{{'矩形围栏'}}</el-radio >
   		<el-radio  label="3">{{'多边形围栏'}}</el-radio >
    	<el-radio  label="4">{{'线形围栏'}}</el-radio >
      <el-radio  label="5">{{'渣土区域围栏'}}</el-radio >  
  		</el-radio-group>
		<div class='dialog-footer'>
			<el-button :loading="loading" type="primary"  @click="save" >{{ $t('action.confirm') }}</el-button>
			<el-button @click='options.flag=false' >{{ $t('action.cancel') }}</el-button>
		</div>
</div>
</template>
<script>
import port from "./index.js";
export default {
  mixins: [port],
  props: {
    options: {}
  },
  data() {
    return {
      radio2: "",
      loading: false,
      polyType: "",
      radio: ""
    };
  },
  methods: {
    //新增
    save() {
      let params = {
        vehicleId: this.options.vid,
        polygonType: this.polyType
      };
      params.type = this.radio;
      this.loading = true;
      this.delAllFenceByType(params)
        .then(data => {
          this.loading = false;
          if (data.flag) {
            this.$message.success(this.$t("action.removeSuccess"));
            this.$emit("confirm");
            this.options.flag = false;
          } else {
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    }
  },
  watch: {
    //监听弹框是否打开
    "options.flag"(newVal) {
      if (!newVal) {
        this.options.name = "";
      }
    },
    radio2(newVal) {
      if (newVal == 3) {
        this.radio = newVal;
        this.polyType = "101";
      } else if (newVal == 5) {
        this.radio = 3;
        this.polyType = "103";
      } else {
        this.radio = newVal;
        this.polyType = "";
      }
    }
  }
};
</script>
<style lang='scss' scoped>

</style>