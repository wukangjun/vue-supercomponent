<template>
    <div class="MileageStatistics">
        <cv-header>
          <el-form-item label="起止时间">
                <el-date-picker v-model="SEtime" size="small" :clearable="true" :editable="false" type="datetimerange" placeholder="请选择时间范围" :picker-options="pickerOption" style="width:330px">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="车牌号">
                <el-input v-model.trim="plateCode" size="small" style="width:150px;"></el-input>
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
            <el-tabs class="tabClass" v-model="activeName" @tab-click="tabClick">
                <!-- 指令统计 -->
                <el-tab-pane label="指令统计" name="ORA">
                    <!-- 表格 -->
                    <cv-grid class="" :options="speedGrid.options" @load="orderloadGrid(false)">
                        <el-table border stripe :data="speedGrid.table" :max-height="$service.getAutoHeight(1,1)"  v-loading="speedGrid.loading">
                            <el-table-column :label="$t('cE.carNumber')" header-align="center" min-width="100" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('cE.carColor')" header-align="center" min-width="100" prop="plateColor" :formatter='plateCodeAndColor' :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="公司名称" header-align="center" min-width="100" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="分组名称" header-align="center" min-width="120" prop="groupName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="下发次数" header-align="center" min-width="150" prop="sendOrderCount" :show-overflow-tooltip="true"></el-table-column>    
                            </el-table-column>
                        </el-table>
                    </cv-grid>
                </el-tab-pane>
                <!--指令类型统计 -->
                <el-tab-pane label="按指令类型统计" name="ORB">
                    <!-- 表格 -->
                    <cv-grid class="" :options="trackGrid.options" @load="orderTypeloadGrid(false)" >
                        <el-table border stripe :data="trackGrid.table" :max-height="$service.getAutoHeight(1,1)" v-loading="trackGrid.loading" >
                            <el-table-column :label="$t('cE.carNumber')" header-align="center" min-width="100" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('cE.carColor')" header-align="center" min-width="100" prop="plateColor" :formatter='plateCodeAndColor' :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.mileageStatic.blcarGroup')" header-align="center" min-width="100" prop="groupName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.mileageStatic.blenterprise')" header-align="center" min-width="120" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="发送时间" header-align="center" min-width="100" prop="sendOrderTime" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="下发指令名称" header-align="center" min-width="100" prop="orderName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="下发次数" header-align="center" min-width="100" prop="sendOrderCount" :show-overflow-tooltip="true"></el-table-column>
                        </el-table>
                    </cv-grid>
                </el-tab-pane>
                <!-- //指令明细统计 -->
                <el-tab-pane label="明细信息" name="ORC">
                    <!-- 表格 -->
                    <cv-grid class="" :options="orderGrid.options" @load="nextTypeloadGrid(false)" >
                        <el-table border stripe :data="orderGrid.table" :max-height="$service.getAutoHeight(1,1)" v-loading="orderGrid.loading" >
                            <el-table-column :label="$t('cE.carNumber')" header-align="center" min-width="100" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('cE.carColor')" header-align="center" min-width="100" prop="plateColor" :formatter='plateCodeAndColor' :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.mileageStatic.blcarGroup')" header-align="center" min-width="100" prop="groupName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('reportForm.mileageStatic.blenterprise')" header-align="center" min-width="120" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="下发指令名称" header-align="center" min-width="100" prop="orderName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="指令状态" header-align="center" min-width="100":formatter="isOrder" prop="sendFlag" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="发送时间" header-align="center" min-width="100" prop="sendOrderTime" :show-overflow-tooltip="true"></el-table-column>
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
      activeName: "ORA",
      plateCode: "",
      enterpriseName: this.$store.getters.user.enterpriseName,
      enterpriseId: this.$store.getters.user.enterpriseId,
      fleetName: "",
      sTime: "",
      etime: "",
      SEtime: [
        this.$filter.timeStamp(
          this.$filter.format(
            new Date(new Date() - 24 * 60 * 60 * 1000),
            "yyyy-MM-dd start"
          )
        ),
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd end")
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
      orderGrid: {
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
          return time.getTime() > Date.now();
        }
      }
    };
  },
  methods: {
    //统计信息报表
    orderloadGrid(type) {
      if (type) {
        this.speedGrid.options.flag = true;
        this.speedGrid.options.current = 1;
      } else {
        this.speedGrid.options.flag = false;
      }
      let params = {
        startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd  HH:mm:ss"),
        endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd  HH:mm:ss"),
        current: this.speedGrid.options.current,
        size: this.speedGrid.options.size,
        plateCode: this.plateCode == "" ? "" : this.plateCode,
        feetId: this.feetId == "" ? "" : this.feetId,
        typeName: "2"
      };
      this.speedGrid.loading = true;
      this.pageorderinfo(params)
        .then(data => {
          if (data.flag) {
            if (data.data.length != 0) {
              this.speedGrid.table = data.data.records;
              this.speedGrid.options.total = data.data.total;
            } else {
              this.speedGrid.table = [];
              this.speedGrid.options.total = 0;
            }
          } else {
            this.speedGrid.table = [];
            this.speedGrid.options.total = 0;
          }
          this.speedGrid.loading = false;
        })
        .catch(_ => {
          this.$message.error("网络异常");
          this.speedGrid.loading = false;
        });
    },
    //按指令类别统计
    orderTypeloadGrid(type) {
      if (type) {
        this.trackGrid.options.flag = true;
        this.trackGrid.options.current = 1;
      } else {
        this.trackGrid.options.flag = false;
      }
      let params = {
        startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd  HH:mm:ss"),
        endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd  HH:mm:ss"),
        current: this.trackGrid.options.current,
        size: this.trackGrid.options.size,
        plateCode: this.plateCode == "" ? "" : this.plateCode,
        typeName: "1"
      };
      this.trackGrid.loading = true;
      this.pageorderinfo(params)
        .then(data => {
          if (data.flag) {
            if (data.data.length != 0) {
              this.trackGrid.table = data.data.records;
              this.trackGrid.options.total = data.data.total;
            } else {
              this.trackGrid.table = [];
              this.trackGrid.options.total = 0;
            }
          } else {
            this.trackGrid.table = [];
            this.trackGrid.options.total = 0;
          }
          this.trackGrid.loading = false;
        })
        .catch(_ => {
          this.$message.error("网络异常");
          this.trackGrid.loading = false;
        });
    },
    //明细信息
    nextTypeloadGrid(type) {
      if (type) {
        this.orderGrid.options.flag = true;
        this.orderGrid.options.current = 1;
      } else {
        this.orderGrid.options.flag = false;
      }
      let params = {
        startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd  HH:mm:ss"),
        endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd  HH:mm:ss"),
        current: this.orderGrid.options.current,
        size: this.orderGrid.options.size,
        plateCode: this.plateCode == "" ? "" : this.plateCode,
        typeName: "0"
      };
      this.orderGrid.loading = true;
      this.pageorderinfo(params)
        .then(data => {
          if (data.flag) {
            if (data.data.length != 0) {
              this.orderGrid.table = data.data.records;
              this.orderGrid.options.total = data.data.total;
            } else {
              this.orderGrid.table = [];
              this.orderGrid.options.total = 0;
            }
          } else {
            this.orderGrid.table = [];
            this.orderGrid.options.total = 0;
          }
          this.orderGrid.loading = false;
        })
        .catch(_ => {
          this.$message.error("网络异常");
          this.orderGrid.loading = false;
        });
    },
    isOrder(row, column, cellValue) {
      return this.$filter.orderTypeS(row.sendFlag);
    },
    //搜索
    searchMileage() {
      //搜索三个表都刷新
      if (this.SEtime != undefined) {
        let startT = this.$filter.format(
          this.SEtime[0],
          "yyyy-MM-dd  HH:mm:ss"
        );
        let endT = this.$filter.format(this.SEtime[1], "yyyy-MM-dd  HH:mm:ss");
        if (this.searchReg(startT, endT)) {
          if (this.activeName == "ORA") {
            this.orderloadGrid(true);
          } else if (this.activeName == "ORB") {
            this.orderTypeloadGrid(true);
          } else if (this.activeName == "ORC") {
            this.nextTypeloadGrid(true);
          }
        }
      } else {
        this.$message.error({ message: this.$t("请选择时间") });
      }
    },
    tabClick() {
      switch (this.activeName) {
        case "ORA":
          return this.orderloadGrid();
        case "ORB":
          return this.orderTypeloadGrid();
        case "ORC":
          return this.nextTypeloadGrid();
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
    down() {
      if (this.SEtime != undefined) {
        let downParams = {
          startTime: this.$filter.format(
            this.SEtime[0],
            "yyyy-MM-dd  HH:mm:ss"
          ),
          endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd  HH:mm:ss"),
          current: this.trackGrid.options.current,
          size: this.trackGrid.options.size,
          plateCode: this.plateCode == "" ? "" : this.plateCode
        };
        //信息统计报表导出
        if (this.activeName == "ORA") {
          const getDriveMeterExcelA = this.$service.winParams(
            this.$COMMON.baseUrl + "/report/exportOrderInfoCount",
            downParams
          );
          window.location.href = getDriveMeterExcelA;
        }
        //指令类别报表导出
        if (this.activeName == "ORB") {
          const getDriveMeterExcelB = this.$service.winParams(
            this.$COMMON.baseUrl + "/report/exportOrderInfoType",
            downParams
          );
          window.location.href = getDriveMeterExcelB;
        }
        //明细信息报表导出
        if (this.activeName == "ORC") {
          const getDriveMeterExcelB = this.$service.winParams(
            this.$COMMON.baseUrl + "/report/exportOrderInfo",
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
    },
    vehicleIdCall(val) {
      this.fleetId = val.id;
    }
  },
  mounted() {
    this.orderloadGrid();
    this.orderTypeloadGrid();
    this.nextTypeloadGrid();
  },
  watch: {}
};
</script>
<style lang="scss">
.MileageStatistics {
  .el-table .el-tooltip.cell {
    text-align: center;
  }
}
</style>
