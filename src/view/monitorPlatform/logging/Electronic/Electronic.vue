<template>
<div class='behavior'>
        <cv-header>
            <el-form-item label="车牌号">
                <el-input
                    v-model="search.plateCode"
                    size="small">
                </el-input>
            </el-form-item>
            <!-- <el-form-item label="起始时间">
                <el-date-picker 
                    v-model="SEtime" 
                    type="datetimerange"
                    size="small" 
                    :clearable='true'>
                </el-date-picker>
            </el-form-item> -->
            <el-form-item label="终端编码">
                <el-input
                    v-model="search.terminalCode"
                    size="small">
                </el-input>
            </el-form-item>
             <el-form-item label="运单内容">
                <el-input
                    v-model="search.ewaybillContent"
                    size="small">
                </el-input>
            </el-form-item>
            <el-form-item style='float:right;'>
                	<cv-tool
                    style='margin:0px;'
		            :name="$route.name"
                    :data="$store.getters.monitorMenu"
                    :is-add="false"
                    :is-modify="false"
                    :is-remove="false"
                    :is-export="false"
                    @search="load"></cv-tool>
            </el-form-item>
        </cv-header>
    <cv-content :fill='true'>
        <cv-grid :options="grid.options" @load="load(false)">
            <el-table border stripe :data="grid.table" :max-height="$service.getAutoHeight(1,1)" v-loading="grid.loading">
                    <el-table-column :label="$t('cE.carNumber')" min-width="100" prop="plateCode" ></el-table-column>
                    <el-table-column :label="$t('cE.carColor')" min-width="100" prop="plateColor" :formatter='plateCodeAndColor'></el-table-column>
                    <el-table-column label="终端编号"  min-width="120" prop="terminalCode" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="创建时间"  min-width="150" prop="createtimeStr" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="是否发送到监管" min-width="100" prop="issendtomon" :show-overflow-tooltip="true" :formatter='isSendTo'></el-table-column>
                    <el-table-column label="电子运单内容" min-width="150" prop="ewaybillContent" :show-overflow-tooltip="true"></el-table-column>
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
                plateCode:'',
                content:'',
                account:'',
                terminalCode:'',
                ewaybillContent:''

            },
            // SEtime: [
            //     this.$filter.timeStamp(this.$filter.format(new Date(), "yyyy-MM-dd start")),
            //     this.$filter.timeStamp(this.$filter.format(new Date(), "yyyy-MM-dd end"))
            // ], 
            // 日期配 
            // pickerOption: {
            //     disabledDate(time) {
            //         return time.getTime() > Date.now();
            //     }
            // },
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
                // startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
                // endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
                current: this.grid.options.current,
                size: this.grid.options.size,
                account:this.search.account,
                terminalCode:this.search.terminalCode,
                ewaybillContent:this.search.ewaybillContent,
                plateCode:this.search.plateCode
            };
            this.grid.loading = true;
            this.getHistoryEwaybillPage(params)
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
           plateCodeAndColor(row){
            return this.$filter.plateCodeColor(row.plateColor);
        },
           isSendTo(row){
            return this.$filter.isSendTo(row.issendtomon);
        },
        // search(){
        //     this.load();
        // },
        down() {
            if (this.SEtime != undefined) {
                let downParams = {
                    startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
                    endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
                    account:this.search.account,
                    content:this.search.content
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
.behavior {}
</style>