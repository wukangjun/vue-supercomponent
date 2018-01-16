<template>
<div>
    <cv-header>
        <el-form-item label="车牌号码:">
            <el-input placeholder="车牌号" v-model="searchOptions.plateCode" size="small"></el-input>
        </el-form-item>
        <el-form-item label="终端编号:">
            <el-input placeholder="终端编号" v-model="searchOptions.terminalCode" size="small"></el-input>
        </el-form-item>
        <div slot='bottom'>
            <el-form-item label="上线时间:">
                <el-date-picker class="picker" v-model="time" :picker-options='pickerOptions0' :clearable="true" :editable="false" type="datetimerange" placeholder="选择时间范围" prop='time'></el-date-picker>
            </el-form-item>
            <el-form-item label="下线时间:">
                <el-date-picker class="picker" v-model="time1" :picker-options='pickerOptions0' :clearable="true" :editable="false" type="datetimerange" placeholder="选择时间范围" prop='time'></el-date-picker>
            </el-form-item>
        </div>
        <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false" @export="down" :is-add='false' @search="load" style='margin:0px;'></cv-tool>
    </cv-header>
    <cv-content :fill="true">
        <cv-grid :options="gridOptions.options" @load="load(false)">
            <el-table :data="gridOptions.table" border stripe v-loading="loading">
                <el-table-column :label="$t('cE.carNumber')" min-width="100" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column :label="$t('cE.carColor')" min-width="100" prop="plateColor"></el-table-column>
                <el-table-column label="终端编号" min-width="120" prop="terminalCode" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="上线时间" min-width="150" prop="onlineTimeStr" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="下线时间" min-width="150" prop="offTimeStr" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="下线类型" min-width="150" prop="reasonTypeName" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
        </cv-grid>
    </cv-content>
</div>
</template>

<script>
import port from './index.js'
export default {
    mixins: [port],
    data() {
        return {
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            // 搜索参数配置
            searchOptions: {
                plateCode: '',
                terminalCode: '',
                startOnlineTime: '',
                endOnlineTime: '',
                startOffTime: '',
                endOffTime: ''
            },
            loading: false,
            time: [this.$filter.timeStamp(
                    this.$filter.format(new Date()-86400000, "yyyy-MM-dd start")
                ),
                this.$filter.timeStamp(
                    this.$filter.format(new Date(), "yyyy-MM-dd end")
                )
            ],
            time1: [this.$filter.timeStamp(
                    this.$filter.format(new Date()-86400000, "yyyy-MM-dd start")
                ),
                this.$filter.timeStamp(
                    this.$filter.format(new Date(), "yyyy-MM-dd end")
                )
            ],
            // 表格参数配置
            gridOptions: {
                // 表格传入配置
                options: {
                    size: 10,
                    current: 1,
                    total: 0,
                    flag: false
                },
                table: []
            }
        }
    },
    methods: {
        load(flg) {
            if (flg) {
                this.gridOptions.options.flag = true;
                this.gridOptions.options.current = 1;
            } else {
                this.gridOptions.options.flag = false;
            }
            let _params = this.getData();
            _params.current = this.gridOptions.options.current;
            _params.size = this.gridOptions.options.size;
            this.loading = true;
            this.queryData(_params).then(data => {
                if (data.flag) {
                    this.gridOptions.table = data.data.records;
                    this.gridOptions.options.total = data.data.total;
                } else {
                    this.gridOptions.table = [];
                    this.gridOptions.options.total = 0;
                }
                this.loading = false;
            }).catch(_ => {
                this.$message.error('网络异常')
                this.loading = false
            })
        },
        plateCodeAndColor(row) {
            return this.$filter.plateCodeColor(row.plateColor);
        },
        getData() {
            let item = {};
            item = this.searchOptions;
            if (this.time.length > 0) {
                item.startOnlineTime = this.$filter.format(this.time[0], 'yyyy-MM-dd HH:mm:ss');
                item.endOnlineTime = this.$filter.format(this.time[1], 'yyyy-MM-dd HH:mm:ss');
            }
            if (this.time1.length > 0) {
                item.startOffTime = this.$filter.format(this.time1[0], 'yyyy-MM-dd HH:mm:ss');
                item.endOffTime = this.$filter.format(this.time1[1], 'yyyy-MM-dd HH:mm:ss');
            }
            return item;
        },
        down() {
            let item = {
                plateCode: this.searchOptions.plateCode,
                terminalCode: this.searchOptions.terminalCode,
            };
            if (this.time.length > 0) {
                item.startOnlineTime = this.$filter.format(this.time[0], 'yyyy-MM-dd HH:mm:ss');
                item.endOnlineTime = this.$filter.format(this.time[1], 'yyyy-MM-dd HH:mm:ss');
            }
            if (this.time1.length > 0) {
                item.startOffTime = this.$filter.format(this.time1[0], 'yyyy-MM-dd HH:mm:ss');
                item.endOffTime = this.$filter.format(this.time1[1], 'yyyy-MM-dd HH:mm:ss');
            }
            const exportUrl = this.$service.winParams(this.$COMMON.baseUrl + "/log/getVehicleOnlineLogExportList", item);
            window.location.href = exportUrl;
        }
    },
    mounted() {
        this.load();
    }
}
</script>