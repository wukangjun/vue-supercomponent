<template>
	<el-form label-width="200px"  :rules="rules" ref="ruleForm" :model="formData" class="intrusion-status">
	<el-form-item label="信号量"  size="small">
		 <span>名称</span>
	</el-form-item>
	 <el-form-item label="D7:"  size="small">
		 <span>制动</span>
	</el-form-item>
	 <el-form-item label="D6:"  size="small">
		 <span>左转向</span>
	</el-form-item>
	 <el-form-item label="D5:"  size="small">
		 <span>右转向</span>
	</el-form-item>
	 <el-form-item label="D4:"  size="small">
		 <span>远光</span>
	</el-form-item>
	 <el-form-item label="D3:"  size="small">
		 <span>近光</span>
	</el-form-item>
	 <el-form-item label="D2:" prop="three">
			  <el-input v-model="formData.three" placeholder="" style="width:330px" size="small"></el-input>
	</el-form-item>
	 <el-form-item label="D1:" prop="two">
			  <el-input v-model="formData.two" placeholder="" style="width:330px" size="small"></el-input>
	</el-form-item>
	 <el-form-item label="D0:" prop="one">
			  <el-input v-model="formData.one" placeholder="" style="width:330px" size="small"></el-input>
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
        one: "",
        two: "",
        three: ""
      },
      rules: {
        one: [
          {
            required: true,
            message: this.$t("filter.noempty"),
            trigger: "blur,change"
          },
          {
            pattern: /^[\u4E00-\u9FA5]{1,5}$/,
            message: this.$t("filter.characters")
          }
        ],

        two: [
          {
            required: true,
            message: this.$t("filter.noempty"),
            trigger: "blur,change"
          },
          {
            pattern: /^[\u4E00-\u9FA5]{1,5}$/,
            message: this.$t("filter.characters")
          }
        ],
        three: [
          {
            required: true,
            message: this.$t("filter.noempty"),
            trigger: "blur,change"
          },
          {
            pattern: /^[\u4E00-\u9FA5]{1,5}$/,
            message: this.$t("filter.characters")
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
            d0: this.formData.one,
            d1: this.formData.two,
            d2: this.formData.three,
            d3: "近光",
            d4: "远光",
            d5: "右转向",
            d6: "左转向",
            d7: "制动"
          };
          this.loading = true;
          publicApi({
            url: "/grapherOrderSend/setStautsConfigure",
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
