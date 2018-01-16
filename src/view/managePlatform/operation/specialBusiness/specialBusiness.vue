<template>
	<div class="vehicleType">
		<cv-tool 
		:name="$route.name"
    :data="$store.getters.manageMenus"
		:is-remove="false" 
		:is-modify="false" 
		:is-export="false"
		:is-add="false"
		:is-bind="true"
		@search="search">
		</cv-tool>
		<cv-span style="display:inline-block;position:relative;right:0;top:15px" @click.native="bind()"><el-button type="" size="small">绑定车组</el-button></cv-span>
		<cv-grid :options="grid.options" @load="carList(false)">
			<el-table border stripe :data="grid.table" v-loading="grid.loading" @selection-change="handleSelectionChange">
				  <el-table-column
      type="selection"
      width="55">
    </el-table-column>
				<el-table-column :label="$t('cE.carNumbers')" prop="plateCode" width='150'  :formatter='plateCodeAndColor' :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('dm.company')" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="终端手机号" prop="mobileCode" width='150' :show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('cE.regStatus')" prop="isLogout" :formatter="filterLogStuas"></el-table-column>
				<el-table-column :label="$t('cE.onlineStatus')" prop="onlineStatus"  :formatter="filterLineStuas"></el-table-column>
				<el-table-column :label="$t('action.operation')" width='250'>
					<template scope="scope">
						<div class="cv-table-tool">
							<!-- <cv-span type='success' @click.native="updataVehicleStatus(scope)"  v-show='scope.row.onlineStatus==1 ? true : false'>车辆下线</cv-span> -->
							<cv-span type='success' @click.native="updateCompanyT(scope)">修改公司</cv-span>
								<cv-span type='success' @click.native="updatePlateCode(scope)" v-if='(scope.row.isLogout !=null && scope.row.isLogout!="")'>{{'修改车牌号'}}</cv-span>
							<cv-span type='success' @click.native="modifyPhone(scope)" v-if='(scope.row.isLogout !=null && scope.row.isLogout!="")'>{{'修改终端SIM卡号'}}</cv-span>
						</div>
			
					</template>
				</el-table-column>
			</el-table>
		</cv-grid>
		<!-- 一级弹框 -->
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="carList(true)"></component>	
		</el-dialog>

	</div>
</template>

