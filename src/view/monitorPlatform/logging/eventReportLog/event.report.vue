<template>
    <div class="main">
      <cv-header>
        <el-form-item label="起始时间:">
                <el-date-picker :editable="false" :clearable="true" v-model="receiveTime" size="small" type="datetimerange" placeholder="请选择时间" :picker-options="pickerOption" style="width:330px">
        </el-date-picker>
          </el-form-item>
        <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false"   :is-export ="false"
            :is-add='false' @search="eventLoad" style='margin:0px;'></cv-tool>
    </cv-header>      
    <cv-content>
        <cv-grid :options="grid.options" @load="eventLoad(false)">
            <el-table border stripe :data="grid.table" v-loading="grid.loading"  ref="table">
                <el-table-column label="事件ID" prop="eventId"></el-table-column>
                <el-table-column label="事件内容" prop="eventinfo" ></el-table-column>
                <el-table-column label="上报时间" prop="timeStr" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
        </cv-grid>
    </cv-content>
  </div>
</template>
<script>
import port from "./index.js";
export default {
  components: {},
  mixins: [port],
  data() {
    return {
      reset: false,
      receiveTime: [
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
      flag: false,
      vid: "",
      grid: {
        options: {
          current: 1,
          size: 10,
          total: 0
        },
        table: [],
        loading: false,
        flag: false
      },
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  methods: {
    eventLoad(type) {
      if (type) {
        this.grid.flag = true;
        this.grid.options.current = 1;
        this.grid.options.size = 10;
      } else {
        this.grid.flag = false;
      }
      this.eventSearch();
    },
    async eventSearch(flag) {
      this.grid.loading = true;
      let params;
      if (this.vid != "") {
        if (this.receiveTime != undefined) {
          params = {
            current: this.grid.options.current,
            size: this.grid.options.size,
            vehicleId: this.vid,
            startTime: this.$filter.format(
              this.receiveTime[0],
              "yyyy-MM-dd HH:mm:ss"
            ),
            endTime: this.$filter.format(
              this.receiveTime[1],
              "yyyy-MM-dd HH:mm:ss"
            )
          };
          if (params.startTime != undefined && params.endTime != undefined) {
            if (this.$filter.timeRange(params.startTime, params.endTime) <= 3) {
              const { flag, data } = await this.getEventinfoLogPage(params);
              this.grid.loading = false;
              if (flag && data.length != 0) {
                this.grid.table = data.records;
                this.grid.table.forEach(val => {});
                this.grid.options.total = data.total;
              } else {
                this.grid.table = [];
                this.grid.options.total = 0;
              }
            } else {
              this.grid.loading = false;
              this.$message.error({ message: this.$t("时间范围为3天") });
            }
          } else {
            this.$message.error({ message: this.$t("请选择时间范围") });
            this.grid.loading = false;
          }
        } else {
          this.$message.error({ message: this.$t("请选择时间范围") });
          this.grid.loading = false;
        }
      } else {
        this.$message.error({ message: this.$t("请先选择车辆") });
        this.grid.loading = false;
      }
    }
  },
  watch: {
    "$store.getters.ptSingleCar"(newVal) {
      this.vid = newVal.id;
      // this.eventLoad();
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  top: 0px;
  bottom: 0px;
}

.main .left {
  margin-right: 370px;
}

.main .right {
  position: absolute;
  right: 0;
  top: 14px;
  width: 360px;
}
</style>