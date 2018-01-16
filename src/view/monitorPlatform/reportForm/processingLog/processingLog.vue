<template>
    <div class='behavior'>
        <cv-header>
            <el-form-item label="报警类型:">
				<dropdown-tree style="display:inline-block" :isCheck="true" size='small' :interface="$COMMON.baseUrl+'/alarmInfo/frinAlarmTypeInfoList.do'" :show-checkbox="true" @checked="checked"></dropdown-tree>
			</el-form-item>
            <el-form-item :label="$t('cL.carNumber')" prop="plateCode">
                <el-input v-model.trim="search.plateCode" size='small' :maxlength='10'></el-input>
            </el-form-item>
            <el-form-item label="选择时间:">
                <el-date-picker class="picker" v-model="time" :picker-options='pickerOptions0' size='small'  :clearable="false" :editable="false" type="datetimerange"  placeholder="选择时间范围" prop='time'></el-date-picker>
            </el-form-item>
            <el-form-item style='float:right'>
                <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false"   @export ="down"
                :is-add='false' @search="load" style='margin:0px;'></cv-tool>
            </el-form-item>
            <div slot='bottom'>
                <el-form-item label="处理人:">
                    <el-input v-model.trim="search.man" size='small' :maxlength='10'></el-input>
                </el-form-item>
                <el-form-item label="处理状态:">
                    <el-select v-model="search.status" placeholder="请选择" size='small' clearable>
                      <el-option v-for="item in status" :key="item.val" :label="item.name" :value='item.val'></el-option>
                    </el-select>
                </el-form-item>
            </div>
        </cv-header>
        <cv-content :fill='true'>
            <cv-grid class="" :options="options" @load="load(false)" >
                <el-table border stripe :data="options.table" :max-height="this.$service.getAutoHeight(1)" v-loading="loading">
                    <el-table-column label="车牌号码"   min-width="150" prop="plateCode" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="车牌颜色"  min-width="100" prop='carPlateColor'></el-table-column>
                    <el-table-column label="报警类型"  min-width="100" prop="alarmTypeName" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="报警开始时间"  min-width="150" prop="startTime" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="报警结束时间"  min-width="150" prop="endTime" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="报警次数"  min-width="150" prop="alarmCount"></el-table-column>
                    <el-table-column label="处理人"  min-width="100" prop="handlePeople"></el-table-column>
                    <el-table-column label="处理状态"  min-width="100" prop="status" :formatter="statusFun"></el-table-column>
                    <el-table-column label="处理时间"  min-width="150" prop="handleTime" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="处理方式"  min-width="100" prop="handleWay"></el-table-column>
                </el-table>
            </cv-grid>
        </cv-content>
    </div>
</template>
<script>
import dropdownTree from "@/components/dropdown-tree/dropdown.tree.vue";
import port from "./index.js";
export default {
  components: { dropdownTree },
  mixins: [port],
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      time: [
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd start")
        ),
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd end")
        )
      ],
      search: {
        plateCode: "",
        status: "",
        man: "",
        startTime: "",
        endTime: "",
        alarmTypes: ""
      },
      status: [
        { val: "0", name: "未处理" },
        { val: "1", name: "处理完毕" },
        { val: "2", name: "不做处理" },
        { val: "3", name: "将来处理" }
      ],
      loading: false,
      options: {
        size: 10,
        total: 0,
        table: [],
        loading: false,
        current: 1,
        flag: false
      }
    };
  },
  methods: {
    load(flag) {
      let _pararms = this.getData();
      _pararms.size=this.options.size;
      _pararms.current=this.options.current;
      if (flag) {
        this.options.flag = true;
        this.options.current = 1;
      } else {
        this.options.flag = false;
      }
      if (!this.time[0]) {
        this.$message.warning("请选择时间!");
        return false;
      }
      if (this.$filter.timeRange(_pararms.startTime, _pararms.endTime) > 1) {
        this.$message.warning("查询范围不能超过一天!");
        return false;
      }
      this.loading = true;
      this.queryData(_pararms)
        .then(data => {
          if (data.flag && data.data.length != 0) {
            this.options.table = data.data.records;
            this.options.total = data.data.total;
            this.options.current = data.data.current;
          } else {
            this.options.table = [];
            this.options.total = 0;
          }
          this.loading = false;
        })
        .catch(_ => {
          this.loading = false;
        });
    },
    down() {
      let _params = this.getData();
      if (!this.time[0]) {
        this.$message.warning("请选择时间!");
        return false;
      }
      if (this.$filter.timeRange(_params.startTime, _params.endTime) > 1) {
        this.$message.warning("查询范围不能超过一天!");
        return false;
      }
      const exportUrl = this.$service.winParams(
        this.$COMMON.baseUrl + "/report/reportAlarmHandleCount",
        _params
      );
      window.location.href = exportUrl;
    },
    getData() {
      this.search.startTime = /NAN/gi.test(this.$filter.format(this.time[0]))
        ? this.time[0]
        : this.$filter.format(this.time[0], "yyyy-MM-dd HH:mm:ss");
      this.search.endTime = /NAN/gi.test(this.$filter.format(this.time[1]))
        ? this.time[1]
        : this.$filter.format(this.time[1], "yyyy-MM-dd HH:mm:ss");
      let params = {
        startTime: this.search.startTime,
        endTime: this.search.endTime,
        alarmTypeId: this.search.alarmTypes,
        plateCode: this.search.plateCode,
        handlePeople: this.search.man,
        status: this.search.status,
      };
      return params;
    },
    plateCodeAndColor(row) {
      return this.$filter.plateCodeColor(row.carPlateColor);
    },
    checked(alarms) {
      this.search.alarmTypes = alarms.join(",");
    },
    statusFun(row) {
      return this.$filter.alarmTp(parseInt(row.status));
    }
  },
  mounted() {
    this.load();
  }
};
</script>
<style lang="scss">

</style>