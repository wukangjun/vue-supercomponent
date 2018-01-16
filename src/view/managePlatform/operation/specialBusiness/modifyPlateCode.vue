<template>
	<el-row :gutter="20">
		<el-form :model="options.modifyPlateCode" label-position="top" :rules="rules" label-width="80px" ref="modifyPlateForm"> 
			<!-- 原手机号  -->
			<el-col :span="24">
					<el-form-item label="原车牌号" prop="oldMobile">
						<el-input v-model.trim="options.modifyPlateCode.oldPlateCode" size='small' :maxlength='12' disabled="disabled"></el-input>
					</el-form-item>
			</el-col>
            <!-- 新手机号 -->
            	<el-col :span="24">
					<el-form-item label="新车牌号" prop="newPlateCode">
						<el-input v-model.trim="options.modifyPlateCode.newPlateCode" size='small' :maxlength='12'></el-input>
					</el-form-item>
			</el-col>
            <!-- 确认手机号 -->
            	<el-col :span="24">
					<el-form-item label="确认车牌号" prop="comPlateCode">
						<el-input v-model.trim="options.modifyPlateCode.comPlateCode" size='small' :maxlength='12'></el-input>
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
        newPlateCode: [
            {
            required: true,
            message: this.$t("filter.noempty"),
            trigger: "blur,change"
          },
          {
            pattern: /^[\u4e00-\u9fa5|WJ]{1}[A-Z]{1}[A-Z0-9]{5,6}$/,
            message: this.$t("filter.type6") 
          },
    
        ],
        comPlateCode: [
        {
            required: true,
            message: this.$t("filter.noempty"),
            trigger: "blur,change"
          },
          {
            pattern: /^[\u4e00-\u9fa5|WJ]{1}[A-Z]{1}[A-Z0-9]{5,6}$/,
            message: this.$t("filter.type6") 
          },     
		   {validator: this.validatePass3},
        ]
      }
    };
  },
  methods: {
	validatePass3(rule, value, callback){
        if (value === '') {
              callback(new Error('请再次输入车牌号'));
            }else if (value !== this.options.modifyPlateCode.newPlateCode) {
              callback(new Error('两次输入车牌号不一致!'));
						}
						else if(value == this.options.modifyPlateCode.oldPlateCode){
              callback(new Error('新旧号码不能相同！'));
            }  
            else {
              callback();
        }
      },
  confirm() {
	  this.$refs['modifyPlateForm'].validate(valid => {
			if (valid) {
      let params = {
        vehicleId: this.options.modifyPlateCode.vehicleId,
        enterpriseId: this.options.modifyPlateCode.enterpriseId,
        plateCodeNew:this.options.modifyPlateCode.newPlateCode
      };
      this.$http({
        url: this.$COMMON.baseUrl + "/specialBiz/modifyPlateCode",
        params: params
      }).then(data => {
        if (!data.flag && !!data.errorCode) {
          this.$message.error({ message: this.$t("error." + data.errorCode) });
        } else {
          this.$message.success("修改车牌号成功");
          this.$emit('confirm');
        }
      });

			this.options.flag = false;
				}else{
					 return false
					}})
    },
    enterpriseId(val) {
      this.options.modifyPlateCode.id = val.id;
    }
  },
  watch:{
     "options.flag"(newVal) {
      if (!newVal) {
       	this.$refs['modifyPlateForm'].resetFields();
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