<script>
import search from "./search.vue";
import bind from "./bind.vue";
import updateCompany from "./updateCompany.vue";
import modifyPhone from "./modifyPhone.vue";
import modifyPlateCode from "./modifyPlateCode.vue";
import common from "@/utils/mixins/common";
export default {
  components: {
    search,
    updateCompany,
    bind,
    modifyPhone,
    modifyPlateCode
  },
  mixins: [common],
  data() {
    return {
      carS:[],
      carCode: [],
      carId: "",
      multipleSelection: [],
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
      dialog: {
        title: "--",
        flag: false,
        name: "add",
        size: "dialog-full",
        id: "",
        entId: "",
        search: {
          enterpriseName: "",
          id: "",
          plateCode: "",
          mobileCode: "",
          terminalCode: ""
          // isLogout: '',
          // useStatus: '',
          // onlineStatus: ''
        },
        bind: {
          codeS: "",
          vehicleIds:''
        },
        updateCompany: {
          enterpriseId:'',
          enterpriseName: "",
          vehicleId:'',
          id: "",
          plateCode: "",
          fleetId:'',
          mobileCode: "",
          terminalCode: ""
        },
        modifyPlateCode:{
           enterpriseId:'',
            oldPlateCode:'',
            newPlateCode:'',
            comPlateCode:''
        },
        modifyPhone: {
          oldPhoneNumber: "",
          newPhoneNumber: "",
          comPhoneNumber: "",
          vehicleId:''
        },
        dialog1: {
          flag: false,
          insterTerminal: false,
          insterMation: false,
          name: "addMation",
          size: "dialog-small",
          title: "--"
        }
      }
    };
  },
  methods: {
    carList(flag) {
      if (flag) {
        this.grid.options.flag = true;
        this.grid.options.current = 1;
      } else {
        this.grid.options.flag = false;
      }
      let params = {
        current: this.grid.options.current,
        page: this.grid.options.page,
        size: this.grid.options.size,
        //搜索框的条件
        enterpriseId: this.dialog.search.id,
        plateCode: this.dialog.search.plateCode,
        mobileCode: this.dialog.search.mobileCode,
        terminalCode: this.dialog.search.terminalCode,
        isLogout: this.dialog.search.isLogout,
        useStatus: this.dialog.search.useStatus,
        onlineStatus: this.dialog.search.onlineStatus
      };
      this.grid.loading = true;
      this.$store
        .dispatch("findVehiclePage", params)
        .then(data => {
          if (data.flag) {
            if (data.data.length != 0) {
              this.grid.table = data.data.records;
              this.grid.options.total = data.data.total;
            } else {
              this.grid.table = [];
              this.grid.options.total = 0;
            }
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
    plateCodeAndColor(row) {
      return (
        row.plateCode + "(" + this.$filter.plateCodeColor(row.plateColor) + ")"
      );
    },
    filterStuas(row) {
      return this.$filter.isStuas(row.useStatus);
    },
    filterLineStuas(row) {
      return this.$filter.isOnlineState(row.onlineStatus);
    },
    filterLogStuas(row) {
      return this.$filter.isRegisterFilter(row.isLogout);
    },
    updateCompanyT(scope) {
      this.dialog.flag = true;
      this.dialog.size = "dialog-small";
      this.dialog.name = "updateCompany";
      this.dialog.title = "修改公司";
      this.dialog.updateCompany.enterpriseId= scope.row.enterpriseId;
      this.dialog.updateCompany.vehicleId=scope.row.id;
      this.dialog.updateCompany.fleetId=scope.row.fleetId;
      this.dialog.updateCompany.enterpriseName = scope.row.enterpriseName;
      this.dialog.updateCompany.plateCode = scope.row.plateCode;
    },
    //多选车辆改换车组时的数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //修改车牌号
    updatePlateCode(scope) {
      this.dialog.flag = true;
      this.dialog.id = scope.row.id;
      this.dialog.title = "修改车牌号";
      this.dialog.name = "modifyPlateCode";
      this.dialog.size = "dialog-tiny";
      this.dialog.modifyPlateCode.vehicleId=scope.row.id;
      this.dialog.modifyPlateCode.oldPlateCode=scope.row.plateCode;
      this.dialog.modifyPlateCode.enterpriseId= scope.row.enterpriseId;

    },
    search(val) {
      this.dialog.flag = true;
      this.dialog.size = "dialog-small";
      this.dialog.name = val.name;
      this.dialog.title = val.title;
    },
    bind(val) {
      if (this.multipleSelection.length != []) {
        this.dialog.flag = true;
        this.dialog.size = "dialog-tiny";
        this.dialog.name = "bind";
        this.dialog.title = "绑定车组";
        this.dialog.bind.vehicleIds = this.carCode;
      } else {
        this.$message.error("请勾选一辆车");
      }
    },
    modifyPhone(scope) {
      this.dialog.flag = true;
      this.dialog.id = scope.row.id;
      this.dialog.title = "修改SIM卡号";
      this.dialog.name = "modifyPhone";
      this.dialog.size = "dialog-tiny";
      this.dialog.modifyPhone.vehicleId=scope.row.id;
      this.dialog.modifyPhone.oldPhoneNumber = scope.row.mobileCode;
    },
  },
  mounted() {
    this.carList();
  },
  watch: {
    'multipleSelection'(newVal) {
       this.carCode=[];
       this.carS=[];
        newVal.forEach((val) => {
          this.carCode.push(val.id);
          this.carS.push({plateCode:val.plateCode,id:val.id});
      }); 
       this.dialog.bind.vehicleIds = this.carCode;
       this.dialog.bind.codeS=this.carS;
      //  this.$service.unique(this.carCode);
     
    
    }
  }
};
</script>

<style lang="scss">
label {
  font-size: 14px !important;
}
</style>