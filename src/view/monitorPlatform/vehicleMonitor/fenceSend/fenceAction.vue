<template>
    <div class="fenceSend">
        <el-row>
            <cv-tool :data="power" :is-modify="true" @search="searchfences"></cv-tool>
            <el-form :inline="true" style="float:right;margin-top: 9px;">
                <el-form-item :label="$t('fenceManage.ruleName')" prop="fenceName">
                    <el-input v-model="fence.fenceName" size="small" :placeholder="$t('placeholder.inputValue')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('fenceManage.ruleType')" prop="fenceType">
                    <el-select v-model="fence.fenceType" size="small" style="width:120px;" :placeholder="$t('placeholder.selectValue')">
                        <el-option v-for="item in fenceType" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-row>
        <cv-grid :options="grid.options" @load="searchfences(false)">
            <el-table border stripe :data="grid.table" v-loading="grid.loading" @selection-change="handleSelectionChange" ref="table">
                <el-table-column type="selection" width="47"></el-table-column>
                <el-table-column :label="$t('fenceManage.ruleName')" :show-overflow-tooltip="true" prop="ruleName"></el-table-column>
                <el-table-column :label="$t('fenceManage.ruleType')" :formatter="filterFenceType" prop="ruleType"></el-table-column>
                <el-table-column :label="$t('fenceSend.classification')" :formatter="filterType" prop="type"></el-table-column>
                <el-table-column :label="$t('fenceManage.remark')" prop="remarksss" :show-overflow-tooltip="true"></el-table-column>
    
            </el-table>
        </cv-grid>
        <el-row class='dialog-footer'>
            <el-button type="primary" @click="save">{{ $t('action.confirm') }}</el-button>
            <el-button @click='options.flag=false'>{{ $t('action.cancel') }}</el-button>
        </el-row>
    </div>
</template>
<script>
import port from './index.js'
export default {

    mixins: [port],
    props: {
        options: {

        }
    },
    data() {
        return {
            power: [],
            grid: {
                options: {
                    current: 1,
                    size: 10,
                    total: 0,
                    flag:false
                },
                table: [],
                loading: false
            },
            multipleSelection: [],
            fence: {
                fenceName: '',
                fenceType: ''
            },
            fenceType: [{ value: null, label: this.$t('action.all') }, {
                value: '1',
                label: this.$t("common.fence.circle")
            },
             {
                value: '2',
                label: this.$t("common.fence.rectangle")
            }, 
            {
                value: '3',
                label: this.$t("common.fence.polygon")
            }, {
                value: '4',
                label: this.$t("common.fence.line")
            }],
        }
    },
    methods: {
        //按条件查找数据
        searchfences(flag) {
            if(flag){
				this.grid.options.flag = true;
				this.grid.options.current = 1;
			}else{
				this.grid.options.flag = false;
			}
            this.searchClickLoadGrid();
        },
        searchClickLoadGrid() {
            let params = {
                current: this.grid.options.current,
                size: this.grid.options.size,
                ruleName: this.fence.fenceName,
                ruleType: this.fence.fenceType,
                vehicleId:this.options.vid,
                typeName:this.options.sType
                // plateCode: this.dialog.search.plateCode
            }
            this.grid.loading = true;
            this.queryFenceruleList(params).then(data => {
                if (!data.flag && !!data.errorCode) {
                    // this.$message.error({ message: this.$t("error." + data.errorCode) });
                }

                else {
                    this.grid.table = data.data.records;
                    this.grid.options.total = data.data.total;
                }
                this.grid.loading = false;

            })


        },
        handleSelectionChange(val) {
            this.options.multipleSelection = val;
            // console.log(val);
        },
        filterFenceType(row) {
            switch (row.ruleType) {
                case 1:
                    return this.$t("common.fence.circle");
                    break
                case 2:
                    return this.$t("common.fence.rectangle");
                    break
                case 3:
                    return this.$t("common.fence.polygon");
                    break
                case 4:
                    return this.$t("common.fence.line");
                    break
                default:
                    break
            }
        },
        filterType(row){
            switch (row.type) {
                case 103:
                    return "渣土";
                    break
                case 101:
                    return '部标';
                    break
            }
        },
        save() {
            var str = "";
            for (let i = 0; i < this.options.multipleSelection.length; i++) {
                str += this.options.multipleSelection[i].id;
                if (i != this.options.multipleSelection.length - 1)
                    str += ",";
            }
            if (str) {
                let params = {
                    fenceIds: str,
                    vehicleId: this.options.vid
                }
                if(this.options.title=='更新围栏'){
                    this.updataFence(params);
                }else if(this.options.title=='选择围栏'){
                    this.editFence(params);
                }
            } else {
                this.$message.error({ message: "请选择围栏"});
             }
        },
        editFence(params){
            this.sendrulebyvehicleid(params).then(data => {
                if (!data.flag && !!data.errorCode)
                    this.$message.error({ message: this.$t("error." + data.errorCode) });
                else {
                    this.$emit('confirm');
                    this.$message.success(this.$t('action.addSuccess'));
                }
                this.options.flag = false;

            });
        },
        updataFence(params){
            this.renewRuleByVehicleId(params).then(data => {
                if (!data.flag && !!data.errorCode)
                    this.$message.error(this.$t("error."+data.errorCode));
                else {
                    this.$emit('confirm');
                    this.$message.success("更新指令下发成功");
                }
                this.options.flag = false;

            });
        }
    },
    watch: {
        'options.flag'(newVal) {
            if (!newVal) {
                this.options.name = "";
            }
        }
    },
    mounted() {
        this.searchClickLoadGrid();
    }
}
</script>

<style lang="scss">
.fenceSend {
    .dialog-footer {
        margin-top: 50px;
        text-align: right;
    }
}
</style>