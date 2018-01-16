<template>
	<div class="loaclNext1">
		<el-steps :space="780" :active="dialog.active" style="position:absolute;left:40px;top:45px;margin-right:30px">
			<el-step title="步骤 1" icon='edit' ></el-step>
			<el-step title="步骤 2" icon="upload" ></el-step>	
		</el-steps>
		<el-form :model="dialog.form" :rules="rules" ref="form" label-width="90px" style="padding:40px" v-show="!dialog.btnClick">
      <el-row>
      <el-col :span="12">
       <el-form-item :label="$t('UserManage.wellmadestarm')" prop="enterpriseName">
                      <cv-dropdown-tree  v-model="enterpriseName" :interface="$COMMON.baseUrl+'/enterprise/getEnterpriseTreeList'" style="width:300px" @label="selectEnterprise" :placeholder="$t('role.company')" ref="enterpriseNameValue"></cv-dropdown-tree>
         </el-form-item>
      </el-col>
      <el-col :span="12">
      	<el-form-item label="所属车组:">
               <cv-dropdown-tree 
                :showCheckbox="true" 
                type="2" 
                :isCheck="true" 
                :interface="$COMMON.baseUrl + '/fleet/findFleetInfoList'"   
                :enterprise-id="enterpriseId" 
                :is-fleet="true"
                @checked="checked"
               ></cv-dropdown-tree>
			</el-form-item>
      </el-col>
      <el-col :span="24">
      <cv-grid :options="grid.options"  @load="load">
			<el-table border stripe :data="grid.table" v-loading="grid.loading" :max-height='300' @selection-change="handleSelectionChange">	
        <el-table-column type="selection" width="55"> </el-table-column>		
				<el-table-column label="车牌号码" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="车组" prop="fleetName" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="联系人电话" prop="createTime"  :show-overflow-tooltip="true" ></el-table-column>	
			</el-table>
		</cv-grid>
      </el-col>
      </el-row>
			<el-form-item class=" footer1 text1">
				<el-button type="primary"  @click="closed()" class="confirm1" >取消</el-button>
				<el-button type="primary" :loading="loading" @click="nextStep" class="cancel2" >下一步</el-button>
			</el-form-item>
		</el-form>
		<div v-show="dialog.btnClick" style="margin-top:40px;margin-left:70px">
			<bind-second :data="dialog"> </bind-second>
		</div>
	</div>
</template>
<script>
import bindSecond from "./bindSecond";
import { Password, service, http, COMMON } from "@/utils";

