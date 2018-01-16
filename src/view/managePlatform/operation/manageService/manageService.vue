<template>
<div class="carFactory">
  <cv-tool :name="$route.name" :data="$store.getters.manageMenus" :is-modify="false" :is-remove="false" :is-export="false" :is-search="false" @add="add"></cv-tool>
  <cv-grid :options="grid.options" @load="load(false)">
    <el-table border stripe :data="grid.table" v-loading="grid.loading" ref="table">
      <el-table-column label="809服务名称" :show-overflow-tooltip="true" prop="name"></el-table-column>
      <el-table-column label="809服务IP" :show-overflow-tooltip="true" prop="ip"></el-table-column>
      <el-table-column label="809服务端口" :show-overflow-tooltip="true" prop="portStr"></el-table-column>
      <el-table-column label="自动重连" :show-overflow-tooltip="true" prop="autoReconn" :formatter="isType"></el-table-column>
      <el-table-column label="自动连接" :show-overflow-tooltip="true" prop="autoConn" :formatter="isTypeS"></el-table-column>
      <el-table-column :label="$t('UserManage.operation')">
        <template scope="scope">
						<cv-span type="success" @click.native="modify(scope)">{{$t('power.modify')}}</cv-span>
						<cv-span type="danger"  @click.native="remove(scope)">{{$t('power.remove')}}</cv-span>
                        <cv-span type="success"  @click.native="see(scope)">{{'查看'}}</cv-span>
</template>
				</el-table-column>
			</el-table>
		</cv-grid>
	
		<el-dialog :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
			<component :is="dialog.name" :options="dialog" @confirm="load(true)"></component>
		</el-dialog>
	</div>
</template>
<script>
import add from "./add.vue";
import modify from "./modify.vue";
import bind from "./bind.vue";
import common from "@/utils/mixins/common";
export default {
  components: {
    add,
    bind,
    modify
  },
  mixins: [common],
  data() {
    return {
      grid: {
        options: {
          current: 1,
          size: 10,
          total: 0,
          flag: false
        },
        table: [],
        loading: false,
        selectedData: []
      },
      dialog: {
        flag: false,
        title: "--",
        size: "dialog-small",
        name: "search",
        search: {
          title: "",
          menuType: "",
          id: ""
        },
        modifyData: {
          ip: "",
          portStr: "",
          name: "",
          autoReconn: "",
          autoConn: '',
          eznPort: "",
          id: ""
        },
        bind: {
          id: ''
        }
      }
    };
  },
  methods: {
    dataList() {
      let params = {
        current: this.grid.options.current,
        size: this.grid.options.size
      };
      this.grid.loading = true;
      this.$http({
          url: this.$COMMON.baseUrl + "/serviceManagement/findEznServicePage",
          params: params
        })
        .then(data => {
          if (data.flag && data.data.length != 0) {
            this.grid.table = data.data.records;
            this.grid.options.total = data.data.total;
          } else {
            this.grid.table = [];
            this.grid.options.total = 0;
          }
          this.grid.loading = false;
        })
        .catch(error => {
          this.grid.loading = false;
        });
    },
    load(flag) {
      if (flag) {
        this.grid.options.flag = true;
        this.grid.options.current = 1;
      } else {
        this.grid.options.flag = false;
      }
      this.dataList();
    },
    //打开添加弹框
    add(val) {
      this.dialog.size = "dialog-small";
      this.dialog.name = val.name;
      this.dialog.title = val.title;
      this.dialog.flag = true;
      // this.dialog.isModify = false;
    },
    see(scope) {
      this.dialog.size = "dialog-small";
      this.dialog.name = "bind";
      this.dialog.title = "查看";
      this.dialog.flag = true;
      this.dialog.bind.id = scope.row.id;
    },
    //是否自动连接
    isType(row) {
      switch (row.autoReconn) {
        case 0:
          return "否";
          break;
        case 1:
          return "是";
          break;
      }
    },
    isTypeS(row) {
      switch (row.autoConn) {
        case 0:
          return "否";
          break;
        case 1:
          return "是";
          break;
      }

    },
    //打开搜索
    search(val) {
      this.dialog.flag = true;
      this.dialog.title = val.title;
      this.dialog.name = val.name;
      this.dialog.size = "dialog-tiny";
    },
    //删除单条数据
    remove(scope) {
      let params = {
        id: scope.row.id
      };
      this.$http({
        url: this.$COMMON.baseUrl + "/serviceManagement/delectEznServiceInfo",
        params: params
      }).then(data => {
        if (!data.flag && !!data.errorCode) {
          // this.$notify.error({message: this.$t("error."+data.errorCode)});
          this.$message.error({
            message: this.$t("error." + data.errorCode)
          });
        } else {
          this.load();
          // this.$notify.success(this.$t('action.removeSuccess'));
          this.$message.success("删除成功");
        }
      });
    },
    //打开修改弹框
    modify(scope) {
      this.dialog.size = "dialog-small";
      this.dialog.name = "modify";
      this.dialog.title = this.$t("power.modify");
      this.dialog.flag = true;
      this.dialog.modifyData.id = scope.row.id;
      this.dialog.modifyData.ip = scope.row.ip;
      this.dialog.modifyData.portStr = scope.row.portStr;
      this.dialog.modifyData.name = scope.row.name;
      this.dialog.modifyData.eznPort = scope.row.eznPort;
      this.dialog.modifyData.autoReconn = scope.row.autoReconn;
      this.dialog.modifyData.autoConn = scope.row.autoConn
    }
  },
  mounted() {
    this.dataList();
  }
};
</script>
<style lang="scss">
.table-expand {
  .el-form-item {
    margin-bottom: 0;
    .el-form-item__label {
      font-size: 12px;
      color: #99a9bf;
    }
    .el-form-item__content {
      vertical-align: initial;
    }
  }
}
</style>





