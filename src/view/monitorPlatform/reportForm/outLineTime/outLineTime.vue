<template>
    <div class="onLineStatistics">
        <cv-header>
          <el-form-item label="离线起止时间">
                <el-date-picker :editable="false" v-model="SEtime" size="small" type="datetimerange" :placeholder="$t('请选择时间')" :picker-options="pickerOption" style="width:330px">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="车牌号">
                <el-input v-model.trim="plateCode" size="small" style="width:150px;"></el-input>
            </el-form-item>
            <div slot="bottom">
              <el-form-item label="所属公司">
             		<cv-dropdown-tree  :placeholder="$t('common.enterprise.enterpriseName')" :interface="$COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'" :readonly="false" v-model="company" :is-default="false" @label="label"></cv-dropdown-tree>
            </el-form-item>
            <el-form-item label="所属车队">
               <cv-dropdown-tree v-model.trim="fleetName" :is-fleet="true" :interface="$COMMON.baseUrl + '/fleet/findFleetInfoList'" :is-default="false"  :enterprise-id="enterpriseId" @label="vehicleIdCall"></cv-dropdown-tree>
            </el-form-item>
            </div>        
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
                    <cv-grid class="" :options="speedGrid.options" @load="outLineGrid(false)">
                        <el-table border stripe :data="speedGrid.table" :max-height="$service.getAutoHeight(1)"  v-loading="speedGrid.loading">
                            <el-table-column :label="$t('cE.carNumber')" header-align="center" min-width="100" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column :label="$t('cE.carColor')" header-align="center" min-width="100" prop="plateColor" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="最后下线时间" header-align="center" min-width="100" prop="lastOfftime" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="超时时间(min)" header-align="center" min-width="120" prop="overTime" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="SIM卡号" header-align="center" min-width="120" prop="mobileCode" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="车队" header-align="center" min-width="120" prop="fleetName" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>
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
      fleetId: "",
      plateCode: "",
      enterpriseName: this.$store.getters.user.enterpriseName,
      enterpriseId: '',
      company: "",
      fleetName: "",
      sTime: "",
      etime: "",
      SEtime: [
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd start")
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
    //企业树点击回调
    label({ id, enterpriseCode }) {
      this.enterpriseId = id;
    },
    outLineGrid(type) {
      if (type) {
        this.speedGrid.options.flag = true;
        this.speedGrid.options.current = 1;
      } else {
        this.speedGrid.options.flag = false;
      }
      let params = {
        startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
        current: this.speedGrid.options.current,
        size: this.speedGrid.options.size,
        plateCode: this.plateCode,
        enterpriseId:this.enterpriseId,
        fleetId: this.fleetId
      };

      this.speedGrid.loading = true;
      this.findVehicleOfflineOverTime(params)
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
      if (this.SEtime != undefined) {
        let startT = this.$filter.format(
          this.SEtime[0],
          "yyyy-MM-dd  HH:mm:ss"
        );
        let endT = this.$filter.format(this.SEtime[1], "yyyy-MM-dd  HH:mm:ss");
        if (this.searchReg(startT, endT)) {
          this.outLineGrid(true);
        }
      } else {
        this.$message.error({ message: this.$t("请选择时间") });
      }
    },
    //查询规则
    searchReg(startTime, endTime) {
      if (this.$filter.timeRange(startTime, endTime) > 3) {
        this.$message.error({ message: this.$t("查询时间间隔不能超过三天") });
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
          plateCode: this.plateCode,
          enterpriseId:this.enterpriseId,
          fleetId: this.fleetId
        };
        //导出
        const outPut = this.$service.winParams(
          this.$COMMON.baseUrl + "/vehicle/exportOfflineOverTimeReport",
          downParams
        );
        window.location.href = outPut;
      } else {
        this.$message.error({ message: this.$t("请选择时间") });
      }
    },
    // plateCodeAndColor(row) {
    //   return this.$filter.plateCodeColor(row.plateColor);
    // },
    vehicleIdCall(val) {
      this.fleetId = val.id;
    }
  },
  mounted() {
    this.outLineGrid();
  },
  watch: {
      "company"(newVal){
        this.fleetName="";
      }
  }
};
</script>
<style lang="scss">
.onLineStatistics {
  .el-table .el-tooltip.cell {
    text-align: center;
  }
}
</style>
