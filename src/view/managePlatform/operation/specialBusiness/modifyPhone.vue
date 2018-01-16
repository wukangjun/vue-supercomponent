<template>
	<el-row :gutter="20">
		<el-form :model="options.modifyPhone" label-position="top" :rules="rules" label-width="80px" ref="modifyPhoneForm"> 
			<!-- 原手机号  -->
			<el-col :span="24">
					<el-form-item label="原SIM卡号" prop="oldMobile">
						<el-input v-model.trim="options.modifyPhone.oldPhoneNumber" size='small' :maxlength='12' disabled="disabled"></el-input>
					</el-form-item>
			</el-col>
            <!-- 新手机号 -->
            	<el-col :span="24">
					<el-form-item label="新SIM卡号" prop="newPhoneNumber">
						<el-input v-model.trim="options.modifyPhone.newPhoneNumber" size='small' :maxlength='12'></el-input>
					</el-form-item>
			</el-col>
            <!-- 确认手机号 -->
            	<el-col :span="24">
					<el-form-item label="确认SIM卡号" prop="comPhoneNumber">
						<el-input v-model.trim="options.modifyPhone.comPhoneNumber" size='small' :maxlength='12'></el-input>
					</el-form-item>
			</el-col>

		</el-form>
		<el-col :span="24">
		<div class="dialog-footer">
			<el-button type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</div>
		</el-col>
	</el-row>
</template>
<script>
import { COMMON } from "@/utils";
export default {
  props: {
    options: {}
  },
  data() {
    return {
      rules: {
        newPhoneNumber: [
          {
            required: true,
            message: this.$t("filter.noempty"),
            trigger: "blur,change"
          },
          { pattern: /^[0-9]+$/, message: this.$t("filter.type2") },
          {
            min: 12,
            max: 12,
            message: this.$filter.lanReplace(this.$t("filter.FixedLength"), {
              len: 12
            })
          }
          // { validator: this.validatePass},
        ],
        comPhoneNumber: [
          {
            required: true,
            message: this.$t("filter.noempty"),
            trigger: "blur,change"
          },
          { pattern: /^[0-9]+$/, message: this.$t("filter.type2") },
          {
            min: 12,
            max: 12,
            message: this.$filter.lanReplace(this.$t("filter.FixedLength"), {
              len: 12
            })
          },
          { validator: this.validatePass2 }
        ]
      }
    };
  },
  methods: {
    validatePass2(rule, value, callback) {
      if (value === "") {
        callback(new Error("请再次输入手机号"));
      } else if (value !== this.options.modifyPhone.newPhoneNumber) {
        callback(new Error("两次输入号码不一致!"));
      } else if (value == this.options.modifyPhone.oldPhoneNumber) {
        callback(new Error("新旧号码不能相同！"));
      } else {
        callback();
      }
    },
    confirm() {
      this.$refs["modifyPhoneForm"].validate(valid => {
        if (valid) {
          let params = {
            vehicleId: this.options.modifyPhone.vehicleId,
            simNew: this.options.modifyPhone.newPhoneNumber
          };
          this.$http({
            url: this.$COMMON.baseUrl + "/specialBiz/modifySim",
            params: params
          }).then(data => {
            if (!data.flag && !!data.errorCode) {
              this.$message.error({
                message: this.$t("error." + data.errorCode)
              });
            } else {
              this.$emit("confirm");
              this.$message.success("修改手机号成功");
              
            }
          });

          this.options.flag = false;
        } else {
          return false;
        }
      });
    },
    enterpriseId(val) {
      this.options.modifyPhone.id = val.id;
    }
  },
  watch: {
    "options.flag"(newVal) {
      if (!newVal) {
       	this.$refs['modifyPhoneForm'].resetFields();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.code {
  width: 270px;
}
</style>
