<template>
<div >
<el-row>
    	<el-col :span="24" class="top" :data="options.bind">
				<cv-grid :options="grid.options" @load="queryList(false)">
					<el-table border stripe :data="grid.table" v-loading="grid.loading">
						<el-table-column label="协议名称" prop="protocolName" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column label="上级平台名称" prop="superiorPlatform" :show-overflow-tooltip="true"></el-table-column>
					</el-table>
				</cv-grid>
			</el-col>	
		</el-row>
	<el-row class="dialog-footer" style="margin-top:20px">
			<el-col :span="24">
				<el-button @click="options.flag=false">{{'关闭'}}</el-button>
			</el-col>
	</el-row>
</div>
</template>
<script>
import { service } from "@/utils";
export default {
  props: {
    options: {}
  },
  data() {
    return {
      grid: {
        options: {
          current: 1,
          size: 10,
          total: 0
        },
        loading: false,
        table: []
      }
    };
  },
  methods: {
    queryList() {
      let params = {
        current: this.grid.options.current,
        size: this.grid.options.size,
        id: this.options.bind.id
      };
      if (this.grid.onlineStatus != "") {
        params.onlineStatus = this.grid.onlineStatus;
      }
      this.grid.loading = true;
      this.$http({
        url:
          this.$COMMON.baseUrl +
          "/serviceManagement/findProtocolTransferGroupList",
        params: params
      }).then(data => {
        if (data.flag && data.data.length != 0) {
          this.grid.options.total = data.data.total;
          this.grid.table = data.data.records;
        } else {
          this.grid.options.total = 0;
          this.grid.table = [];
        }
        this.grid.loading = false;
      });
    }
  },
  watch: {
    "options.flag"(newVal) {
      if (!newVal) {
        this.options.name = "";
      }
    }
  },
  mounted() {
    this.queryList();
  }
};
</script>

<style lang="scss">
.vehicleG {
  .el-input,
  .select {
    width: 169px;
  }
}
</style>

