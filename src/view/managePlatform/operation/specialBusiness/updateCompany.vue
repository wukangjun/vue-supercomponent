<template>
	<el-row :gutter="20">
		<el-form :model="options.updateCompany" label-position="top" :rules="rules" label-width="80px" ref="updateCompanyForm"> 
			<!-- 原公司及车组  -->
			<el-col :span="12">
					<el-form-item label="原公司及车组" prop="oldEnterpriseName">
						<el-input v-model.trim="options.updateCompany.enterpriseName" size='small' :maxlength='12' disabled="disabled"></el-input>
					</el-form-item>
			</el-col>
			<!-- 车牌号码  -->
			<el-col :span="12">
				<el-form-item :label="$t('cE.carNumber')" prop="plateCode">
					<el-input v-model.trim="options.updateCompany.plateCode" size='small' :maxlength='10' disabled="disabled"></el-input>
				</el-form-item>
			</el-col>
			<!-- 新公司 -->
			<el-col :span="12">
				<el-form-item label="新公司" prop="enterpriseName">
					<cv-dropdown-tree 
					:placeholder="$t('common.enterprise.affiliated')"
					:interface=" $COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'"
					:is-default="false" 
					v-model="enterpriseName"
					@label="enterpriseId"></cv-dropdown-tree>
            <span style="color:red;font-size:8px" v-show="showEnterpriseName">请选择公司</span>
				</el-form-item>
			</el-col>
			<!-- 新车辆分组  -->
			<el-col :span="12">
					<el-form-item :label="$t('cL.subGroup')" prop="fleetName">
						<cv-dropdown-tree  :interface="$COMMON.baseUrl + '/fleet/findFleetInfoList'" 
						:is-default="false" 
						 v-model="fleetName" 
						:enterprise-id="updateData.enterpriseId"
            :is-fleet="true"
						 @label="vehicleIdCall"></cv-dropdown-tree>
             <span style="color:red;font-size:8px" v-show="showFleet">请选择车组</span>
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
// import common from "@/utils/mixins/common";
import { COMMON } from "@/utils";
export default {
  props: {
    options: {}
  },
  // mixins: [common],
  data() {
    return {
      showEnterpriseName: false,
      showFleet: false,
      fleetName: "",
      enterpriseName: "",
      updateData: {
        enterpriseName: "",
        plateCode: "",
        fleetId: "",
        enterpriseId: ""
      },
      rules: {
        // fleetName: [
        //   {
        //     required: true,
        //     message: this.$t("filter.noempty"),
        //     trigger: "blur,change"
        //   }
        // ],
        // enterpriseName: [
        //   {
        //     required: true,
        //     message: this.$t("filter.noempty"),
        //     trigger: "blur,change"
        //   }
        // ]
      }
    };
  },
  methods: {
    confirm() {
      // this.$refs["updateCompanyForm"].validate(valid => {
      //   if (valid) {
      let params = {
        enterpriseId: this.options.updateCompany.enterpriseId,
        vehicleId: this.options.updateCompany.vehicleId,
        fleetId: this.options.updateCompany.fleetId,
        enterpriseIdNew: this.updateData.enterpriseId,
        fleetIdNew: this.updateData.fleetId
      };
      if (this.enterpriseName == "") {
        this.showEnterpriseName = true;
        return false;
      } else {
        this.showEnterpriseName = false;
      }
      if (this.fleetName == "") {
        this.showFleet = true;
        return false;
      } else {
        this.showFleet = false;
      }
      this.$http({
        url: this.$COMMON.baseUrl + "/specialBiz/modifyEnterprise",
        params: params
      }).then(data => {
        if (!data.flag && !!data.errorCode) {
          this.$message.error({
            message: this.$t("error." + data.errorCode)
          });
        } else {
          this.$message.success("修改公司成功");
          this.$emit("confirm");
        }
      });
      this.options.flag = false;
      //   } else {
      //     return false;
      //   }
      // });
    },
    enterpriseId(val) {
      if (val.id != "empty") {
        this.updateData.enterpriseId = val.id;
      } else {
        this.updateData.enterpriseId = "";
      }
    },
    // 车辆信息回调
    vehicleIdCall(val) {
      if (val.id != "empty") {
        this.updateData.fleetId = val.id;
      } else {
        this.updateData.fleetId = "";
      }
    }
  },
  mounted() {},
  watch: {
    "options.flag"(newVal) {
      if (newVal) {
        this.showEnterpriseName = false;
        this.showFleet = false;
        this.enterpriseName = "";
        this.fleetName = "";
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
