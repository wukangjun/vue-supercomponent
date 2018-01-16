<template>
    <div class="treminal-params-detail">
        <!-- 表格 -->
        <cv-grid class="" :options="grid.options">
            <el-table ref="multipleTable" border stripe :data="grid.table" v-loading="grid.loading" @selection-change="selectAll">
                <el-table-column type="selection" width="50" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column :label="this.$t('terminalParamSet.paramName')" prop="name" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column :label="this.$t('terminalParamSet.serviceParam')" prop="paramValue" width="305">
                    <template scope="scope">
                        <el-input size="small" @blur="blur(scope,scope.$index)" v-model.trim="scope.row.paramValue" style="width:200px"></el-input>
                        <span v-if="(wrongArr.indexOf(scope.$index) == -1)?false:true" style="color:red" ref="span"> 格式错误!</span>
                    </template>
                </el-table-column>
                <el-table-column :label="this.$t('terminalParamSet.terminalReal')" prop="terminalParamValue" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column :label="this.$t('terminalParamSet.paramDesc')" prop="desc" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
        </cv-grid>
    </div>
</template>
<script>
export default {
    components: {

    },
    props: {
        data: {},
        options: {},
    },
    mixins: [''],
    data() {
        return {
            test: '',
            wrongArr:[],
            grid: {
                options: {
                    current: 1,
                    total: 0,
                    size: 10
                },
                table: [],
                loading: false,
            }
        }
    },
    methods: {
        selectAll(val) {
            if (val.length != 0) {
                if (this.options["param" + val[0].category]) {
                    this.options["param" + val[0].category] = val
                } else {
                    this.options["param" + val[0].category] = val
                }

            }
        },
        blur(s,i) {
            let reg = eval(s.row.regex)
            reg.test(s.row.paramValue) ? this.wrongArr.splice(this.wrongArr.indexOf(i),1) : this.wrongArr.push(i);
            // this.wrongArr.length == 0?null:this.data[].flag = true;
            // console.log(this.data)
        }
    },
    mounted() {
        this.grid.table = this.data
    }
}
</script>
<style lang="scss">
.terminal-params-detail {}
</style>
