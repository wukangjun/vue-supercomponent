<template>
	<div v-show="isShowTree" :class="['cv-public-tree',$store.getters.isToggleTree?'isToggleTree':'']">
		 <el-input :class="['input']" v-model="plateCode" placeholder="请输入车牌号" @keydown.enter.native="enterEvent" ref="input">
		 	<template slot="prepend"><cv-icon name="baobiao1"></cv-icon></template>
		</el-input>
		<cv-icon name="remove"
		:style="{'right': $store.getters.isToggleTree?'0px':'10px'}"
		style="position:absolute;top:10px;z-index:2002;cursor:pointer"
		color='#ccc'
		@click.native="removeSearch"></cv-icon>
		<div :class="['trees',isBorder?'commonBorder':'']" >
			<!-- 监控树（多选树） -->
			<el-tabs v-model="carActive">
				<el-tab-pane label="车辆选择" name="first">
					<cv-scrollbar class="carTree" v-loading="isLoading" element-loading-text="拼命加载">
						<z-tree
						ref="ztree"
						@async="returnData"
						@label="returnCar"
						@node-click="nodeClick"
            @disabled="disLabel"
						:data="carTree.checkedCar"
						:isCheck="isCheck"
						:is-show-track="false"
						:update-tree="updateTree"></z-tree>
					</cv-scrollbar>
				</el-tab-pane>
				<el-tab-pane label="车辆列表" name="second" class="carList pubList">
					<div class="searchArea">
						<div class="checkbox">
							<el-checkbox-group v-model="carList.lineList" style="display:inline-block">
								  <el-checkbox label="1">在线</el-checkbox>
  								<el-checkbox label="0">离线</el-checkbox>
							</el-checkbox-group>
  							<i class="el-icon-search searchBtn" @click="carSearchBtn"></i>
						</div>
					</div>
					<component :is="name" :double="isCheck" :data="carList"
					@currentChange="handleCurrentChange"
					@change="checkChange"
					@click="singleEvent"
					@already="already"></component>
				</el-tab-pane>
			</el-tabs>
		</div>
    <div class='toggleIcons' title='车辆树' @click="toggleTree" >
			<cv-icon :name="$store.getters.isToggleTree?'rightjiantou':'jiantou'"
			:size='20' style='vertical-align: middle;' color='rgb(161,191,223)'></cv-icon>
		</div>
	</div>
</template>

