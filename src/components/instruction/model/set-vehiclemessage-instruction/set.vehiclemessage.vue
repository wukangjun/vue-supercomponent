<template>
		<el-form label-width="150px"  :rules="rules" ref="ruleForm" :model="formData">
		  <el-form-item label="车辆识别码(VPN):" prop="plateVpn">
			    <el-input v-model="formData.plateVpn" placeholder="" style="width:330px" size="small"></el-input>
		  </el-form-item>
		  <el-form-item label="车牌号码:" prop="plateCode">
			  <el-input v-model="formData.plateCode" placeholder="" style="width:330px" size="small"></el-input>
		  </el-form-item>
		<el-form-item label="车牌号码分类:" prop="plateType">
			    <el-select  v-model="formData.plateType" size='small' style="width:330px">
                        <el-option v-for="list in recordList" :key="list.id" :value='list.name' :label="list.name"></el-option>
                    </el-select>
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
        plateVpn: "",
        plateCode: "",
        plateType: "大型汽车"
      },
      recordList: [
        { id: "0", name: "大型汽车" },
        { id: "1", name: "挂车" },
        { id: "2", name: "小型汽车" },
        { id: "3", name: "使馆汽车" },
        { id: "4", name: "领馆汽车" },
        { id: "5", name: "港澳入出境车" },
        { id: "6", name: "教练汽车" },
        { id: "7", name: "警用汽车" },
        { id: "8", name: "普通摩托车" },
        { id: "9", name: "轻便摩托车" },
        { id: "10", name: "使馆摩托车" },
        { id: "11", name: "领馆摩托车" },
        { id: "12", name: "教练摩托车" },
        { id: "13", name: "警用摩托车" },
        { id: "14", name: "低速车" },
        { id: "15", name: "临时行驶车" },
        { id: "16", name: "临时入境汽车" },
        { id: "17", name: "临时入境摩托车" },
        { id: "18", name: "拖拉机" },
        { id: "19", name: "其他" }
      ],
      rules: {
        plateVpn: [
          {
            required: true,
            message: this.$t("filter.noempty"),
            trigger: "blur,change"
          },
          { pattern: /^[A-za-z0-9]+$/, message: this.$t("filter.type9") },

          {
            min: 17,
            max: 17,
            message: this.$filter.lanReplace(this.$t("filter.FixedLength"), {
              len: 17
            })
          }
        ],
        plateCode: [
          {
            required: true,
            message: this.$t("filter.noempty"),
            trigger: "blur,change"
          },
          {
            pattern: /^[\u4e00-\u9fa5|WJ]{1}[A-Z]{1}[A-Z0-9]{5,6}$/,
            message: this.$t("filter.type6")
          },
          {
            validator: this.plateCode,
            trigger: "blur"
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
            vin: this.formData.plateVpn,
            plateCodeSet:this.formData.plateCode,
            plateType: this.formData.plateType
          };
          this.loading = true;
          publicApi({
            url: "/grapherOrderSend/setVehicleInfo",
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
  mounted(){  
    console.log(JSON.stringify(this.options)+'-----')
  },
  watch: {}
};
</script>
<style lang="scss" scoped>

</style>
