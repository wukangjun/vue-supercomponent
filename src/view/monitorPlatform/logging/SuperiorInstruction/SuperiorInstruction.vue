<template>
    <div class='behavior'>
        <cv-header>
             <el-form-item label="通信类型" prop="conntype">
                <el-input v-model.trim="search.conntype" size='small' :maxlength='10'></el-input>
            </el-form-item>
            <el-form-item label="通信内容" prop="connmsg">
                <el-input v-model.trim="search.connmsg" size='small' :maxlength='10'></el-input>
            </el-form-item>
            <el-form-item label="通信时间:">
                       <el-date-picker :editable="false" :clearable="true" v-model="search.receiveTime" size="small" type="datetimerange" placeholder="请选择时间" :picker-options="pickerOption" style="width:330px">
            </el-date-picker>
            </el-form-item>
            <el-form-item style='float:right'>
                <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false"  :is-export="false"
                :is-add='false' @search="load" style='margin:0px;'></cv-tool>
            </el-form-item>
            <!-- <div slot='bottom'>
                <el-form-item label="通信时间:">
                       <el-date-picker :editable="false" :clearable="true" v-model="search.receiveTime" size="small" type="datetimerange" placeholder="请选择时间" :picker-options="pickerOption" style="width:330px">
                </el-date-picker>
            </el-form-item> 
            </div> -->
        </cv-header>
        <cv-content :fill='true'>
            <cv-grid class="" :options="options" @load="load(false)" >
                <el-table border stripe :data="options.table" :max-height="this.$service.getAutoHeight(1)" v-loading="loading">
                    <el-table-column label="通信类型"   min-width="100" prop="conntype" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="通信时间"  min-width="100" prop="comTime" ></el-table-column>
                    <el-table-column label="通信内容"  min-width="150" prop="connmsg":show-overflow-tooltip="true"></el-table-column>
                   		<el-table-column label="操作" prop="operation" min-width="100px">
							<template scope="scope">
								<cv-span type="primary" @click.native="handleAlarm(scope.row)" >通信详细</cv-span>
							</template>
						</el-table-column>
                </el-table>
            </cv-grid>
        </cv-content>
        <el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size" class="detail">
			<component :is="dialog.name" :options="dialog"></component>
		</el-dialog>
    </div>
</template>
<script>
import port from "./index.js";
import detailsT from "./detailsT.vue"
export default {
  components: {detailsT},
  mixins: [port],
  data() {
    return {
    dialog: {
        title: "--",
        flag: false,
        name: "",
        size: "dialog-tiny",
        conntype:'',
        connmsg:'',
        comTime:''
      },
      paramsCode: {},
      search: {
        conntype: "",
        connmsg: "",
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
        conntype: this.search.conntype,
        connmsg: this.search.connmsg,
        startTime: this.$filter.format(
          this.search.receiveTime[0],
          "yyyy-MM-dd HH:mm:ss"
        ),
        endTime: this.$filter.format(
          this.search.receiveTime[1],
          "yyyy-MM-dd HH:mm:ss"
        )
      };
      this.getMonConnlogPage(params)
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
    handleAlarm(val){
        	this.dialog.size = 'dialog-small';
			this.dialog.name = "detailsT";
			this.dialog.title = "通信详细";
            this.dialog.flag = true;
            this.dialog.conntype=val.conntype;
            this.dialog.connmsg=val.connmsg;
            this.dialog.comTime=val.comTime;

    },

 
  },
  mounted() {
    this.load();
  }
};
</script>
<style lang="scss">
.detail {
  .el-dialog__body{
    padding-left:60px;
  }
}
</style>