<template>
	<div class="terminal-params-set">
		<cv-header>
			<el-form-item style="float:right;">
					<el-button icon="search" size="small" :loading="searchFlag" :disabled="disFlag" @click="search">{{this.$t('terminalParamSet.search')}}</el-button>
					<el-button icon="upload2" size="small" :loading="updateFlag" :disabled="upFlag" @click="update">{{this.$t('terminalParamSet.update')}}</el-button>
					<el-button icon="setting" size="small" :loading="setFlag" :disabled="disFlag1" @click="set">{{this.$t('terminalParamSet.set')}}</el-button>
			</el-form-item>
		</cv-header>
		<cv-content v-loading="contentLoading">
			<el-collapse>
				<el-collapse-item v-for="item in data" :title="item.categoryName" :name="item.categoryCode" :key="item.categoryCode">
					<terminalDetail :data="item.params" :options="selectItem"></terminalDetail>
				</el-collapse-item>
			</el-collapse>
		</cv-content>
	</div>
</template>
<script>
import terminalDetail from "./paramsDetail.vue";
import prot from "./index.js";
export default {
  components: {
    terminalDetail
  },
  mixins: [prot],
  data() {
    return {
      contentLoading: false,
      //面板表格数据
      grid: {
        options: {
          current: 1,
          size: 10,
          total: 0
        },
        loading: false,
        table: []
      },
      //设置时选择的数据
      selectItem: {},
      searchFlag: false, //搜索按钮loading
      updateFlag: false, //更新按钮loading
      setFlag: false, //设置按钮loading
      upFlag: true, //更新是否可用
      disFlag: true, //初始按钮是否可用
      disFlag1: true, //初始按钮是否可用
      vehicleId: "",
      trackId: "",
      timer: null,
      // activeNames: [],
      data: []
    };
  },
  methods: {
    //点击车辆树回调
    async single(val) {
      this.contentLoading = true;
      try {
        this.initData(val.id);
        const { data, flag, errorCode } = await this.terminalquery(val.id);
        flag
          ? data.length == 0
            ? (this.$message.error({ message: this.$t("error.208") }),
              (this.data = data))
            : ((this.data = data),
              (this.disFlag = false),
              (this.disFlag1 = false))
          : ((this.data = []),
            this.$message.error({ message: this.$t("error." + errorCode) }));
        // this.data.forEach(element => {
        // 	this.activeNames.push(element.categoryCode)
        // });
        this.contentLoading = false;
      } catch (e) {
        this.contentLoading = false;
      }
    },
    // 初始化配置
    initData(id) {
      this.data = [];
      this.searchFlag = false;
      this.upFlag = true;
      clearTimeout(this.setTime);
      this.setTime = null;
      this.vehicleId = id;
      this.selectItem = [];
    },
    //查询
    async search() {
      this.searchFlag = true;
      this.disFlag1 = true;
      const { data } = await this.terminalupload(this.vehicleId);
      this.trackId = data.id;
      this.timer = new Date().getTime();
      data.status == 1
        ? this.loopTrack()
        : data.status == 0
          ? ((this.searchFlag = false),
            (this.disFlag1 = false),
            this.$message.error({ message: this.$t("error.7004") }))
          : ((this.searchFlag = false),
            (this.disFlag1 = false),
            this.$message.error({
              message: this.$t("terminalParamSet.searchFalse")
            }));
    },
    //更新
    async update() {
      let transParams = [],
        params1;
      this.data.forEach(element => {
        element.params.forEach(element => {
          let obj = {};
          obj.paramValue = element.terminalParamValue;
          obj.terminalParamId = element.terminalParamId;
          transParams.push(obj);
        });
      });
      params1 = {
        vehicleId: this.vehicleId,
        params: JSON.stringify(transParams)
      };
      const { data, flag, errorCode } = await this.$http({
        url: this.$COMMON.baseUrl + "/terminalParam/update",
        data: JSON.stringify(params1)
      });
      flag
        ? this.$message.success({ message: this.$t("action.updateSuccess") })
        : this.$message.error({ message: this.$t("error." + errorCode) });
    },
    //设置
    async set() {
      let params = [],
        param;
      for (let key in this.selectItem) {
        let arr = this.selectItem[key];
        arr.forEach(ele => {
          // console.log(ele)
          let obj = {};
          obj.paramValue = ele.paramValue;
          obj.terminalParamId = ele.terminalParamId;
          obj.terminalParam = { dataType: ele.dataType };
          params.push(obj);
        });
      }
      if (params.length == 0) {
        this.$message.error({ message: this.$t("terminalParamSet.selectOne") });
      } else {
        param = {
          vehicleId: this.vehicleId,
          params: JSON.stringify(params)
        };
        // console.log(param)
        const { data, flag, errorCode } = await this.$http({
          url: this.$COMMON.baseUrl + "/terminalParam/set",
          data: JSON.stringify(param)
        });
        flag
          ? this.$message.success({ message: this.$t("action.orderSuccess") })
          : this.$message.error({ message: this.$t("error." + errorCode) });
      }
    },
    loopTrack() {
      let that = this,
        limitTime = new Date().getTime() - this.timer < 120000;
      this.trackSendFlag(this.trackId).then(data => {
        if (data.flag) {
          if (data.data.sendFlag == 1) {
            clearTimeout(this.setTime);
            this.setTime = null;
            setTimeout(_ => {
              this.queryTerminalParams(this.trackId).then(data => {
                if (data.flag) {
                  this.data.forEach(element => {
                    element.params.forEach(ele => {
                      ele.terminalParamValue =
                        data.data["paramId" + ele.terminalParamId];
                    });
                  });
                  this.$message.success({
                    message: this.$t("terminalParamSet.searchSuccess")
                  });
                  this.upFlag = false;
                  this.disFlag1 = false;
                  this.searchFlag = false;
                  this.updateFlag = false;
                  this.setFlag = false;
                } else {
                  this.$message.error({
                    message: this.$t("error." + data.errorCode)
                  });
                }
              });
            }, 2000);
          } else if (
            (data.data.sendFlag == 0 || data.data.sendFlag == 5) &&
            limitTime
          ) {
            this.setTime = setTimeout(_ => {
              this.loopTrack();
            }, 1500);
          } else {
            switch (data.sendFlag) {
              case 2:
                this.$message.success({ message: this.$t("设备不在线") });
                break;
              case 3:
                this.$message.success({ message: this.$t("失败") });
                break;
              case 4:
                this.$message.success({ message: this.$t("等待回应超时") });
                break;
              case 6:
                this.$message.success({ message: this.$t("作废") });
                break;
            }
          }
        }
      });
    }
    // 	clearTimeout(this.setTime);
    // 	this.setTime = null;
    // 	// setTimeout(_=>{
    // 	// 	that.queryTerminalParams(that.trackId).then(data=>{
    // 	// 			if (data.flag) {
    // 	// 		this.data.forEach(element => {
    // 	// 			element.params.forEach(ele => {
    // 	// 				ele.terminalParamValue = data['paramId' + ele.terminalParamId]
    // 	// 			})
    // 	// 		});
    // 	// 		console.log(this.data)
    // 	// 		that.$message.success({ message: that.$t('terminalParamSet.searchSuccess') })
    // 	// 		that.upFlag = false;
    // 	// 	} else {
    // 	// 		that.$message.error({ message: that.$t("error." + errorCode) });
    // 	// 	}
    // 	// 	that.disFlag1 = false;
    // 	// 	that.searchFlag = false;
    // 	// 	that.updateFlag = false;
    // 	// 	that.setFlag = false;
    // 	// 		console.log(data)
    // 	// 	})
    // 	// },2000)

    // 	clearTimeout(this.setTime);
    // 	this.setTime = null;
    // 	// setTimeout(_=>{
    // 	// 	that.queryTerminalParams(that.trackId).then(data=>{
    // 	// 			if (data.flag) {
    // 	// 		this.data.forEach(element => {
    // 	// 			element.params.forEach(ele => {
    // 	// 				ele.terminalParamValue = data['paramId' + ele.terminalParamId]
    // 	// 			})
    // 	// 		});
    // 	// 		console.log(this.data)
    // 	// 		that.$message.success({ message: that.$t('terminalParamSet.searchSuccess') })
    // 	// 		that.upFlag = false;
    // 	// 	} else {
    // 	// 		that.$message.error({ message: that.$t("error." + errorCode) });
    // 	// 	}
    // 	// 	that.disFlag1 = false;
    // 	// 	that.searchFlag = false;
    // 	// 	that.updateFlag = false;
    // 	// 	that.setFlag = false;
    // 	// 		console.log(data)
    // 	// 	})
    // 	// },2000)

    // 	let { data, flag, errorCode } = await this.queryTerminalParams(this.trackId);
    // 	// console.log('before')
    // 	// setTimeout(_=>{
    // 		if (flag) {
    // 			this.data.forEach(element => {
    // 				element.params.forEach(ele => {
    // 					ele.terminalParamValue = data['paramId' + ele.terminalParamId]
    // 				})
    // 			});
    // 			this.$message.success({ message: this.$t('terminalParamSet.searchSuccess') })
    // 			this.upFlag = false;
    // 		} else {
    // 			this.$message.error({ message: this.$t("error." + errorCode) });
    // 		}
    // 		this.disFlag1 = false;
    // 		this.searchFlag = false;
    // 		this.updateFlag = false;
    // 		this.setFlag = false;
    // 		console.log(this.data)
    // 		// console.log('in')
    // 	// },2000)
    // } else if((data.sendFlag == 0 || data.sendFlag == 5) && limitTime) {
    // 	this.setTime = setTimeout(_ => {
    // 		this.loopTrack();
    // 	}, 1500)
    // }else{
    // 	switch(data.sendFlag){
    // 		case 2:
    // 			this.$message.success({ message: this.$t('设备不在线') })
    // 		break;
    // 		case 3:
    // 			this.$message.success({ message: this.$t('失败') })
    // 		break;
    // 		case 4:
    // 			this.$message.success({ message: this.$t('等待回应超时') })
    // 		break;
    // 		case 6:
    // 			this.$message.success({ message: this.$t('作废') })
    // 		break;
    // 	}
    // }
  },
  watch: {
    "$store.getters.ptSingleCar"(newVal) {
      this.single(newVal);
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.single({ id: this.$route.query.id });
    }
  }
};
</script>
<style lang="scss">
.terminal-params-set {
  .paramsContent {
    // margin-top: -13px;
    // margin-left: 340px;
    position: relative;
    height: 95%;
    margin-left: 340px;
    .con {
      position: absolute;
      top: 65px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      overflow: auto; // border:1px solid #ccc;
    }
  }
  .el-collapse {
    border: none;
  }
  .el-collapse-item__header {
    border-bottom: 3px solid #dfe6ec;
  }
  .el-collapse-item__content {
    background-color: #fff;
  }
  .el-collapse-item__wrap {
    border-bottom: none;
  }
}
</style>
