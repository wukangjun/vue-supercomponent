<template>
    <div class="main">
        <el-form class="cv-header" :inline="true">
            <el-form-item style="float:right">
                <cv-tool 
                style="margin: 0px"
                :name="$route.name" 
                :data="$store.getters.monitorMenu"
                :is-modify="false" 
                :is-export="false" 
                :is-remove="true" 
                :is-search="false" 
                :is-senddelall="false" 
                :is-sendedit="false"
                :is-send="false"
                :is-senddown="false"
                :is-sendadd="false"
                @remove="remove"
                @sendUpdate='edit'
                @add="addFenceSend"></cv-tool>
            </el-form-item>
        </el-form>       
        <cv-content>
            <cv-grid :options="grid.options" @load="searchClickLoadGrid">
                <el-table border stripe :data="grid.table" v-loading="grid.loading" @selection-change="handleSelectionChange" ref="table" >
                    <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
                    <el-table-column :label="$t('fenceManage.ruleName')" prop="ruleName"></el-table-column>
                    <el-table-column :label="$t('fenceManage.ruleType')" prop="ruleType" :formatter="filterFenceType"></el-table-column>
                    <el-table-column :label="$t('fenceManage.remark')" prop="remark" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column :label="$t('fenceManage.options')">
                        <template scope="scope">
                            <cv-table-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="true"  @modify='updateFence(scope)'  @remove="removeFence(scope)" :is-senddown='false'></cv-table-tool>
                        </template>
                    </el-table-column>
                </el-table>
            </cv-grid>
        </cv-content>
        <el-dialog :close-on-click-modal="false" :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
            <component :is="dialog.name" :options="dialog" @confirm="loadGrid"></component>
        </el-dialog>
    </div>
</template>
<script>
import fenceAction from "./fenceAction.vue"
import port from './index.js'
import remove from './remove.vue'
export default {
    components: { fenceAction,
    remove },
    mixins: [port],
    data() {
        return {
            dialog: {
                name: 'fenceAction',
                flag: false,
                title: this.$t('fenceSend.checkFence'),
                size: 'dialog-large',
                multipleSelection: [],
                vid: 0
            },
            vehicleIds:[],
            grid: {
                options: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                table: [],
                loading: false
            },
            multipleSelection: []
        }

    },
    methods: {
        nodeClick(data) {
            this.dialog.vid = data.id;
            this.searchClickLoadGrid(data.id);          
        },
        //批量删除
        addFenceSend() {
            if (this.dialog.vid != "") {
                this.dialog.flag = true;
                this.dialog.title=this.$t('fenceSend.checkFence');
                this.dialog.sType = 2;
                this.dialog.name = 'fenceAction';
            } else {
                this.$message.warning({ message: this.$t("fenceSend.choseVehicle") });
            }
        },
        remove(){
            if (this.dialog.vid != "") {
                this.dialog.flag = true;
                this.dialog.title='删除';
                this.dialog.size="dialog-small"
                this.dialog.name = 'remove';
                  } else {
                this.$message.warning({ message: this.$t("fenceSend.choseVehicle") });
            }
        },
        searchClickLoadGrid(vid) {
            if(vid){
                this.grid.loading = true;
                let params = {
                    current: this.grid.options.current,
                    size: this.grid.options.size,
                    vehicleId: vid
                }
                this.grid.loading = true;
                this.queryrulebyvehicleIdList(params).then(data =>{
                    if (!data.flag){
                        this.$message.error({ message: this.$t("error." + data.errorCode) });
                        this.grid.table = [], this.grid.options.total = 0;
                    }else {
                       this.grid.table = data.data.records, this.grid.options.total = data.data.total;
                    }
                });
                this.grid.loading = false;
            }
        },
        //重发
        updateFence(obj) {
            var row = obj.row;
            let params = {
                fenceId: row.id,
                vehicleId: this.dialog.vid
            }
            this.updaterulebyvehicleid(params).then(data => {
                if (!data.flag && !!data.errorCode)
                    this.$message.error({ message: this.$t("error." + data.errorCode) });
                else {
                    this.loadGrid();
                    this.$message.success(this.$t('action.orderSuccess'));
                }

            });
        },
        edit(obj){
            if (this.dialog.vid != "") {
                this.dialog.flag = true;
                this.dialog.name = 'fenceAction';
                this.dialog.sType = 1;
                this.dialog.title='更新围栏';
            } else {
                this.$message.warning({ message: this.$t("fenceSend.choseVehicle") });
            }
        },
        //删除
        removeFence(obj) {
            this.$confirm(this.$t("action.confirmIsRemove"), this.$t("action.tip"), {
                confirmButtonText: this.$t('action.confirm'),
                cancelButtonText:this.$t("action.cancel"),
                type: 'warning'
            }).then(() => {
                var row = obj.row;
                let params = {
                    fenceId: row.id,
                    vehicleId: this.dialog.vid,
                    type:row.type
                }
                this.deleteFenceRuleByOrder(params).then(data => {
                    if (!data.flag && !!data.errorCode)
                        this.$message.error({ message: this.$t("error." + data.errorCode) });
                    else {
                        this.loadGrid();
                        this.$message.success(this.$t('action.orderSuccess'));
                    }

                });
            }).catch(() => {
                this.$message.info({ message:this.$t("action.cancelRemove") });
            });
        }, 
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.vehicleIds=[];
                this.multipleSelection.forEach(val => {
                this.vehicleIds.push(val.id);
            });
            console.log(this.vehicleIds+'------')
        },

        filterFenceType(row) {
            switch (row.ruleType) {
                case 1: return this.$t("common.fence.circle");
                case 2: return this.$t("common.fence.rectangle");
                case 3: return this.$t("common.fence.polygon");
                case 4: return this.$t("common.fence.line");
            }
        },
        loadGrid() {  
            this.dialog.vid && this.searchClickLoadGrid(this.dialog.vid);
        }
    },
    watch: {
        '$store.getters.ptSingleCar'(newVal){
            this.dialog.vid = newVal.id;
            this.searchClickLoadGrid(newVal.id);   
        }
    }
}
</script>

<style lang="scss" scoped>
.main {
    top: 0px;
    bottom: 0px;
}

.main .left {
    margin-right: 370px
}

.main .right {
    position: absolute;
    right: 0;
    top: 14px;
    width: 360px
}
</style>