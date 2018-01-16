<template>
    <div class='behavior'>
        <cv-header>
             <el-form-item :label="$t('cL.carNumber')" prop="plateCode">
                <el-input v-model.trim="search.plateCode" size='small' :maxlength='10'></el-input>
            </el-form-item>
     
             <el-form-item label="类型" prop="type">
                  <el-select  v-model="search.type" size='small' clearable>
                        <el-option v-for="item in stateType" :key="item.val" :value='item.val' :label="item.name"></el-option>
                    </el-select>     
            </el-form-item>
            <el-form-item style='float:right'>
                <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false"  :is-export="false"
                :is-add='false' @search="load" style='margin:0px;'></cv-tool>
            </el-form-item>
            <div slot='bottom'>
                <el-form-item label="起始时间:">
                       <el-date-picker :editable="false" :clearable="true" v-model="search.receiveTime" size="small" type="datetimerange" placeholder="请选择时间" :picker-options="pickerOption" style="width:330px">
                </el-date-picker>
            </el-form-item>
  
            </div>
        </cv-header>
        <cv-content :fill='true'>
            <cv-grid class="" :options="options" @load="load(false)" >
                <el-table border stripe :data="options.table" :max-height="this.$service.getAutoHeight(1)" v-loading="loading">
                    <el-table-column label="车牌号码"   min-width="100" prop="plateCode" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="车牌颜色"  min-width="100" prop="plateColor" :formatter='plateCodeAndColor'></el-table-column>
                    <el-table-column label="类型"  min-width="150" prop="typeText":show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="接收时间"  min-width="150" prop="receivetimeStr":show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="数据内容"  min-width="100" prop="dataStr" :show-overflow-tooltip="true"></el-table-column>                    
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
      paramsCode: {},
      search: {
        plateCode: "",
        type: "",
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
        ]
      },

      stateType: [
        { val: "0", name: "GNSS模块详细定位数据" },
        { val: "11", name: "道路运输证IC卡信息" },
        { val: "65", name: "串口1透传" },
        { val: "66", name: "串口2透传" },
        { val: "245", name: "自定义245" },
        { val: "-1", name: "用户自定义透传" }
      ],

      loading: false,
      options: {
        size: 10,
        total: 0,
        startTime: "",
        endTime: "",
        table: [],
        loading: false,
        current: 1,
        flag: false
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
    load(flag) {
      this.loading = true;
      if (flag) {
        this.options.flag = true;
        this.options.current = 1;
      } else {
        this.options.flag = false;
      }
      let params = {
        current: this.options.current,
        size: this.options.size,
        plateCode: this.search.plateCode,
        type: this.search.type,
        receiveTime: this.$filter.format(
          this.search.receiveTime[0],
          "yyyy-MM-dd HH:mm:ss"
        ),
        toReceiveTime: this.$filter.format(
          this.search.receiveTime[1],
          "yyyy-MM-dd HH:mm:ss"
        )
      };
      this.paramsCode = params;
      this.getTransparentin(params)
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

    plateCodeAndColor(row) {
      return this.$filter.plateCodeColor(row.plateColor);
    }
  },
  mounted() {
    this.load();
  }
};
</script>
<style lang="scss">

</style>