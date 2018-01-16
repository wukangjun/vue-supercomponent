<template>
    <div class="MileageStatistics">
        <cv-header>
            <el-form-item style='float:right;'>
                	<cv-tool
                    style='margin:0px;'
		            :name="$route.name"
                    :data="$store.getters.monitorMenu"
                    :is-add="false"
                    :is-modify="false"
                    :is-remove="false"
                    :is-search="false"
                     @export="down"></cv-tool>
            </el-form-item>
        </cv-header>
        <cv-content :fill="true">
            <!-- tab页签 -->
            <el-tabs class="tabClass" v-model="activeName"  @tab-click="tabClick">
                <!-- 实时时钟 -->
                <el-tab-pane label="实时时钟" name="MSA">
                    <!-- 表格 -->
                    <cv-grid class="" :options="speedGrid.options" @load="queryDRGetTime(false)">
                        <el-table border stripe :data="speedGrid.table" :max-height="$service.getAutoHeight(1,1)"  v-loading="speedGrid.loading">
                            <el-table-column :label="$t('cE.carNumber')" header-align="center" min-width="100" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('cE.carColor')" header-align="center" min-width="100" prop="plateColor" :formatter='plateCodeAndColor' :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="命令编号" header-align="center" min-width="100" prop="orderId" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="记录仪传回的时间" header-align="center" min-width="120" prop="drTime" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="存储时间" header-align="center" min-width="150" prop="recordTime" :show-overflow-tooltip="true"></el-table-column>  
                        </el-table>
                    </cv-grid>
                </el-tab-pane>
                <!-- 驾驶员信息-->
                <el-tab-pane label="驾驶员信息" name="MSB">
                    <!-- 表格 -->
                    <cv-grid class="" :options="trackGrid.options" @load="queryDRDriver(false)" >
                        <el-table border stripe :data="trackGrid.table" :max-height="$service.getAutoHeight(1,1)" v-loading="trackGrid.loading" >
                            <el-table-column :label="$t('cE.carNumber')" header-align="center" min-width="100" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('cE.carColor')" header-align="center" min-width="100" prop="plateColor" :formatter='plateCodeAndColor' :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="命令编号" header-align="center" min-width="100" prop="orderId" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="驾驶证号" header-align="center" min-width="120" prop="driverLicense" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="驾驶员代码" header-align="center" min-width="150" prop="driverCode" :show-overflow-tooltip="true"></el-table-column>         
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
      enterpriseName: "",
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
          total: 5,
          size: 10,
          flag: false
        },
        table: [],
        loading: false
      },
      trackGrid: {
        options: {
          current: 1,
          total: 5,
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
    //实时时钟
    queryDRGetTime(type) {
      if (type) {
        this.speedGrid.options.flag = true;
        this.speedGrid.options.current = 1;
      } else {
        this.speedGrid.options.flag = false;
      }
      let params = {
        current: this.speedGrid.options.current,
        size: this.speedGrid.options.size
      };
      this.speedGrid.loading = true;
      this.queryDRGetTimeLog(params)
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

    //驾驶员信息
    queryDRDriver(type) {
      if (type) {
        this.trackGrid.options.flag = true;
        this.trackGrid.options.current = 1;
      } else {
        this.trackGrid.options.flag = false;
      }
      let params = {
        current: this.trackGrid.options.current,
        size: this.trackGrid.options.size
      };
      this.trackGrid.loading = true;
      this.queryDRDriverLog(params)
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
    searchLog() {
      //搜索两个表都刷新
      this.queryDRGetTime(true);
      this.queryDRDriver(true);
    },
    tabClick() {
      switch (this.activeName) {
        case "MSA":
          return this.queryDRGetTime(true);
          break;
        case "MSB":
          return this.queryDRDriver(true);
          break;
      }
    },
    down() {
      let downParams = {
        current: this.trackGrid.options.current,
        size: this.trackGrid.options.size
      };
      //实时时钟导出
      if (this.activeName == "MSA") {
        const getDriveMeterExcelA = this.$service.winParams(
          this.$COMMON.baseUrl + "/driverRecordOld/exportGetTimeLog",
          downParams
        );
        window.location.href = getDriveMeterExcelA;
      }
      //驾驶信息导出
      if (this.activeName == "MSB") {
        const getDriveMeterExcelB = this.$service.winParams(
          this.$COMMON.baseUrl + "/driverRecordOld/exportDriverLog",
          downParams
        );
        window.location.href = getDriveMeterExcelB;
      }
    },
    plateCodeAndColor(row) {
      return this.$filter.plateCodeColor(row.plateColor);
    }
  },
  mounted() {
    this.queryDRDriver(true);
    this.queryDRGetTime(true);
   
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
