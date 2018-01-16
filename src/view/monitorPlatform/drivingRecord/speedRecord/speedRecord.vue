<template>
    <div class="speedRecord">
        <cv-header>
            <el-form-item label="查询时间:">
                <el-date-picker :editable="false" v-model="time" size="small" type="date" :picker-options="pickerOptions0" :clearable='false'>
                </el-date-picker>
            </el-form-item>
            <el-form-item style="float:right;">
                <cv-tool style="margin:0;" :name="$route.name" :data="$store.getters.monitorMenu" class="cv-tool" :is-export="false" :is-remove="false" :is-add="false" :is-modify="false" @search="search"></cv-tool>
            </el-form-item>
        </cv-header>
        <div wrap-class="heightStyle" :class="['cv-content', $store.getters.isToggleTree?'isToggleContent':'']">
            <div  style='width:100%' v-loading="loading">
                <echart name='line' class="propChart" :data="dataItem"  style="width:100%;height:400px;"></echart>
            </div>
            <cv-grid class="timeList" :options="options" v-loading="options.loadingFlag">
                <el-table border stripe :data="options.table"  ref='list'  max-height="285"  highlight-current-row @current-change="changeTime">
                    <el-table-column label="时间"  min-width="150" align='center' prop="date" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="个数"  min-width="70" align='center' prop="s_count" :show-overflow-tooltip="true"></el-table-column>
                </el-table>
            </cv-grid>
            <cv-grid class="locationInfoList" :options="infoList.options" v-loading="infoList.loading">
                <el-table border stripe :data="infoList.options.table"  ref='list' max-height="285">
                    <el-table-column label="时间(s)"  min-width="150" align='center' prop="time"></el-table-column>
                    <el-table-column label="+0"  min-width="70" align='center' prop="s_0" ></el-table-column>
                    <el-table-column label="+1"  min-width="70" align='center' prop="s_1" ></el-table-column>
                    <el-table-column label="+2"  min-width="70" align='center' prop="s_2" ></el-table-column>
                    <el-table-column label="+3"  min-width="70" align='center' prop="s_3"></el-table-column>
                    <el-table-column label="+4"  min-width="70" align='center' prop="s_4" ></el-table-column>
                    <el-table-column label="+5"  min-width="70" align='center' prop="s_5" ></el-table-column>
                    <el-table-column label="+6"  min-width="70" align='center' prop="s_6" ></el-table-column>
                    <el-table-column label="+7"  min-width="70" align='center' prop="s_7" ></el-table-column>
                    <el-table-column label="+8"  min-width="70" align='center' prop="s_8" ></el-table-column>
                    <el-table-column label="+9"  min-width="70" align='center' prop="s_9" ></el-table-column>
               </el-table>
            </cv-grid>
        </div>
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
            time:this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd')),
            vehicleId:'',
            loading:false,
            dataItem:[],
            options:{
                table:[],
                loadingFlag:false,
            },
            infoList:{
                options:{
                    table:[]
                },
                loading:false
            }
        }
    },
    methods: {
        search(){
            let params = this.getData();
            let _self=this;
            if(params){
                this.loading=true;
                this.options.loadingFlag=true;
                this.infoList.options.table=[];
                this.options.table = [];
                this.dataItem=[];
                this.queryTime(params).then(item => {
                    if(item.flag){
                        this.options.table = item.data;
                        this.getEcharts(item.data);
                    }else{
                        this.options.table = [];
                        this.dataItem=[];
                    }
                    this.options.loadingFlag=false;
                    this.loading=false;
                });
            }
        },
        getEcharts(data){
            let _data={
                x:[],
                y:[]
            };
            data.forEach(item => {
                _data.x.push(item.date);
                _data.y.push(item.s_avg);
            });
            this.dataItem=_data;
            this.getMapCarCount(_data);
        },
        getData(){
            if(this.vehicleId==""){
                this.$message.warning("请选择车辆");
                return false;
            }
            if(!this.time){
                this.$message.warning("请选择时间");
                return false;
            }
            let params={
                searchDate:this.$filter.format(this.time,'yyyy-MM-dd'),
                vehicleId:this.vehicleId
            };
            return params;
        },
        func2(tar) {
            return tar.name+': ' + tar.value + "km/h";
        },
        getMapCarCount(data) {
            let _this = this;
            let option = {
                tooltip: {
                    formatter(params){
                        var tar = params;
                        var txt= _this.func2(tar);
                        return txt;
                    }
                },
                 grid: {
                    top:30,
                    left:45,
                    right:45
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data.x,
                    
                },
                yAxis : [
                    {
                        name : '速度(km/h)',
                        type : 'value'
                    }
                ],
                series: [{
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: 'rgb(64, 203,55)'
                        }
                    },
                    symbolSize:8,
                    lineStyle:{normal:{width:3}},
                    data:data.y
                }]
            };
           this.dataItem=option
        },
        changeTime(row){
            if(row){
                this.infoList.loading=true;
                this.queryInfo({id:row.id}).then(data =>{
                    if(data.flag){
                        this.infoList.options.table=data.data;
                    }else{
                        this.infoList.options.table=[];
                    }
                    this.infoList.loading=false;
                });
            }
        }
    },
    watch:{
        '$store.getters.ptSingleCar'(newVal) {
            this.vehicleId=newVal.id;
            this.search();
        }
    }
};
</script>
<style lang="scss"> 
.speedRecord{
    .locationMap{
        height: 500px;
        border: 1px solid #ccc;
    }
    .timeList{
        width:20%;
        float: left;

    }
    .locationInfoList{
       float: right;
       width: 79%;
    }
     .cv-content{
		position: absolute !important;
		overflow: auto;
		top: 60px;
		right: 10px;
		left: 325px;
		bottom: 10px;
		background-color:rgba(255, 255, 255, 0.98);
		transition: all .2s ease-in-out;
		.heightStyle{
			width: 100%;
			position: absolute;
			top: 0;
			bottom: 0;
		}
	}
	.isToggleContent{
		left: 25px;
		transition: all .2s ease-in-out;
	}
}
    
</style>
