<template>
<div class="instruction-monitor">
	<!-- tab页签 -->
	<el-tabs class="tabClass" v-model="tabActiveName">
		<!-- tab内容 -->
		<el-tab-pane :label="$t('监听设置')" name="baseInfo">
			<el-form ref="monitorForm" :model="formData"  label-width="80px" size="mini" :rules="rules">
				<el-form-item label="电话号码" prop="phone">
					<el-input v-model="formData.phone" size="small" style="width:200px;" readonly @click.native="selectPhone"></el-input>
				</el-form-item>
				<el-form-item label="监听模式">
					<el-radio-group style="width:200px;" v-model="radioS">
						<el-radio :label="0">对讲模式</el-radio>
						<el-radio :label="1">监听模式</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
		</el-tab-pane>
		<!-- tab内容 -->
		<el-tab-pane :label="$t('电话本')" name="phoneList">
			<!-- 表格 -->
			<cv-grid class="" :options="grid.options" @load="gridLoad">
				<el-table border stripe :data="grid.table" v-loading="grid.loading" height="180" @row-click="rowClick">
					<el-table-column :label="$t('联系人')" prop="contactName" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column :label="$t('电话号码')" prop="phoneNumber" :show-overflow-tooltip="true"></el-table-column>
				</el-table>
			</cv-grid>
		</el-tab-pane>
	</el-tabs>
	<div class='dialog-footer' v-if="tabActiveName == 'baseInfo'">
		<el-button type="primary" @click="confirm">{{ $t('action.confirm') }}</el-button>
		<el-button @click="options.flag=false">{{ $t('action.cancel') }}</el-button>
	</div>
</div>
</template>

<script>
import { publicApi, instructCallback } from "../../src/instruction.public.api";
export default {
  props: {
    options: {}
  },
  data() {
    return {
	  formData:{
	  	phone: "",
	  },
      tabActiveName: "baseInfo",
      radioS: 0,
      grid: {
        options: {
          current: 1,
          size: 10,
          total: 10,
          flag: false
        },
        table: [],
        loading: false
      },
      rules: {
        phone: [
          {
            required: true,
            message: this.$t("filter.notEmpty"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //点击电话号码选择电话
    selectPhone() {
      this.tabActiveName = "phoneList";
    },
    confirm() {
      this.grid.loading=true;
      this.$refs["monitorForm"].validate(valid => {
        if (valid) {
		 	publicApi({
				url: "/sendOrder/monitor",
				params: {
          vehicleId: this.options.id,
          enterpriseId:this.options.enterpriseId,
					callNumber:this.formData.phone,
					isMonitor:this.radioS
				}
			}).then(data=>{
        instructCallback(data, this.options);
        this.grid.loading=false;
			})	
        } else {
          return false;
        }
      });
    },
    rowClick(val) {
      this.formData.phone = val.phoneNumber;
      this.tabActiveName = "baseInfo";
    },
    async gridLoad(isSearch) {
      if (isSearch) {
        this.grid.options.flag = true;
        this.grid.options.current = 1;
      } else {
        this.grid.options.flag = false;
      }
      const { data, flag } = await this.$http({
        url: this.$COMMON.baseUrl + "/phonebook/getPhonebookPage",
        params: {
          current: this.grid.options.current,
          size: this.grid.options.size
        }
      });
      if (flag && data.length != 0) {
        this.grid.table = data.records;
        this.grid.options.total = data.total;
      } else {
        this.grid.table = [];
        this.grid.options.total = 0;
      }
    }
  },
  mounted() {
    this.gridLoad(true);
  }
};
</script>

<style lang="scss">
.instruction-monitor {
  .tabClass {
    .el-tabs__content {
      height: 200px;
      .el-form {
        width: 300px;
        margin: 0 auto;
      }
      .el-table__body-wrapper {
        cursor: pointer;
      }
    }
  }
  .dialog-footer {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
</style>
