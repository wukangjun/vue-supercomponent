<template>
    <div class='trend'>
        <cv-header>
            <el-form-item label="查询时间">
                <el-date-picker :editable="false" v-model="searchTime" size="small" type="date" :picker-options="pickerOptions0" :clearable='false'>
                </el-date-picker>
            </el-form-item>
            <el-form-item style='float:right'>
                <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false"   :is-export = "false"
                :is-add='false' @search="load" style='margin:0px;'></cv-tool>
            </el-form-item>
        </cv-header>
        <div class="tables_conent">
            <div class="el-tabs__header">
                <div class="el-tabs__nav-wrap">
                    <div class="el-tabs__nav-scroll">
                        <div class="el-tabs__nav">
                            <div class="el-tabs__active-bar" style="width: 186px; transform: translateX(0px);" ref='tableBar'></div>
                            <div class="el-tabs__item is-active" @click="tabClick" ref='speed' name='speed'>在线车辆数量分时走势图</div>
                            <div class="el-tabs__item" @click="tabClick" ref='carSpeed' name='carSpeed'>在线车辆平均车速分时走势图</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='el-tabs__content' v-loading="loading" style='width:100%'>
                 <echart name='line' class="propChart" :data="dataItem"  style="width:100%;height:400px;" ></echart>
            </div>
        </div>
    </div>
</template>
<script>
import port from './index.js'
import echart from '@/components/echart/echart.vue'
export default {
    components: {echart},
    mixins: [port],
    data() {
        return {
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() > Date.now()-1000*60*60*24;
                }
            },
            searchTime:this.$filter.timeStamp(this.$filter.format(new Date()-1000*60*60*24, 'yyyy-MM-dd')),
            tabsName:'speed',
            echartDataSpeed:{},
            carSpeedData:{},
            dataItem:[],
            loading:false
        }
    },
    methods: {
        //单位
        func1(tar) {
            return '车辆数量('+tar.name+') : ' + tar.value + "辆";
        },
        func2(tar) {
            return '平均速度('+tar.name+') : ' + tar.value + "km/h";
        },
        load(){
            this.loading = true
            let params = {
                date:this.$filter.format( this.searchTime, 'yyyy-MM-dd')
            };
            let _this=this;
            this.queryData(params).then(data => {
                if(data.flag ){
                    _this.echartDataSpeed.x=data.data.CountX;
                    _this.echartDataSpeed.y=data.data.CountY;
                    _this.carSpeedData.x=data.data.AvgX;
                    _this.carSpeedData.y=data.data.AvgY;
                    _this.tabsName == "speed" ? _this.getMapCarCount(_this.echartDataSpeed,'车辆数量') : _this.getMapCarCount(_this.carSpeedData,'平均速度');
                    _this.loading=false;
                }else{
                    _this.$message.error(this.$t('error.'+data.errorCode));
                    _this.allDate=[];
                    _this.loading=false;
                }
                
            }).catch(_=>{
                _this.$message.error("请求错误");
                _this.allDate=[];
                _this.loading=false;
            });
             
        },
        addUNIT(ary,unit){
            var _ary = [];
            for(var i=0;i<ary.length;i++){
                _ary.push(ary[i]+unit);
            }
            return _ary;
        },
        tabClick(tar){
            let self=this.$refs['speed'];
            let _self=this.$refs['carSpeed'];
            let bar=this.$refs['tableBar'];
            if(tar.currentTarget.textContent=='在线车辆数量分时走势图'){
                this.$myJq.removeClass(_self, 'is-active');
                this.tabsName='speed';
                this.$myJq.addClass(self, 'is-active');
                this.$myJq.css(bar,"transform",' translateX(0px)');
                this.$myJq.css(bar,"width",' 186px');
                this.echartDataSpeed.x != undefined &&(this.getMapCarCount(this.echartDataSpeed,'车辆数量'));
            }else{
                this.tabsName='carSpeed';
                this.$myJq.removeClass(self, 'is-active');
                this.$myJq.addClass(_self, 'is-active');
                this.$myJq.css(bar,"transform",' translateX(186px)');
                this.$myJq.css(bar,"width",'214px');
                this.carSpeedData.x != undefined &&(this.getMapCarCount(this.carSpeedData,'平均速度'));
            }
        },
        getMapCarCount(data,name) {
            let _this = this;
            let option = {
                tooltip: {
                    formatter(params){
                        var tar = params;
                        var txt=( name=="车辆数量" ? _this.func1(tar): _this.func2(tar));
                        return txt;
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: _this.addUNIT(data.x, 'h')
                },
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series: [{
                    name: name,
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
        }
    },
    mounted() {
        this.loading=true;
        this.load()
    }
}
</script>
<style lang="scss">
    .tables_conent{
        position: absolute !important;
		overflow: hidden;
		top: 60px;
		right: 10px;
		left: 10px;
		bottom: 10px;
		background-color:rgba(255, 255, 255, 0.98);
		transition: all .2s ease-in-out;
    }
</style>