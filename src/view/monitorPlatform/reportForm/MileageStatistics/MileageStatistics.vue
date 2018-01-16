<template>
    <div class="MileageStatistics">
        <cv-header>
          <el-form-item label="起止时间">
                <el-date-picker v-model="SEtime" size="small" :clearable="true" :editable='false' type="daterange" placeholder="选择时间范围" :picker-options="pickerOption" style="width:220px">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="车牌号" v-show='tabShow'>
                <el-input v-model.trim="plateCode" size="small" style="width:150px;"></el-input>
            </el-form-item>
            <el-form-item label="所属公司" v-show='tabShow'>
             		<cv-dropdown-tree  :placeholder="$t('common.enterprise.enterpriseName')" :interface="$COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'" :readonly="false" v-model="company" :is-default="false" @label="label"></cv-dropdown-tree>
            </el-form-item>
            <el-form-item label="所属车队" v-show='tabShow'>
               <cv-dropdown-tree v-model.trim="fleetName" :is-fleet="true" :interface="$COMMON.baseUrl + '/fleet/findFleetInfoList'" :is-default="false"  :enterprise-id="enterpriseId" @label="vehicleIdCall"></cv-dropdown-tree>
            </el-form-item>
            <el-form-item style='float:right;'>
                	<cv-tool
                    style='margin:0px;'
		            :name="$route.name"
                    :data="$store.getters.monitorMenu"
                    :is-add="false"
                    :is-modify="false"
                    :is-remove="false"
                     @export="down"
                     @search="searchMileage"></cv-tool>
            </el-form-item>
        </cv-header>
        <cv-content :fill="true">
            <!-- tab页签 -->
            <el-tabs class="tabClass" v-model="activeName"  @tab-click="tabClick">
                <!-- 行驶里程统计 -->
                <el-tab-pane :label="$t('reportForm.mileageStatic.mileageTotalStatic')" name="MSA">
                    <!-- 表格 -->
                    <cv-grid class="" :options="speedGrid.options" @load="mileageloadGrid(false)">
                        <el-table border stripe :data="speedGrid.table" :max-height="$service.getAutoHeight(1,1)"  v-loading="speedGrid.loading">
                            <el-table-column :label="$t('cE.carNumber')" header-align="center" min-width="100" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('cE.carColor')" header-align="center" min-width="100" prop="plateColor" :formatter='plateCodeAndColor' :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.mileageStatic.blcarGroup')" header-align="center" min-width="100" prop="feetName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.mileageStatic.blenterprise')" header-align="center" min-width="120" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.mileageStatic.driveTotalMileage')" header-align="center" min-width="150" prop="mileageSum" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('el.datepicker.startTime')" header-align="center" min-width="150" prop="startDate" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('el.datepicker.endTime')" header-align="center" min-width="150" prop="endDate" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('action.operation')" header-align="center" min-width="120" prop="operate" :show-overflow-tooltip="true">
                              <template scope="scope" >
								               <cv-span type="primary" v-if="scope.row.flag==1" @click.native.prevent="linkTo(scope)">{{scope.row.flag==1 ? $t('reportForm.mileageStatic.lookDetail') : $t('reportForm.mileageStatic.blank')}}</cv-span>
							                </template>
                            </el-table-column>
                        </el-table>
                    </cv-grid>
                </el-tab-pane>
                <!-- 单日行驶里程信息 -->
                <el-tab-pane :label="$t('reportForm.mileageStatic.dateTotalStatic')" name="MSB">
                    <!-- 表格 -->
                    <cv-grid class="" :options="trackGrid.options" @load="dateMileageloadGrid(false)" >
                        <el-table border stripe :data="trackGrid.table" :max-height="$service.getAutoHeight(1,1)" v-loading="trackGrid.loading" >
                            <el-table-column :label="$t('cE.carNumber')" header-align="center" min-width="100" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('cE.carColor')" header-align="center" min-width="100" prop="plateColor" :formatter='plateCodeAndColor' :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.mileageStatic.blcarGroup')" header-align="center" min-width="100" prop="feetName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.mileageStatic.blenterprise')" header-align="center" min-width="120" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.mileageStatic.driveTotalMileage')" header-align="center" min-width="150" prop="mileageSum" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.mileageStatic.driveDate')" header-align="center" min-width="150" prop="runDate" :show-overflow-tooltip="true"></el-table-column>
                        </el-table>
                    </cv-grid>
                </el-tab-pane>
            </el-tabs>
        </cv-content>
    </div>
