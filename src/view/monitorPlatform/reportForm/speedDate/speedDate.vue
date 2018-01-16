<template>
    <div class='behavior'>
        <cv-header>
            <el-form-item label="日期选择:">
                <el-date-picker v-model="search.time" size="small" type="daterange" :picker-options="pickerOptions0" :clearable='false' >
                </el-date-picker>
            </el-form-item>
            <el-form-item style='float:right'>
                <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false"  @export = "down"
                :is-add='false' @search="load" style='margin:0px;'></cv-tool>
            </el-form-item>
        </cv-header>
        <cv-content>
            <cv-grid class="" :options="options" @load="load(false)"  v-loading="loading">
                <el-table border stripe :data="options.table" :max-height="$service.getAutoHeight(1,1)" ref='doubleTable' class='doubleTable'>
                    <el-table-column type="index" width="70"></el-table-column>
                    <el-table-column label="起始时间"  min-width="196" prop="startTime" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="结束时间"  min-width="196" prop="endTime" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="时长(秒)"  min-width="154" prop="keepTime" ></el-table-column>
                    <el-table-column label="里程(公里)"  min-width="154" prop="mileage" :formatter="toFixedMil"></el-table-column>
                    <el-table-column label="侧翻(秒)"  min-width="154" prop="rolloverCount" ></el-table-column>
                    <el-table-column label="超速(秒)"  min-width="154" prop="overspeedCount"></el-table-column>
                    <el-table-column label="疲劳驾驶(秒)"  min-width="153" prop="driverFatigueCount"></el-table-column>
                    <el-table-column label="碰撞(次)"  min-width="155" prop="collisionCount" ></el-table-column>
                    <el-table-column label="急加速(秒)"  min-width="155" prop="hardAccelerationCount"></el-table-column>
                    <el-table-column label="急减速(秒)"  min-width="155" prop="sharpSlowdownCount"></el-table-column>
                    <el-table-column label="急转弯(秒)"  min-width="155" prop="sharpTurnsCount"></el-table-column>
                    <el-table-column label="油耗(升)"  min-width="155" prop="roil" ></el-table-column>
                    <statistics slot="append" :data='totalCount' ref='slots'  :wid='fristWid'></statistics>
                </el-table>
            </cv-grid>
        </cv-content>
    </div>
</template>
<script>
import port from './index.js'
import statistics from './statistics.vue'
export default {
    components: {statistics},
    mixins: [port],
    data() {
        return {
            search:{
                searchTime:"",
                vehicleId:"",
                time:[
                    this.$filter.timeStamp(this.$filter.format(new Date()-1000*60*60*24, 'yyyy-MM-dd')),
                    this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd'))
                ]
            },
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            fristWid:0,
            loading:false,
            options:{
                size:10,
                total:0,
                table:[],
                loading:false,
                current: 1,
                startTime:"",
                endTime:"",
                flag:false
            },
            totalCount:{}
        }
    },
    methods: {
        load(flag){
            let par=this.getData();
            let _self=this;
            if (flag) {
                _self.options.flag = true;
                _self.options.current = 1;
            } else {
                _self.options.flag = false;
            }
            if(_self.search.vehicleId==""){
                _self.$message.warning("请选择车辆");
                return false;
            }
            if(_self.search.time==""){
                _self.$message.warning("请选择时间");
                return false;
            }
            _self.loading=true;
            _self.queryInfo({startTime:par.startTime,endTime:par.endTime,vehicleId:par.vehicleId})
            .then(item => {
                if(item.flag){
                    this.totalCount = item.data;
                }else{
                    this.totalCount ={};
                }
                return _self.queryData(par);
            })
            .then(data => {
                if(data.flag){
                    _self.options.table = data.data.records;
                    _self.options.total = data.data.total;
                    _self.options.current=data.data.current;
                }else{
                    _self.options.table =[];
                    _self.options.total =0;
                }
                _self.loading = false;
            })
        },
        toFixedMil(row){
            return row.mileage.toFixed(2);
        },
        getData(){
            let params = {
                startTime:this.$filter.format(this.search.time[0],'yyyy-MM-dd'),
                endTime:this.$filter.format(this.search.time[1],'yyyy-MM-dd'),
                vehicleId:this.search.vehicleId,
                size:this.options.size,
                current:this.options.current,
                queryType: "O"
            };
            this.options.startTime=params.startTime;
            this.options.endTime=params.endTime;
            return params;
        },
        down(){
            if(this.search.vehicleId==""){
                this.$message.warning("请选择车辆");
                return false;
            }
            if(this.search.time==""){
                this.$message.warning("请选择时间");
                return false;
            }
            const exportUrl = this.$service.winParams(
                this.$COMMON.baseUrl + "/report/exportVehicleTravelDetailListInfo",{
                startTime:this.$filter.format(this.search.time[0],'yyyy-MM-dd'),
                endTime:this.$filter.format(this.search.time[1],'yyyy-MM-dd'),
                vehicleId:this.search.vehicleId,
            })
            window.location.href = exportUrl;
        }
    },
    watch:{
        '$store.getters.ptSingleCar'(newVal) {
            this.search.vehicleId=newVal.id;
        }
    },
    mounted(){
        let wid=this.$refs['doubleTable'].bodyWidth;
        let tableArry=this.$refs['doubleTable'].columns;
        let self=this.$refs['slots'].$el;
        this.$myJq.css(self,"width",wid);
        this.fristWid=tableArry[0].realWidth+tableArry[1].realWidth+tableArry[2].realWidth;
        
    }

}
</script>
<style lang="scss">
.behavior{
}
</style>