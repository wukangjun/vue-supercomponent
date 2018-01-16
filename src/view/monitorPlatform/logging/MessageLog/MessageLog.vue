<template>
    <div class='behavior'>
        <cv-header>
             <el-form-item label="报文消息内容" prop="content">
                <el-input v-model.trim="search.content" size='small' :maxlength='10'></el-input>
            </el-form-item>
     
             <el-form-item label="下发对象类型" prop="type">
                  <el-select  v-model="search.objectType" size='small' style="width:330px">
                        <el-option v-for="item in stateType" :key="item.val" :value='item.val' :label="item.name"></el-option>
                    </el-select>     
            </el-form-item>
            <el-form-item style='float:right'>
                <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false"  :is-export="false"
                :is-add='false' @search="load" style='margin:0px;'></cv-tool>
            </el-form-item>
            <!-- <div slot='bottom'>
                <el-form-item label="起始时间:">
                       <el-date-picker :editable="false" :clearable="true" v-model="search.receiveTime" size="small" type="datetimerange" placeholder="请选择时间" :picker-options="pickerOption" style="width:330px">
                </el-date-picker>
            </el-form-item> -->
  
            <!-- </div> -->
        </cv-header>
        <cv-content :fill='true'>
            <cv-grid class="" :options="options" @load="load(false)" >
                <el-table border stripe :data="options.table" :max-height="this.$service.getAutoHeight(1)" v-loading="loading">
                    <el-table-column label="报文消息ID"   min-width="100" prop="messageId" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="报文消息内容"  min-width="100" prop="content" ></el-table-column>
                    <el-table-column label="创建时间"  min-width="150" prop="cTime":show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="下发对象类型"  min-width="150" prop="objectType":show-overflow-tooltip="true" :formatter="stateTypeT"></el-table-column>
                    <el-table-column label="下发报文对象ID"  min-width="100" prop="objectId" :show-overflow-tooltip="true"></el-table-column> 
                    <el-table-column label="来源平台"  min-width="100" prop="tgroupId" :show-overflow-tooltip="true"></el-table-column>                     
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
        objectType: "",
        content: "",
        // receiveTime: [
        //   this.$filter.timeStamp(
        //     this.$filter.format(
        //       new Date(new Date() - 24 * 60 * 60 * 1000),
        //       "yyyy-MM-dd start"
        //     )
        //   ),
        //   this.$filter.timeStamp(
        //     this.$filter.format(new Date(), "yyyy-MM-dd end")
        //   )
        // ]
      },

      stateType: [
        { val: "10", name: "所有" },
        { val: "0", name: "下级平台所属单一平台" },
        { val: "1", name: "当前连接的下级平台" },
        { val: "2", name: "下级平台所属单一业户" },
        { val: "3", name: "下级平台所属所有业户" },
        { val: "4", name: "下级平台所属所有平台" },
        { val: "5", name: "下级平台所属所有平台和业户" },
        { val: "6", name: "下级平台所属所有政府监管平台（含监控端）" },
        { val: "7", name: "下级平台所属所有企业监控平台" },
        { val: "8", name: "下级平台所属所有经营性企业监控平台" },
        { val: "9", name: "下级平台所属所有非经营性企业监控平台" },
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
        current:this.options.current,
        size:this.options.size,
        content: this.search.content,
        objectType: this.search.objectType
        // receiveTime: this.$filter.format(
        //   this.search.receiveTime[0],
        //   "yyyy-MM-dd HH:mm:ss"
        // ),
        // toReceiveTime: this.$filter.format(
        //   this.search.receiveTime[1],
        //   "yyyy-MM-dd HH:mm:ss"
        // )
      };
      this.paramsCode = params;
      this.getDownMessagePage(params)
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
    stateTypeT(row) {
      return this.$filter.stateType(row.objectType);
    }

  },
  mounted() {
    this.load();
  }
};
</script>
<style lang="scss">

</style>