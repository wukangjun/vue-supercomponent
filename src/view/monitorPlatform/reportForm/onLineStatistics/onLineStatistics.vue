<template>
    <div class="onLineStatistics">
        <cv-header>
          <el-form-item label="起止时间">
                <el-date-picker :editable="false" :clearable="false" v-model="SEtime" size="small" type="datetimerange" placeholder="请选择时间" :picker-options="pickerOption" style="width:330px">
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
                    @search="search"></cv-tool>
            </el-form-item>
        </cv-header>
        <cv-content :fill="true">  
                    <!-- 表格 -->
                    <cv-grid class="" :options="speedGrid.options" @load="onlineGrid(false)">
                        <el-table border stripe :data="speedGrid.table" :max-height="$service.getAutoHeight(1)"  v-loading="speedGrid.loading">
                            <el-table-column :label="$t('cE.carNumber')" header-align="center" min-width="100" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('cE.carColor')" header-align="center" min-width="100" prop="plateColor" :formatter='plateCodeAndColor' :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="上线总时间(s)" header-align="center" min-width="100" prop="onlineTimeCount" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="车辆上线率(%)" header-align="center" min-width="120" prop="percentage" :show-overflow-tooltip="true"></el-table-column>
                        </el-table>
                    </cv-grid>    
       
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
      // 日期配置
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  methods: {
    //行驶里程统计报表
    onlineGrid(type) {
      if (type) {
        this.speedGrid.options.flag = true;
        this.speedGrid.options.current = 1;
      } else {
        this.speedGrid.options.flag = false;
      }
      if(!this.SEtime[0]){
        this.$message.warning("请选择时间!");
        return false;
      }
      let params = {
        startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
        current: this.speedGrid.options.current,
        size: this.speedGrid.options.size,
        plateCode:this.plateCode
      };
      this.speedGrid.loading = true;
      this.findSingleVehicleOnLineRate(params)
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

    //搜索
    search() {
      //搜索两个表都刷新
      if (this.SEtime[0]) {
        let startT = this.$filter.format(this.SEtime[0], "yyyy-MM-dd");
        let endT = this.$filter.format(this.SEtime[1], "yyyy-MM-dd");
        if (this.searchReg(startT, endT)) {
          this.onlineGrid(true);
        }
      } else {
        this.$message.warning("请选择时间!");
      }
    },
    //查询规则
    searchReg(startTime, endTime) {
      if (this.$filter.timeRange(startTime, endTime) > 3) {
        this.$message.warning("查询时间间隔不能超过三天!");
        return false;
      } else {
        return true;
      }
    },
    down() {
      if (this.SEtime != undefined) {
        let downParams = {
          startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
          endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
          plateCode: this.plateCode
        };
        //导出
        const outPut = this.$service.winParams(
          this.$COMMON.baseUrl + "/report/exportSingleVehicleOnLineRate.do",
          downParams
        );
        window.location.href = outPut;
      } else {
         this.$message.warning("请选择时间!");
      }
    },
    plateCodeAndColor(row) {
      return this.$filter.plateCodeColor(row.plateColor);
    }
  },
  mounted() {
    this.onlineGrid();
  },
  watch: {}
};
</script>
<style lang="scss">
.onLineStatistics {
  .el-table .el-tooltip.cell {
    text-align: center;
  }
}
</style>