<script>
import zTree from "./base.tree.vue";
import common from "@/utils/mixins/common";
import renderContent from "./content.vue";
export default {
  components: { zTree, renderContent },
  mixins: [common],
  props: {
    showCheckbox: {
      default: false
    },
    //是否多选或单选
    isDouble: {
      default: true
    },
    isBorder: {
      default: true
    },
    //显示加载:
    isLoading: {
      default: false
    },
    limit: {
      type: Number,
      default: 200
    },
    // 大小
    size: {
      default: "small"
    },
    // 更新树信息
    updateTree: {}
  },
  data() {
    return {
      name: "",
      test: 0,
      carActive: "first",
      currentObj: {},
      icon: "arrow-down",
      plateCode: "",
      // checkbox是否显示
      isCheck: true,
      // 树是否显示
      isShowTree: false,
      // 树是否收缩
      isToggleTree: false,
      carTree: {
        loading: false,
        // 以选择的车辆数组
        carList: [],
        //添加的id
        addId: null,
        // 删除的id
        removeId: null,
        companyMess: {},
        carGroup: [],
        // 地图上勾选的车辆在车辆树中显示
        checkedCar: []
      },
      carList: {
        lineList: ["1", "0"],
        select: "0",
        lists: [],
        loading: false,
        checks: [],
        // 车辆列表的li对象
        singleItem: null,
        search: {
          onlineStatus: 2,
          current: 1,
          size: 10,
          total: 0
        }
      }
    };
  },
  methods: {
    // 收缩树
    toggleTree() {
      this.isToggleTree = !this.isToggleTree;
      this.$store.dispatch("isToggleTree", this.isToggleTree);
    },
    //删除搜索条件
    removeSearch() {
      this.plateCode = "";
    },
    // 添加车辆信息
    addVehicleList(params) {
      if (params.type === "addOne") {
        this.carTree.removeId = null;
        this.carTree.addId = [params.data];
      }
      this.carTree.carList.push(params.data);
      this.carTree.carList = this.$service.unique(this.carTree.carList, "id");
      this.$store.dispatch("ptMultiCar", this.carTree.carList);
    },
    // 删除车辆信息
    removeVehicleList(params) {
      if (params.type === "removeOne") {
        this.carTree.addId = null;
        this.carTree.removeId = [params.data];
      }
      let index = this.carTree.carList.findIndex(val => {
        return val.id == params.data.id;
      });
      this.carTree.carList.splice(index, 1);
      this.$store.dispatch("ptMultiCar", this.carTree.carList);
    },
    returnData(newVal, oldVal) {
      let array = [],
        index = false;
      newVal.forEach(val => {
        if (Number(val.type) === 3) {
          let result = { id: val.id, plateCode: val.text };
          // 安检已存在的id
          this.carTree.carList.forEach(item => {
            if (item.id == val.id) {
              return (index = true);
            }
          });
          !index && array.push(result);
          this.addVehicleList({ data: result });
        }
      });
    },
    returnCar(data, type) {
      let cars = this.filterVehicleCar(data);
      switch (type) {
        case "add":
          cars.forEach(val => {
            this.addVehicleList({ data: val });
          });
          break;
        case "remove":
          cars.forEach(val => {
            this.removeVehicleList({ data: val });
          });
          break;
      }
    },
    disLabel(){
      this.$message.error('该公司或车组下超过200辆车,不能一次性添加');
    },
    nodeClick(data) {
      if (data.type === 3) {
        let params = {
          id: data.id,
          plateCode: data.text,
          enterpriseId: data.enterpriseId
        };
        // 触发单击事件
        this.$store.dispatch("ptSingleCar", params);
      }
    },
    // 过滤得到是车辆的数据
    filterVehicleCar(vehicles) {
      let array = [];
      vehicles.forEach(val => {
        Number(val.type) === 3 &&
          array.push({ id: val.id, plateCode: val.text });
      });
      return array.length > 0 ? this.$service.unique(array, "id") : [];
    },
    // 搜索按钮点击
    carSearchBtn() {
      this.name = "";
      this.carList.loading = true;
      this.carList.name = "";
      let lineSize = this.carList.lineList.length,
        params = {};
      lineSize == 2 || lineSize == 0
        ? (this.carList.search.onlineStatus = 2)
        : (this.carList.search.onlineStatus = parseInt(
            this.carList.lineList[0]
          ));
      /* 参数处理 */
      params.onlineStatus = this.carList.search.onlineStatus;
      params.current = 1;
      params.size = this.carList.search.size;
      params.plateCode = this.plateCode;
      this.carList.loading = true;
      this.$store
        .dispatch("getVehicleListByPlate", params)
        .then(data => {
          // this.carList.name = 'pagination';
          if (data.flag && data.data.length != 0) {
            let result = data.data;
            this.carList.lists = result.records;
            this.carList.search.total = result.total;
          } else {
            this.carList.lists = [];
            this.carList.search.total = 0;
          }
          this.carList.loading = false;
        })
        .catch(_ => {
          this.carList.loading = false;
        });
      setTimeout(_ => {
        this.name = "render-content";
      }, 0);
    },
    //车辆列表搜索
    carSearch() {
      this.carList.loading = true;
      let lineSize = this.carList.lineList.length,
        params = {};
      lineSize == 2 || lineSize == 0
        ? (this.carList.search.onlineStatus = 2)
        : (this.carList.search.onlineStatus = parseInt(
            this.carList.lineList[0]
          ));
      /* 参数处理 */
      params.onlineStatus = this.carList.search.onlineStatus;
      params.current = this.carList.search.current;
      params.size = this.carList.search.size;
      params.plateCode = this.plateCode;
      this.carList.loading = true;
      this.$store
        .dispatch("getVehicleListByPlate", params)
        .then(data => {
          if (data.flag && data.length != 0) {
            let result = data.data;
            this.carList.lists = result.records;
            this.carList.search.total = result.total;
          } else {
            this.carList.lists = [];
            this.carList.search.total = 0;
          }
          this.carList.loading = false;
        })
        .catch(_ => {
          this.carList.loading = false;
        });
    },
    // 按enter直接查询
    enterEvent() {
      this.carActive = "second";
      this.carSearchBtn();
    },
    // 车辆列表搜索列表显示存在车辆
    carSearchIsExist(data) {
      this.carList.checks = [];
      if (this.carTree.carList.length > 0) {
        this.carTree.carList.forEach(list => {
          this.carList.checks.push(list.id);
          this.carList.checks = Array.from(new Set(this.carList.checks));
        });
      }
    },
    //车辆列表checked点击切换
    checkChange({ event, list }) {
      let target = event.target || event.srcElement,
        detail = { id: list.id, plateCode: list.plateCode };
      if (target.checked) {
        this.addVehicleList({ data: detail, type: "addOne" });
      } else {
        this.removeVehicleList({ data: detail, type: "removeOne" });
      }
    },
    already(check, list) {
      check.isChecked
        ? this.removeVehicleList({ data: list, type: "removeOne" })
        : this.addVehicleList({ data: list, type: "addOne" });
    },
    // 车辆列表单选事件
    singleEvent({ list, index, single }) {
      this.singleItem = single;
      let params = {
        id: list.id,
        plateCode: list.plateCode,
        enterpriseId: list.enterpriseId
      };
      single.forEach(item => {
        this.$myJq.removeClass(item, "singleBg");
      });
      this.$myJq.addClass(single[index], "singleBg");
      this.$store.dispatch("ptSingleCar", params);
    },
    handleSizeChange(val) {
      this.carList.search.size = val;
      this.carSearch();
    },
    handleCurrentChange(val) {
      this.carList.search.current = val;
      this.carSearch();
    },
    // 切换路由是否显示树-----tree
    switchShowTree(name) {
      let showTree = (flag = false) => {
        this.isShowTree = true;
        this.isCheck = flag;
      };
      switch (name) {
        case "terminalParamSet":
          return showTree();
        case "fenceSend":
          return showTree();
        case "multimediaManage":
          return showTree();
        case "alarmSearch":
          return showTree(true);
        case "blankEntry":
          return showTree();
        case "phoneBook":
          return showTree();
        case "overSpeed":
          return showTree(true);
        case "alarmHandle":
          return showTree(true);
        case "vehicleDriveOperation":
          return showTree(true);
        case "eventSendDown":
          return showTree();
        case "speedDate":
          return showTree();
        case "onceInstruction":
          return showTree();
        case "vehicleInformation":
          return showTree();
        case "transparentInfo":
          return showTree();
        case "multimediaEvents":
          return showTree();
        case "askQuestion":
          return showTree();
        case "eventReportLog":
          return showTree();
        case "vehicleTrack":
          return showTree();
        case "driverIdCollection":
          return showTree();
        case "electricCollection":
          return showTree();
        case "timeoutDriving":
          return showTree();  
        case "mediaSingleUpload":
          return showTree();  
        case "AccidentSuspect":
          return showTree();  
        case 'remoteUpdata':
        return showTree();
        case 'locationInfo':
        return showTree();
        case 'speedRecord':
        return showTree();
        case 'paramsRecord':
        return showTree();
        case 'speedStateLog':
        return showTree();
        case 'platform':
        return showTree();
        case 'superiorPlatformM':
        return showTree(true);
        default:
          this.isShowTree = false;
          break;
      }
    },
    //清除选中状态
    cancelChecked(){
      // 清除数据
        this.$store.dispatch("clearPtAllMessage");
        this.carList.checks = [];
        this.carTree.carList = [];
        // 清除勾选状态
        this.$refs["ztree"] && this.$refs["ztree"].cancelAllNodes();
        // 清除样式
        this.singleItem &&
          this.singleItem.forEach(item => {
            this.$myJq.removeClass(item, "singleBg");
          });
        this.$refs["ztree"] && this.$refs["ztree"].cancelSelectedNode();
    }
  },
  beforeMount() {
    this.switchShowTree(this.$route.name);
  },
  watch: {
    //监听选择的监视车辆的变化
    "carTree.carList": {
      handler(newVal, oldVal) {
        this.$refs["ztree"].cancelAllNodes();
        this.carSearchIsExist();
        let newArr = [];
        newVal.forEach(val => {
          newArr.push(val.id);
        });
        // 存储已存在的节点到树上
        this.carTree.checkedCar = newArr;
        this.$refs["ztree"].checkedNode(newArr);
      },
      deep: true
    },
    // 监听添加单个的节点id
    "carTree.addId"(newVal) {
      if (newVal && newVal.length > 0) {
        this.$refs["ztree"].checkedNode([newVal[0].id]);
      }
    },
    // 监听删除的节点
    "carTree.removeId"(newVal) {
      if (newVal && newVal.length > 0) {
        this.$refs["ztree"].cancelNode([newVal[0].id]);
      }
    },
    // 监听路由是否显示树
    $route(newVal) {
      this.switchShowTree(newVal.name);
      // 路由变化树重新出来
      this.isToggleTree = false;
      this.$store.dispatch("isToggleTree", this.isToggleTree);
      //如果有参数id不清除样式
      if (!newVal.query.id) {
        // 清除数据
        this.cancelChecked();
      }
    },
    // 
    carActive(newVal){
      if(!this.currentObj[newVal]){
          this.currentObj[newVal] = true;
          this.carSearchBtn();
      }
    }
  }
};
</script>

