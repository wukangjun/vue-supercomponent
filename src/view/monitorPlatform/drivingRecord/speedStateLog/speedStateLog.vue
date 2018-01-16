<template>
    <div class="speedLog">
        <cv-header>
            <el-form-item label="起始时间:">
                <el-date-picker class="picker" v-model="time" :picker-options='pickerOptions0'  :clearable="false " :editable="false" type="datetimerange"  placeholder="选择时间范围" prop='time'></el-date-picker>
            </el-form-item>
            <el-form-item style="float:right;">
                <cv-tool style="margin:0;" :name="$route.name" :data="$store.getters.monitorMenu" class="cv-tool" :is-export="false" :is-remove="false" :is-add="false" :is-modify="false" @search="search"></cv-tool>
            </el-form-item>
        </cv-header>
        <cv-content>
            <cv-grid class="list" :options="options" v-loading="loading">
                <el-table border stripe :data="options.table" height="350">
                    <el-table-column label="车牌号 "  min-width="150" align='center' prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="所属企业 "  min-width="150" align='center' prop="enterpriseName" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="车辆分组 "  min-width="150" align='center' prop="fleetName" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="速度状态 "  min-width="150" align='center' prop="stateText" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="速度状态起始时间 "  min-width="150" align='center' prop="startTime" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="速度状态终止时间 "  min-width="150" align='center' prop="endTime" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column :label="$t('action.operation')" width='100'>
                        <template scope="scope">
                            <div class="cv-table-tool">
                                <cv-span type='success' @click.native="showEchart(scope.row)">查看详细</cv-span>
                            </div>
                        </template>
                    </el-table-column>
               </el-table>
            </cv-grid>
            <div  v-loading="echarts.loading" style='width:100%;margin-top:40px'>
                <echart name='line' class="propChart" :data="echarts.dataItem"  style="width:100%;height:240px;" ></echart>
            </div>
        </cv-content>
    </div>
</template>
<script>
import port from "./index.js";
import echart from '@/components/echart/echart.vue'
export default {
    components: {echart},
    mixins: [port],
    data() {
        return{
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            time: [
                this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd start')),
                this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd end'))	
            ],
            vehicleId:'',
            loading:false,
            options:{
                size:10,
                total:0,
                table:[],
                current: 1,
                flag:false
            },
            echarts:{
                loading:false,
                dataItem:[]
            }
        }
    },
    methods: {
        //搜索
        search(flag){
            let params = this.getData();
            if(params){
                flag ? (this.options.flag = true,this.options.current = 1): this.options.flag = false;
                this.loading=true;
                this.queryData(params).then(item => {
                    if(item.flag){
                        this.options.table = item.data.records;
                        this.options.total=item.data.total;
                    }else{
                        this.options.table = [];
                    }
                    this.loading=false;
                });
            }
        },
        func2(tar) {
            return tar.name+': ' + tar.value + "km/h";
        },
        //获取参数
        getData(){
            if(this.vehicleId==""){
                this.$message.warning("请选择车辆");
                return false;
            }
            if(!this.time[0]){
                this.$message.warning("请选择时间");
                return false;
            }
            let params={
                startTime:this.$filter.format(this.time[0],'yyyy-MM-dd HH:mm:ss'),
                endTime:this.$filter.format(this.time[1],'yyyy-MM-dd HH:mm:ss'),
                current:this.options.current,
                size:this.options.size,
                vehicleId:this.vehicleId
            };
            return params;
        },
        showEchart(row){
            this.echarts.loading=true;
            this.echarts.dataItem=[];
            this.queryEchart({gbrdId:row.gbrdId}).then(item => {
                if(item.flag){
                    let _data={
                        x:[],
                        y1:[],
                        y2:[]
                    }
                    item.data.forEach(el => {
                        _data.x.push(el.number);
                        _data.y1.push(el.recordspeed);
                        _data.y2.push(el.contrasspeed);
                    });
                    this.echarts.dataItem=_data;
                    this.getMapCarCount(_data);
                }else{
                    this.echarts.dataItem=[];
                    this.getMapCarCount([]);
                }
                this.echarts.loading=false;
            });
        },
        getMapCarCount(data) {
            let _this = this;
            let option = {
                legend: {
                    data:['记录速度','参考速度'],
                    x: 'left'
                },
                 grid: {
                    top: 30,
                    left:45,
                    right:15
                },
                tooltip: {
                    formatter(params){
                        var tar = params;
                        var txt= _this.func2(tar);
                        return txt;
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    grid: {  
                        left: '10%',  
                        bottom:'35%'  
                    }, 
                    data: data.x,
                    
                },
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series: [
                     {
                        name:'记录速度',
                        type:'line',
                        itemStyle: {
                            normal: {
                                color: 'red'
                            }
                        },
                        symbolSize:8,
                        lineStyle:{normal:{width:3}},
                        data:data.y1
                    },
                    {
                        name:'参考速度',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: 'rgb(64, 203,55)'
                            }
                        },
                        symbolSize:8,
                        lineStyle:{normal:{width:3}},
                        data:data.y2
                }]
            };
           this.echarts.dataItem=option
        },
    },
    watch:{
        '$store.getters.ptSingleCar'(newVal) {
            this.vehicleId=newVal.id;
        }
    }
};
</script>
<style lang='scss'>
.speedLog{
    .list{
        max-height: 350px;
    }
}
</style>

