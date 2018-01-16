<template>
<div class='behavior'>
    <cv-header>
        <el-form-item label="用户" prop="enterpriseName">
            <el-input v-model="search.account" placeholder="" size="small" style="width:100px;"></el-input>
        </el-form-item>
        <el-form-item label="类型:">
            <el-select v-model="search.dataType" size='small' style="width:100px;">
                <el-option v-for="item in type" :key="item.id" :value='item.id' :label="item.name"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="模块:">
            <el-input v-model="search.operation" placeholder="" size="small" style="width:100px;"></el-input>
        </el-form-item>
        <el-form-item label="内容:">
            <el-input v-model="search.content" placeholder="" size="small" style="width:100px;"></el-input>
        </el-form-item>
        <el-form-item label="起止时间">
            <el-date-picker :editable="false" :clearable="false" v-model="SEtime" size="small" type="datetimerange" :picker-options="pickerOption" style="width:330px">
            </el-date-picker>
        </el-form-item>
        <el-form-item style='float:right'>
            <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false" @export="down" :is-add='false' @search="load" style='margin:0px;'></cv-tool>
        </el-form-item>
    </cv-header>
    <cv-content :fill='true'>
        <cv-grid :options="grid.options" @load="load(false)">
            <el-table border stripe :data="grid.table" :max-height="$service.getAutoHeight(1,1)" v-loading="grid.loading">
                <el-table-column header-align="center" align="center" label="类型" min-width="100" prop="fType" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column header-align="center" align="center" label="用户" min-width="100" prop="account" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column header-align="center" align="center" label="IP" min-width="130" prop="ipAddress" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column header-align="center" align="center" label="模块" min-width="100" prop="fOperation" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column header-align="center" align="center" label="内容" min-width="100" prop="fContext" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column header-align="center" align="center" label="时间" min-width="130" prop="fTime" :show-overflow-tooltip="true"></el-table-column>
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
      search: {
        dataType: "02",
        operation: "",
        content: "",
        account: ""
      },
      SEtime: [
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd start")
        ),
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd end")
        )
      ], // 日期配置
      type: [
        {
          id: "01",
          name: "操作日志"
        },
        {
          id: "02",
          name: "安全日志"
        },
        {
          id: "03",
          name: "系统日志"
        }
      ],
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      loading: false,
      grid: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        table: [],
        loading: false
      }
    };
  },
  methods: {
    load(flag) {
      if (flag) {
        this.grid.options.flag = true;
        this.grid.options.current = 1;
      } else {
        this.grid.options.flag = false;
      }
      let params = {
        startDate: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
        endDate: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
        current: this.grid.options.current,
        size: this.grid.options.size,
        account: this.search.account,
        type: this.search.dataType,
        content: this.search.content,
        operation: this.search.operation
      };
      this.grid.loading = true;
      this.findSysLogDetail(params)
        .then(data => {
          if (data.flag && data.data.length != 0) {
            this.grid.table = data.data.records;
            this.grid.options.total = data.data.total;
            this.grid.options.current = data.data.current;
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
    down() {
      if (this.SEtime != undefined) {
        let downParams = {
          startDate: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
          endDate: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
          account: this.search.account,
          operation: this.search.operation,
          content: this.search.content,
          type: this.search.dataType
        };
        //导出
        const outPut = this.$service.winParams(
          this.$COMMON.baseUrl + "/report/findSysLogReport",
          downParams
        );
        window.location.href = outPut;
      } else {
        this.$message.error({
          message: this.$t("请选择时间")
        });
      }
    }
  },
  mounted() {
    this.load();
  }
};
</script>

<style lang="scss">
.behavior {
}
</style>