<style lang="scss">
$multiTreeW: 300px;
$multiH: 500px;
.cv-public-tree {
  width: $multiTreeW;
  background: #fff;
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
  position: absolute;
  top: 150px;
  bottom: 10px;
  z-index: 2000;
  // overflow: hidden;
  left: 0;
  transition: all 0.2s ease-in-out;
  webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  .el-input-group__prepend {
    border-radius: 0;
  }
  input {
    border-radius: 0;
  }
}
.el-tabs__content {
  position: inherit;
}
.carTree {
  width: 100%;
  bottom: 0;
  position: absolute !important;
  top: 80px;
  bottom: 0;
  .companyName {
    span {
      padding-left: 10px;
      font-size: 14px;
    }
  }
  .trackBtn {
    position: absolute;
    right: 0;
    top: 0;
    padding: 0 10px;
    &:hover {
      background: #ccc;
    }
  }
  .hide {
    display: none;
  }
  .el-tree-node__content {
    position: relative;
  }
}
.carList {
  .searchArea {
    padding-bottom: 10px;
    border-bottom: 1px solid #d1dbe5;
    .checkbox {
      margin-left: 10px;
    }
    .searchBtn {
      font-size: 18px;
      vertical-align: text-bottom;
      float: right;
      padding-right: 10px;
      cursor: pointer; 
    }
  }

}
.pubList{
.cv-treelist{
	position: absolute;
	top:125px;
	}
}
.isToggleTree {
  left: -$multiTreeW;
  transition: all 0.2s ease-in-out;
  webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

.toggleIcons {
  position: absolute;
  top: 45%;
  cursor: pointer;
  width: 15px;
  height: 60px;
  line-height: 60px;
  right: -17px;
  border: 1px solid #ccc;
  border-left: 0px;
  background: #fff;
  border-radius: 0px 7px 7px 0px;
  -moz-border-radius: 0px 7px 7px 0px;
  -webkit-border-radius: 0px 7px 7px 0px;
}
</style>