export default {
  components: {
    bindSecond
  },
  props: {
    options: {}
  },
  // 锁车(${this.$store.getters.carCurrent.plateCode})
  data() {
    return {
      allFleets: [],
      multipleSelection: [],
      carCode: [],
      //公司名称
      enterpriseName: "",
      //多选车组的数据
      fleetList: [],
      fleetName: "",
      enterpriseId: "",
      fleetCheckID: [],
      fleetIds: [],
      next: false,
      dialog: {
        // title:`锁车(${this.$store.getters.carCurrent.plateCode})`
        flag: false,
        active: 1,
        vehicleIds: "",
        name: "",
        size: "dialog-tiny",
        btnClick: false,
        enterpriseId: "",
        form: {
          localPassword: "",
          phone: "",
          phoneWord: ""
        }
      },
      grid: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        table: [],
        loading: false
      },
      loading: false,
      rules: {
        localPassword: [
          { required: true, message: "密码不能为空", trigger: "blur,change" }
          // {pattern:/^(?!\d+$).*\d.*$/,message:this.$t("filter.type13"),trigger: 'blur,change' },
        ],
        phone: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur,change,blurClick"
          },
          {
            pattern: /^1[34578]\d{9}$/,
            message: this.$t("terminalProM.typeCorrectNum")
          }
          // { validator: this.validatePass}
          // {min:11,max:11,message: this.$filter.lanReplace(this.$t('filter.FixedLength'),{len:11})}
        ],
        phoneWord: [
          { required: true, message: "手机验证码不能为空", trigger: "blur,change" }
        ]
      }
    };
  },
  methods: {
    enterpriseId(val) {
      val = this.enterpriseId;
    },
    checked(val) {
      this.fleetList = val;
    },
    //根据公司去查表格数据请求
    load() {
      let params = {
        current: this.grid.options.current,
        size: this.grid.options.size,
        enterpriseId: this.enterpriseId
      };
      this.grid.loading = true;
      this.$http({
        url: this.$COMMON.baseUrl + "/vehicle/findVehiclePage",
        params: params
      })
        .then(data => {
          this.grid.loading = false;
          if (data.flag && data.data.length != 0) {
            this.grid.table = data.data.records;
            this.grid.options.total = data.data.total;
          } else {
            this.grid.table = [];
            this.grid.options.total = 0;
          }
        })
        .catch(error => {
          this.grid.loading = false;
        });
    },
    //根据车组去查数据
    fleetLoad() {
      let params = {
        current: this.grid.options.current,
        size: this.grid.options.size,
        fleetIds: this.$service.isContext(this.fleetList.join(","))
          ? null
          : this.fleetList.join(",")
      };
      this.grid.loading = true;
      this.$http({
        url: this.$COMMON.baseUrl + "/vehicle/queryVehicleByFleetIdforPage",
        params: params
      })
        .then(data => {
          this.grid.loading = false;
          if (data.flag && data.data.length != 0) {
            this.grid.table = data.data.records;
            this.grid.options.total = data.data.total;
          } else {
            this.grid.table = [];
            this.grid.options.total = 0;
          }
        })
        .catch(error => {
          this.grid.loading = false;
        });
    },

    //多选车辆改换车组时的数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //步骤条的显示和前进
    nextStep() {
      if(this.multipleSelection.length==0){
       this.$message('请选择车辆再进行下一步操作');
      }else{
                if (this.dialog.active++ > 3) {
        this.dialog.active = 1;
      }
      this.dialog.btnClick = true; 
      }
  
    },
    selectEnterprise({ id, enterpriseCode }) {
      this.enterpriseId = id;
    },
    closed() {
      this.options.flag = false;
    }
  },
  mounted() {},
  watch: {
    "options.flag"(newVal) {
      this.dialog.flag = newVal;
      if (!newVal) {
        this.options.name = "";
      }
    },
    enterpriseId(newVal) {
      if (newVal != "" && this.enterpriseName != "") {
        this.dialog.enterpriseId = newVal;
        this.load();
      }
    },
    //注释监听
    fleetList(newVal) {
      if (newVal != []) {
        this.fleetLoad();
      } else {
        this.load();
      }
    },
    multipleSelection(newVal) {
      this.carCode = [];
      newVal.forEach(val => {
        this.carCode.push(val.id);
      });
      this.dialog.vehicleIds = this.carCode.join(",");
    }
  }
};
</script>
<style lang="scss">
$Height: 500px;
$width: 450px;
.localNext {
  width: $width;
  overflow: hidden;
  .el-steps {
    font-size: 24px;
  }
}
.passLocal.is-required .el-form-item__label:before {
  content: "";
}

.goSet {
  text-decoration: none;
  float: right;
}

.goSet:hover {
  cursor: pointer;
}

.btn2 {
  //   color: #fff;
  //   height: 34px;
  //   width: 100px;
  //   border:none;
  //   background-color: #20a0ff;
  //   border-radius: 0;
}
.setPassword {
  cursor: pointer;
  position: relative;
  top: 35px;
}

.set .el-input-group__append {
  padding: 0;
}

.text1 {
  margin: 18px 0;
}

.confirm1 {
  width: 150px;
}

.cancel2 {
  position: relative;
  left: 300px;
  width: 150px;
}

.footer1 {
  position: relative;
  bottom: -35px;
}
.sendSmsBtn {
  position: absolute;
  right: 0px;
  height: 35px;
  line-height: 34px;
  border-radius: 3px;
  background: #2ca2fc;
  border: none;
  padding: 0 6px;
  color: #fff;
  display: inline-block;
  width: 90px;
  top: 0;
}
</style>
