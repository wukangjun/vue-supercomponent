<template>
<div class='electricCollection'>
    <cv-header>
        <el-form-item :label="$t('reportForm.electricCollection.plateCode')">
            <el-input v-model="search.plateCode" readonly size="small" style="width:100px;"></el-input>
        </el-form-item>
        <el-form-item :label="$t('reportForm.electricCollection.SEtime')">
            <el-date-picker :editable="false" :clearable="false" v-model="SEtime" size="small" type="datetimerange" :picker-options="pickerOption" style="width:330px">
            </el-date-picker>
        </el-form-item>
        <el-form-item style='float:right'>
            <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-export="false" :is-remove="false" :is-add='false' @search="load(true)" style='margin:0px;'></cv-tool>
        </el-form-item>
    </cv-header>
    <cv-content>
        <cv-grid :options="grid.options" @load="load(false)">
            <el-table border stripe :data="grid.table" :max-height="$service.getAutoHeight()" v-loading="grid.loading">
                <el-table-column header-align="center" align="center" :label="$t('reportForm.electricCollection.plateCode')" min-width="100" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column header-align="center" align="center" :label="$t('reportForm.electricCollection.enterpriseName')" min-width="100" prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column header-align="center" align="center" :label="$t('reportForm.electricCollection.collectionTime')" min-width="130" prop="recordTime" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column header-align="center" align="center" :label="$t('action.operation')" min-width="100">
                    <template scope="scope">
                        <el-button type="text" @click="lookDetail(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </cv-grid>
    </cv-content>
    <el-dialog :visible.sync="showDetail.flag" :title="showDetail.title" :custom-class="showDetail.size">
		<component :is="showDetail.name" :options="showDetail" @confirm="load"></component>
	</el-dialog>
</div>
</template>

<script>
import port from "./index.js";
import showDetail from './detailShow.vue'
export default {
    components: {
        showDetail
    },
    mixins: [port],
    data() {
        return {
            search: {
                plateCode:'',
                vehicleId:''
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
            showDetail: {
				flag: false,
				title: "采集指定记录仪的外部供电记录",
				size: "dialog-middle",
				name: "showDetail",
				orderId: '',
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
                startTime: this.$filter.format(this.SEtime[0], "yyyy-MM-dd HH:mm:ss"),
                endTime: this.$filter.format(this.SEtime[1], "yyyy-MM-dd HH:mm:ss"),
                current: this.grid.options.current,
                size: this.grid.options.size,
                vehicleId:this.search.vehicleId,
            };
            this.grid.loading = true;
            this.collectExternalPower(params)
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
        lookDetail(msg){
            this.showDetail.flag = true;
            this.showDetail.orderId = msg.orderId;
            this.showDetail.name = 'showDetail',
            this.showDetail.title = '详细信息'
        }
    },
    mounted() {
        this.load();
    },
    watch:{
        "$store.getters.ptSingleCar"(newVal) {
            this.search.vehicleId = newVal.id;
            this.search.plateCode = newVal.plateCode;
            this.load(true);
        }
    }
};
</script>

<style lang="scss">
.electricCollection {}
</style>