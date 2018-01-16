<template>
<div class="">
    <!-- 表格 -->
    <cv-grid class="" :options="grid.options" @load="load">
        <el-table border stripe :data="grid.table" v-loading="grid.loading" @row-click="rClick" :height="250">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column :label="$t('809服务IP')" prop="ip" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('809服务名称')" prop="name" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column :label="$t('809服务端口')" prop="portStr" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="自动重连" :show-overflow-tooltip="true" prop="autoReconn" :formatter="isType"></el-table-column>
            <el-table-column label="自动连接" :show-overflow-tooltip="true" prop="autoConn" :formatter="isTypeS"></el-table-column>
        </el-table>
    </cv-grid>
</div>
</template>
<script>
import prot from "./index.js";
export default {
    props: {
        options: {}
    },
    components: {},
    mixins: [prot],
    data() {
        return {
            grid: {
                options: {
                    current: 1,
                    size: 10,
                    total: 0,
                    flag: false
                },
                loading: false,
                table: []
            }
        };
    },
    methods: {
        load(flag) {
            if (flag) {
                this.grid.options.flag = true;
                this.grid.options.current = 1;
            } else {
                this.grid.options.flag = false;
            }
            let params = {
                current: this.grid.options.current,
                size: this.grid.options.size
            };
            this.grid.loading = true;
            this.findEznServicePage(params)
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
        rClick(row) {
            this.options.serviceName = row.name;
            this.options.eznId = row.id
            this.options.flag = false;
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

        }
    },
    mounted() {
        this.load(true);
    },
    watch: {
        "options.flag" (newVal) {
            if (!newVal) {
                this.options.name = "";
            }
        }
    }
};
</script>
<style lang="scss">

</style>
