<template>
	<el-row :gutter="20">
		<el-form :model="options.bind" label-position="top" :rules="rules" label-width="80px" ref="bindForm"> 
            <!-- 新公司 -->
			<el-col :span="24">
				<el-form-item label="新公司" prop="enterpriseName">
					<cv-dropdown-tree 
					:placeholder="$t('common.enterprise.affiliated')"
					:interface=" $COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'"
          :is-default="true"
					v-model="options.bind.enterpriseName"
					@label="enterpriseBind"></cv-dropdown-tree>
				</el-form-item>
			</el-col>
			<!-- 车牌号码  -->
			<!-- <el-col :span="24"> -->
  
				<!-- <el-form-item :label="$t('cE.carNumber')" prop="plateCode"> -->
					<!-- <el-input v-model.trim="options.bind.plateCode" size='small' :maxlength='10' type="textarea"></el-input> -->
                    <!-- <el-input v-model.trim="options.bind.plateCode" size='small' :maxlength='10' type="textarea">
                    </el-input> -->
    
				<!-- </el-form-item> -->
			<!-- </el-col> -->
			<!-- 新车辆分组  -->
			<el-col :span="24">
					<el-form-item :label="$t('cL.subGroup')" prop="fleetName">
						<cv-dropdown-tree v-model="bindData.fleetName" :interface="$COMMON.baseUrl + '/fleet/findFleetInfoList'" :is-default="false" :enterprise-id="bindData.enterpriseId" @label="vehicleIdBind" :is-fleet="true"></cv-dropdown-tree>
					</el-form-item>
			</el-col>
		</el-form>
    <!-- 车牌号 -->
    	<el-col :span="24" style="height:100px">
       
        <p style="text-algin:left;margin-bottom:10px">车牌号</p>
         <div style="width:100%;height:50px;overflow-y:auto;border:1px solid rgb(191, 203, 217);border-radius:3px;">
      <ul>
        <li v-for="tab in options.bind.codeS" :key="tab.index" style="display:inline;margin-left:3px">
                {{ tab.plateCode}}
            </li>
      </ul>
      </div>
    	</el-col>
		<el-col :span="24">
		<div class="dialog-footer">
			<el-button type="primary" @click="confirm">{{$t('action.confirm')}}</el-button>
			<el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
		</div>
		</el-col>
	</el-row>
</template>

<script>
import common from "@/utils/mixins/common";
import { COMMON } from "@/utils";
export default {
  props: {
    options: {}
  },
  mixins: [common],
  data() {
    return {
      art: this.options.bind.vehicleIds,
      bindData: {
        fleetId: "",
        fleetName: "",
        enterpriseId: ""
      },
      rules: {
        // terminalCode: [
        //   {
        //     pattern: /^[A-Z0-9]+$/,
        //     message: this.$t("filter.type7"),
        //     trigger: "blur,change"
        //   }
        // ],
        // plateCode: [
        //   {
        //     pattern: /^[\u4e00-\u9fa5|WJ]|[A-Za-z]|[0-9]+$/,
        //     message: this.$t("filter.type6"),
        //     trigger: "blur,change"
        //   }
        // ]
      }
    };
  },
  methods: {
    confirm() {
      let params = {
        vehicleIds: this.art.join(","),
        enterpriseIdNew: this.bindData.enterpriseId,
        fleetIdNew: this.bindData.fleetId
      };
      this.$http({
        url: this.$COMMON.baseUrl + "/specialBiz/bindFleet",
        params: params
      }).then(data => {
        if (!data.flag && !!data.errorCode) {
          this.$message.error({ message: this.$t("error." + data.errorCode) });
        } else {
          this.$message.success("修改车组绑定成功");
          this.$emit('confirm');
        }
      });

      this.options.flag = false;
    },
    enterpriseBind(val) {
      if(val.id!='empty'){
        this.bindData.enterpriseId = val.id;
      }else{
        this.bindData.enterpriseId='';
      }
    },
    // 车辆信息回调
    vehicleIdBind(val) {
      if(val.id!='empty'){
        this.bindData.fleetId = val.id;
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
