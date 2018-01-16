<template>
<div class='inspectLog'>
    <cv-header>
        <el-form-item :label="$t('reportForm.inspectLog.msgContext')">
            <el-input v-model="search.msgContext" placeholder="" size="small" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item :label="$t('reportForm.inspectLog.SEtime')">
            <el-date-picker :editable="false" :clearable="false" v-model="SEtime" size="small" type="datetimerange" :picker-options="pickerOption" style="width:330px">
            </el-date-picker>
        </el-form-item>
        <el-form-item style='float:right'>
            <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false" :is-export="false" :is-add='false' @search="load" style='margin:0px;'></cv-tool>
        </el-form-item>
    </cv-header>
    <cv-content :fill="true">
        <cv-grid :options="grid.options" @load="load(false)">
            <el-table border stripe :data="grid.table" :max-height="$service.getAutoHeight()" v-loading="grid.loading">
                <el-table-column header-align="center" align="center" :label="$t('reportForm.inspectLog.msgContext')" min-width="100" prop="content" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column header-align="center" align="center" :label="$t('reportForm.inspectLog.answerContext')" min-width="100" prop="infoAns" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column header-align="center" align="center" :label="$t('reportForm.inspectLog.creatTime')" min-width="130" prop="cretaeTime" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column header-align="center" align="center" :label="$t('reportForm.inspectLog.responseStatus')" prop="status" min-width="100"></el-table-column>
            </el-table>
        </cv-grid>
    </cv-content>
</div>
</template>

<script>
import port from "./index.js";
export default {
    components: {},
    mixins: [port],
    data() {
        return {
            search: {
                plateCode:''
            },
            SEtime: [
                this.$filter.timeStamp(this.$filter.format(new Date(), "yyyy-MM-dd start")),
                this.$filter.timeStamp(this.$filter.format(new Date(), "yyyy-MM-dd end"))
            ], // 日期配置
            pickerOption: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            loading: false,
            grid:{
                options:{
                    current:1,
                    size:10,
                    total:0,
                    flag:false
                },
                table:[],
                loading:false
            },
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
                startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
                endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
                current: this.grid.options.current,
                size: this.grid.options.size,
                content:this.search.msgContext,
            };
            this.grid.loading = true;
            this.getDownPlatformMsgInfoPage(params)
                .then(data => {
                    if (data.flag && data.data.length != 0) {
                        this.grid.table = data.data.records;
                        this.grid.options.total = data.data.total;
                        this.grid.options.current = data.data.current;
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
        down() {
            if (this.SEtime != undefined) {
                let downParams = {
                    startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
                    endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
                    msgContext:this.search.msgContext,
                };
                //导出
                const outPut = this.$service.winParams(
                    this.$COMMON.baseUrl + "/report/findSysLogReport",
                    downParams
                );
                window.location.href = outPut;
            } else {
                this.$message.error({
                    message: this.$t("请选择时间")
                });
            }
        }
    },
    mounted() {
        this.load();
    }
};
</script>

<style lang="scss">
.inspectLog {}
</style>