</template>
<script>
import prot from "./index.js";
export default {
  components: {},
  mixins: [prot],
  data() {
    return {
      getMileage: false,
      company: "",
      activeName: "MSA",
      plateCode: "",
      nextCode: "",
      enterpriseName:"",
      tabShow:true,
      enterpriseId: "",
      fleetName: "",
      fleetId: "",
      sTime: "",
      etime: "",
      SEtime: [
        this.$filter.timeStamp(
          this.$filter.format(new Date() - 48 * 60 * 60 * 1000, "yyyy-MM-dd")
        ),
        this.$filter.timeStamp(
          this.$filter.format(new Date() - 24 * 60 * 60 * 1000, "yyyy-MM-dd")
        )
      ],
      speedGrid: {
        options: {
          current: 1,
          total: 0,
          size: 10,
          flag: false
        },
        table: [],
        loading: false
      },
      trackGrid: {
        options: {
          current: 1,
          total: 0,
          size: 10,
          flag: false
        },
        table: [],
        loading: false
      },
      // 日期配置
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
        }
      }
    };
  },
  methods: {
    //企业树点击回调
    label({ id, enterpriseCode }) {
      this.enterpriseId = id;
    },
    vehicleIdCall(val) {
      if(val.id!='empty'){
        this.fleetId = val.id;
      }else{
        this.fleetId = '';
      }
      
    },
    //行驶里程统计报表
    mileageloadGrid(type) {
      if (type) {
        this.speedGrid.options.flag = true;
        this.speedGrid.options.current = 1;
      } else {
        this.speedGrid.options.flag = false;
      }
      let params = {
        startDate: this.$filter.format(this.SEtime[0], "yyyy-MM-dd"),
        endDate: this.$filter.format(this.SEtime[1], "yyyy-MM-dd"),
        current: this.speedGrid.options.current,
        size: this.speedGrid.options.size,
        plateCode: this.plateCode == "" ? "" : this.plateCode,
        enterpriseId:this.enterpriseId,
        fleetId: this.fleetId
      };
      this.speedGrid.loading = true;
      this.findMieageByDate(params)
        .then(data => {
          if (data.flag) {
            if (data.data.length != 0) {
              this.speedGrid.table = data.data.records;
              this.speedGrid.options.total = data.data.total;
              this.speedGrid.loading = false;
            } else {
              this.speedGrid.table = [];
              this.speedGrid.options.total = 0;
            }
          } else {
            this.speedGrid.table = [];
            this.speedGrid.options.total = 0;
          }
        })
        .catch(_ => {
          this.$message.error("网络异常");
          this.speedGrid.loading = false;
        });
    },
    //单日行驶里程统计
    dateMileageloadGrid(type) {
      if (type) {
        this.trackGrid.options.flag = true;
        this.trackGrid.options.current = 1;
      } else {
        this.trackGrid.options.flag = false;
      }
      let params = {
        startDate: this.$filter.format(this.SEtime[0], "yyyy-MM-dd"),
        endDate: this.$filter.format(this.SEtime[1], "yyyy-MM-dd"),
        current: this.trackGrid.options.current,
        size: this.trackGrid.options.size,
        plateCode: this.plateCode != "" ? this.plateCode : this.nextCode,
        enterpriseId:this.enterpriseId,
        fleetId: this.fleetId
      };
      this.trackGrid.loading = true;
      this.findMieageByDateDetail(params)
        .then(data => {
          if (data.flag) {
            if (data.data.length != 0) {
              this.trackGrid.table = data.data.records;
              this.trackGrid.options.total = data.data.total;
              this.trackGrid.loading = false;
            } else {
              this.trackGrid.table = [];
              this.trackGrid.options.total = 0;
            }
          } else {
            this.trackGrid.table = [];
            this.trackGrid.options.total = 0;
          }
        })
        .catch(_ => {
          this.$message.error("网络异常");
          this.trackGrid.loading = false;
        });
    },
    //转到详细页
    linkTo(scope) {
      this.activeName = "MSB";
      this.trackGrid.table = [];
      //详细信息点击后就车牌号显示选中
      this.nextCode = scope.row.plateCode;
      this.tabShow=false;
      setTimeout(() => {
        this.dateMileageloadGrid();
      }, 100);
    },
    //行驶里程的搜索
    searchMileage() {
      //搜索两个表都刷新
      if (this.SEtime != undefined) {
        let startT = this.$filter.format(this.SEtime[0], "yyyy-MM-dd");
        let endT = this.$filter.format(this.SEtime[1], "yyyy-MM-dd");
        if (this.searchReg(startT, endT)) {
          this.mileageloadGrid(true);
          this.dateMileageloadGrid(true);
        }
      } else {
        this.$message.error({ message: this.$t("请选择时间") });
      }
    },
    //查询规则
    searchReg(startTime, endTime) {
      if (this.$filter.timeRange(startTime, endTime) > 2) {
        this.$message.error({ message: this.$t("查询时间间隔不能超过三天") });
        return false;
      } else {
        return true;
      }
    },
    tabClick() {
      this.tabShow=true;
      this.nextCode="";
      switch (this.activeName) {
        case "MSA":
          return this.mileageloadGrid(true);
          break;
        case "MSB":
          return this.dateMileageloadGrid(true);
          break;
      }
    },
    down() {
      if (this.SEtime != undefined) {
        let downParams = {
          startDate: this.$filter.format(this.SEtime[0], "yyyy-MM-dd"),
          endDate: this.$filter.format(this.SEtime[1], "yyyy-MM-dd"),
          current: this.trackGrid.options.current,
          size: this.trackGrid.options.size,
          plateCode: this.plateCode != "" ? this.plateCode :this.nextCode,
          enterpriseId:this.enterpriseId,
          fleetId: this.fleetId
        };
        //行驶里程统计报表导出
        if (this.activeName == "MSA") {
          const getDriveMeterExcelA = this.$service.winParams(
            this.$COMMON.baseUrl + "/report/exportMieageByDate",
            downParams
          );
          window.location.href = getDriveMeterExcelA;
        }
        //单日行驶里程信息报表导出
        if (this.activeName == "MSB") {
          const getDriveMeterExcelB = this.$service.winParams(
            this.$COMMON.baseUrl + "/report/exportMieageByDateDetail",
            downParams
          );
          window.location.href = getDriveMeterExcelB;
        }
      } else {
        this.$message.error({ message: this.$t("请选择时间") });
      }
    },
    plateCodeAndColor(row) {
      return this.$filter.plateCodeColor(row.plateColor);
    }
  },
  mounted() {
    this.mileageloadGrid(true);
    this.dateMileageloadGrid(true);
  },
  watch: {
      "company"(newVal){
        this.fleetName="";
      }
  }
};
</script>
<style lang="scss">
.MileageStatistics {
  .el-table .el-tooltip.cell {
    text-align: center;
  }
}
</style>
