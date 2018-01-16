<template>
	<div class="vehicleType">

       <cv-header>
         <el-form-item :label="$t('UserManage.wellmadestarm')" prop="enterpriseName">
             		<cv-dropdown-tree  :placeholder="$t('common.enterprise.enterpriseName')" :interface="$COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'" :readonly="false" v-model="enterpriseName" :is-default="false" @label="searchEnterprise"></cv-dropdown-tree>
   </el-form-item>
 <el-form-item label="所属车组" prop="roleToUser">
                  <cv-dropdown-tree 
                :showCheckbox="true" 
                type="2" 
                :isCheck="true" 
                :interface="$COMMON.baseUrl + '/fleet/findFleetInfoList'"    
                :enterprise-id="enterpriseId" 
                :is-fleet="true"
                @checked="checkedT"
               ></cv-dropdown-tree>
    </el-form-item>    
       <el-form-item style='float:right;'>
               		<cv-tool 
		:name="$route.name"
    :data="$store.getters.monitorMenu"
		:is-modify="false" 
    :is-export="false"
    :is-add="true"
		@add="add" 
    @remove="remove"
    @search="search"
		></cv-tool>
    </el-form-item>
    </cv-header>
    <cv-content :fill="true">  
		<cv-grid :options="grid.options" @load="alarmConList(false)">
			<el-table border stripe :data="grid.table" v-loading="grid.loading" :minwidth="900" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
				<el-table-column :label="$t('cE.carNumbers')" prop="plateCode" width='150'  :formatter='plateCodeAndColor' :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('dm.company')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="车组名称" prop="fleetName" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="疲劳驾驶" prop="fatigueDrive" width='100' :show-overflow-tooltip="true" :formatter="driverStuas"></el-table-column>
				<el-table-column label="禁行报警" prop="forbid" :formatter="filterLStuas" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="超速报警" prop="overSpeeed"  :formatter="filterAlStuas" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="高速公路超速报警" prop="overSpeedH" width='150' :formatter="filteralarmStuas" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="三分钟超速报警" prop="tOversSpeed" width='150' :show-overflow-tooltip="true" :formatter="overStuas"></el-table-column>
        <el-table-column label="三分钟超速高速报警" prop="tOverSpeedH" width='200' :show-overflow-tooltip="true" :formatter="overHStuas"></el-table-column>
				<el-table-column :label="$t('action.operation')" width='100'>
					<template scope="scope">
						<div class="cv-table-tool">
                <cv-span type="success" @click.native="modify(scope)">{{$t('power.modify')}}</cv-span>
						    <cv-span type="danger"  @click.native="removeCar(scope)">{{$t('power.remove')}}</cv-span>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</cv-grid>
		<!-- 一级弹框 -->
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="alarmConList(true)"></component>	
		</el-dialog>
        </cv-content>
	</div>
