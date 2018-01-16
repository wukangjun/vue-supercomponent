<template>
    <el-row class="container">
        <el-col :span="24">
            <el-table border stripe height="300" :data="grid.table" v-loading="grid.loading" @selection-change="handleSelectionChange" ref="menuTable">
                <el-table-column type="selection"></el-table-column>
                <el-table-column :label="$t('companyManage.menuName')" prop="title">
                    <template scope="scope">
                        <cv-icon :name="scope.row.icon" style="font-size:18px;margin-top:5px"></cv-icon>
                        <span>{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column :label="$t('companyManage.menuIcon')" prop="icon" :show-overflow-tooltip="true">
                    <template scope="scope">
                        <cv-icon :name="scope.row.icon" style="font-size:26px;margin-top:5px"></cv-icon>
                    </template>
                </el-table-column> -->
            </el-table>
        </el-col>
        <el-col :span="24" class="dialog-footer" style="padding-top:20px;">
            <el-button @click="submitForm()" type="primary">{{$t('action.save')}}</el-button>
            <el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
        </el-col>
    </el-row>
</template>
<script>
import { COMMON, http } from "@/utils"
export default {
    props: {
        options: {}
    },
    data() {
        return {
            moduleForm: {
                name: '',
                icon: ''
            },
            grid: {
                table: [],
                loading: false,
            },
            tableSelection: [],
        };
    },
    methods: {
        getCompanyMenu() {
            http({
                // url: COMMON.baseUrl + '/rolemenu/findEnterpriseDefaultMenu',
                url: COMMON.baseUrl + '/rolemenu/addEnterpriseMenu',
                params: { menuType: this.options.action.type, enterpriseId: this.options.enterpriseId }
            }).then((data) => {
                if (!data.flag && !!data.errorCode) {
                    this.$message.error({ message: this.$t("error." + data.errorCode) });
                }
                else {
                    data.data.forEach((data) => {
                        this.options.selectMenuID.push(data.id);
                    });
                }
                this.loadGrid();
            });
        },
        loadGrid() {
            // debugger
            this.grid.loading = true;
            http({
                // url: COMMON.baseUrl + '/rolemenu/findEnterpriseDefaultMenu',
                url: COMMON.baseUrl + '/rolemenu/addEnterpriseMenu',
                params: { menuType: this.options.action.type, enterpriseId: this.options.menuUseEnterPriseId }
            }).then((data) => {
                if (!data.flag && !!data.errorCode) {
                    // this.$message.error({message: this.$t("error."+data.errorCode)});
                    this.grid.loading = false;
                }
                else {
                    let selectMenuID = this.options.selectMenuID;
                    let deleteArr = [];
                    let gridData = data.data;
                    if (selectMenuID.length > 0) {
                        for (let i = 0; i < selectMenuID.length; i++) {
                            this.spliceData(gridData, selectMenuID[i]);
                        }
                    }
                    this.grid.table = gridData;
                    this.grid.loading = false;
                }
            });
        },
        spliceData(data, id) {
            data.forEach((val, index) => {
                if (val.id == id) {
                    data.splice(index, 1);
                    return data;
                }
            });
            return data;
        },
        submitForm() {
            this.tableSelection.forEach(row => {
                this.options.action.data.children.push({ id: row.id, text: row.title, icon: 'edit', type: row.type, children: [] });
                this.options.selectMenuID.push(row.id);
                // console.log(this.options.selectMenuID);
            });
            this.options.flag = false;
        },
        resetForm() {
            if (this.tableSelection) {
                this.tableSelection.forEach(row => {
                    this.$refs.menuTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.menuTable.clearSelection();
            }
            this.tableSelection.length = 0;
            this.options.flag = false;
        },
        handleSelectionChange(val) {
            this.tableSelection = val;
        }
    }, watch: {
        "options.flag"(newVal) {
            if (!newVal) {
                this.options.name = "";
            }
            // console.log("selectMenuID-menuAction",this.options.selectMenuID);
        }
    },mounted(){
        this.loadGrid();   
    }
}
</script>
<style lang="sass">

</style>
