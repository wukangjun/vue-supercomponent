<template>
    <transition name="fadeTop">
        <el-form inline  style="width:100%;position:absolute;height:50px;background-color: rgba(0, 0, 0, 0.7);z-index:2;padding:8px;box-sizing:border-box;" v-show="isShow">
            <el-form-item>
                <el-input @click.native="selectVeh" v-model="selectedVehicle.plateCode" size="small" style="width:100px;font-size:14px" placeholder="车辆选择" readonly></el-input>
            </el-form-item>
            <el-form-item>
                <el-date-picker :clearable="false" :editable="false" v-model="timeVal" size="small" type="datetimerange" :placeholder="$t('请选择起始时间')" :picker-options="pickerOption" style="width:330px">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-select size="small" v-model="selectVal" style="width:120px;">
                    <el-option v-for="item in list" :label="item.label" :value="item.value" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="float:right;">
                <el-button type="primary" size="small" style="font-size:14px;" @click="screenFull">
                    <i :class="['fullBtn', screenFullSize?'el-icon-tsp-fullscreen-exit':'el-icon-tsp-fullscreen']"></i>
                </el-button>
            </el-form-item>
            <el-form-item style="float:right;">
                <el-button size='small' type="primary" :loading="btnFlag.flag" @click="search" style="font-size:14px;" icon="search">查询</el-button>
            </el-form-item>
        </el-form>
    </transition>
</template>

<script>
export default {
  components: {},
  props: {
    selectedVehicle: {
      default() {
        return {
          plateCode: "",
          vehicleId: ""
        };
      }
    },
    btnFlag: {
      default() {
        return {
          flag: false
        };
      }
    },
    screenFullSize: {
      default: false
    },
    topBarData: {}
  },
  mixins: [""],
  data() {
    return {
      isShow: false,
      list: [{ label: "关键点轨迹", value: false }, { label: "完整轨迹", value: true }],
      selectVal: false,
      timeVal: [
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd start")
        ),
        this.$filter.timeStamp(
          this.$filter.format(new Date(), "yyyy-MM-dd HH:mm:ss")
        )
      ],
      autoF: false,
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  methods: {
    //全屏
    screenFull() {
      this.$emit("isScreenFull");
    },
    //选择车辆，切换树
    selectVeh() {
      this.toggleTree();
    },
    //搜索
    search() {
      if (!this.selectedVehicle.id) {
        this.$message.warning("请选择车辆");
        return false;
      }
      let st = this.$filter.timeStamp(
          this.$filter.format(this.timeVal[0], "yyyy-MM-dd HH:mm:ss")
        ),
        et = this.$filter.timeStamp(
          this.$filter.format(this.timeVal[1], "yyyy-MM-dd HH:mm:ss")
        );
      if (et - st > 6 * 86400000) {
        this.$message.warning("查询时间不能超过7天");
        return false;
      }
      let params = {
        startTime: this.$filter.format(this.timeVal[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: this.$filter.format(this.timeVal[1], "yyyy-MM-dd HH:mm:ss"),
        isAllLocations: this.selectVal
      };
      this.$emit("trackSearch", params);
    },
    // 双向开启树
    toggleTree() {
      const flag = this.$store.getters.isToggleHistoryTree;
      this.$store.dispatch("isToggleHistoryTree", !flag);
      !flag && this.$store.dispatch("isTogglePanelList", true);
    }
  },
  mounted() {
    this.isShow = true;
    if (this.$route.query.id) {
      let params = {
        startTime: this.$filter.format(this.timeVal[0], "yyyy-MM-dd HH:mm:ss"),
        endTime: this.$filter.format(this.timeVal[1], "yyyy-MM-dd HH:mm:ss"),
        isAllLocations: this.selectVal
      };
      this.$emit("childToFather", params);
    }
  }
};
</script>

<style lang="scss">
@keyframes fadeTop {
  0% {
    top: -50px;
  }
  100% {
    top: 0;
  }
}
.fadeTop-enter-active {
  animation: fadeTop 1s;
}
.fadeTop-leave-active {
  animation: fadeTop 1s reverse;
}
</style>