</template>
<script>
import add from "./add.vue";
import modify from "./modify";
import common from "@/utils/mixins/common";
import { http, service } from "@/utils";
export default {
  components: {
    modify,
    add
  },
  mixins: [common],
  data() {
    return {
      allRemove: false,
      treeData: [],
      vehicleIds: "",
      multiple: [],
      carIds: [],
      grid: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        table: [],
        loading: false
      },
      fleetList: [],
      enterpriseId: "",
      enterpriseName: "",
      id: "",
      fleetIds: "",
      isLogout: "",
      useStatus: "",
      onlineStatus: "",
      dialog: {
        childTreeData: [],
        title: "--",
        flag: false,
        name: "add",
        size: "dialog-full",
        id: "",
        entId: "",
        delte: "",
        modify: {
          vehicleIds: "",
          forbid: "",
          fatigueDrive: "",
          toversSpeed: "",
          overSpeed: "",
          overSpeedH: "",
          toverSpeedH: "",
          enterpriseId: ""
        }
      }
    };
  },
  methods: {
    checkedT(val) {
      this.fleetList = val;
    },
  searchEnterprise({ id, enterpriseCode }) {
    if(id){
      this.enterpriseId = id;
    }else{
      this.enterpriseId = "";
    }
      
    },
    alarmConList(flag) {
      if (flag) {
        this.grid.options.flag = true;
        this.grid.options.current = 1;
      } else {
        this.grid.options.flag = false;
      }
      let params = {
        current: this.grid.options.current,
        size: this.grid.options.size,
        fleetIds: this.fleetIds,
        enterpriseId: this.enterpriseId
      };
      this.grid.loading = true;
      this.$http({
        url: this.$COMMON.baseUrl + "/platFormAlarm/queryPaltFormConfigByPage",
        params: params
      })
        .then(data => {
          if (data.flag) {
            if (data.data.length != 0) {
              this.grid.table = data.data.records;
              this.grid.options.total = data.data.total;
            } else {
              this.grid.table = [];
              this.grid.options.total = 0;
            }
          } else {
            this.grid.table = [];
            this.grid.options.total = 0;
          }
          this.grid.loading = false;
        })
        .catch(_ => {
          this.grid.loading = false;
        });
    },
    plateCodeAndColor(row) {
      return (
        row.plateCode + "(" + this.$filter.plateCodeColor(row.plateColor) + ")"
      );
    },
    driverStuas(row) {
      return this.$filter.alarmStatus(row.fatigueDrive);
    },
    overStuas(row) {
      return this.$filter.alarmStatus(row.tOversSpeed);
    },
    overHStuas(row) {
      return this.$filter.alarmStatus(row.tOverSpeedH);
    },

    filterAlStuas(row) {
      return this.$filter.alarmStatus(row.overSpeed);
    },
    filteralarmStuas(row) {
      return this.$filter.alarmStatus(row.overSpeedH);
    },
    filterLStuas(row) {
      return this.$filter.alarmStatus(row.forbid);
    },
    add(val) {
      this.dialog.flag = true;
      this.dialog.size = "dialog-large";
      this.dialog.name = val.name;
      this.dialog.title = "报警配置新增";
    },
    search() {
      this.alarmConList(true);
    },
    modify(scope) {
      this.dialog.flag = true;
      this.dialog.modify.vehicleIds = scope.row.vehicleId;
      this.dialog.modify.enterpriseId = scope.row.enterpriseId;
      this.dialog.modify.fatigueDrive = scope.row.fatigueDrive;
      this.dialog.modify.toversSpeed = scope.row.tOversSpeed;
      this.dialog.modify.toverSpeedH = scope.row.tOverSpeedH;
      this.dialog.modify.forbid = scope.row.forbid;
      this.dialog.modify.overSpeed = scope.row.overSpeed;
      this.dialog.modify.overSpeedH = scope.row.overSpeedH;
      this.dialog.title = this.$t("power.modify");
      this.dialog.name = "modify";
      this.dialog.size = "dialog-small";
    },
    //单车信息删除情况
    removeCar(scope) {
      this.confirmPrompt().then(() => {
        let params = {
          vehicleIds: scope.row.vehicleId
        };
        this.$http({
          url: this.$COMMON.baseUrl + "/platFormAlarm/delPlatFormConfig",
          params: params
        }).then(data => {
          if (data.flag) {
            this.$message.success(this.$t("action.removeSuccess"));
            this.alarmConList();
          } else {
            this.$message.error(this.$t("error." + data.errorCode));
          }
        });
      });
    },
    //全选删除时分两种情况 一没勾选车辆时删除是弹出删除框 勾选之后就是列表数据的删除
    remove() {
      //没勾选项时弹出删除框
      if (this.carIds == []) {
        this.dialog.flag = true;
        this.dialog.size = "dialog-large";
        this.dialog.name = "add";
        this.dialog.title = "报警配置删除";
      } else {
        this.confirmPrompt().then(() => {
          let params = {
            vehicleIds: this.vehicleIds
          };
          this.$http({
            url: this.$COMMON.baseUrl + "/platFormAlarm/delPlatFormConfig",
            params: params
          }).then(data => {
            if (data.flag) {
              this.$message.success(this.$t("action.removeSuccess"));
              this.alarmConList();
            } else {
              this.$message.error(this.$t("error." + data.errorCode));
            }
          });
        });
      }
    },
    handleSelectionChange(val) {
      this.multiple = val;
    },
    loadTree() {
      this.$store.dispatch("queryCompanyInfoList").then(data => {
        if (!data.flag && !!data.errorCode) {
          this.$message.error({ message: this.$t("error." + data.errorCode) });
        } else {
          this.treeData = data.data;
          this.dialog.childTreeData = data.data;
        }
      });
    }
  },
  mounted() {
    this.loadTree();
    this.alarmConList();
    
  },
  watch: {
    multiple(newVal) {
      this.carIds = [];
      newVal.forEach(val => {
        this.carIds.push(val.vehicleId);
      });
      this.vehicleIds = this.carIds.join(",");
    },
    'fleetList'(newVal) {
      if (newVal != []) {
        this.fleetIds = this.$service.isContext(
          this.fleetList.join(",")
        )
          ? null
          : this.fleetList.join(",");
      }
    }
  },

};
</script>

<style lang="scss">
label {
  font-size: 14px ;
}
</style>