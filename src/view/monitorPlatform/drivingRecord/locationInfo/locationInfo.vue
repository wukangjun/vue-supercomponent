<template>
    <div class="location">
        <cv-header>
            <el-form-item label="起始时间:">
                <el-date-picker class="picker" v-model="time" :picker-options='pickerOptions0'  :clearable="false " :editable="false" type="datetimerange"  placeholder="选择时间范围" prop='time'></el-date-picker>
            </el-form-item>
            <el-form-item style="float:right;">
                <cv-tool style="margin:0;" :name="$route.name" :data="$store.getters.monitorMenu" class="cv-tool" :is-export="false" :is-remove="false" :is-add="false" :is-modify="false" @search="search"></cv-tool>
            </el-form-item>
        </cv-header>
        <div wrap-class="heightStyle" :class="['cv-content', $store.getters.isToggleTree?'isToggleContent':'']">
            <component :is="$store.getters.mapName" id="locationInfo" class="locationMap"></component>
            <!-- <baidu-map id="" class=""></baidu-map> -->
            <cv-grid class="timeList" :options="options" v-loading="loading">
                <el-table border stripe :data="options.table"  ref='list' max-height="285" highlight-current-row @current-change="changeTime">
                    <el-table-column label="选择时间 "  min-width="150" align='center' prop="time" :show-overflow-tooltip="true"></el-table-column>
               </el-table>
            </cv-grid>
            <cv-grid class="locationInfoList" :options="infoList.options" v-loading="infoList.loading">
                <el-table border stripe :data="infoList.options.table"  ref='list' max-height="285"  highlight-current-row @current-change="mapAddPoint">
                    <el-table-column label="时间"  min-width="150" align='center' prop="number" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="速度(km/h)"  min-width="150" align='center' prop="speed" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="经度"  min-width="150" align='center' prop="longitude" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="纬度"  min-width="150" align='center' prop="latitude" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="海拔(m)"  min-width="150" align='center' prop="elevation" :show-overflow-tooltip="true"></el-table-column>
               </el-table>
            </cv-grid>
        </div>
    </div>
</template>
<script>
import port from "./index.js";
export default {
    components: {},
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
            plateCode:'',
            addPoint:null,
            loading:false,
            options:{
                table:[]
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
        //搜索
        search(){
            let params = this.getData();
            this.clearMap();
            this.infoList.options.table=[];
            this.options.table = [];
            if(params){
                this.loading=true;
                this.getTrackPoint(params);
                this.queryTime(params).then(item => {
                    if(item.flag){
                        this.options.table = item.data;
                    }else{
                        this.options.table = [];
                    }
                    this.loading=false;
                });
            }
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
                vehicleId:this.vehicleId
            };
            return params;
        },
        //获取轨迹所有经纬度
        getTrackPoint(params){
            let _data=params;
            _data.mapType=this.$store.getters.mapType;
            this.queryTrack(_data).then(item => {
                if(item.flag){
                    (this.$service.isArray(item.data) && item.data.length > 0) && this.mapAddLine(item.data);
                }
            });
        },
        //地图添加轨迹线
        mapAddLine(data){
            let points=[];
            data.forEach(val => {
                if(val.longitude!='无效'){
                    points.push({ lng: val.mapLongitude, lat: val.mapLatitude });
                }
            });
            this.allLineOne = this.$map["locationInfo"].mapAddline(points, {
                strokeWeight:3,
                // strokeColor: "blue"
            });
        },
        //添加选中的point点
        mapAddPoint(row){
            let item = {
                plateCode: this.plateCode,
                vehicleStatus: 1,
                locationDesc: row.locationDesc,
            };
            if(this.addPoint){
                this.$map["locationInfo"].removeOverlay(this.addPoint);
            }
            this.addPoint  = this.$map["locationInfo"].mapAddpoint({
                    longitude: Number(row.longitude),
                    latitude: Number(row.latitude)
                },this.$filter.isOnline(item),{ width: 36, height: 36 }
            );
            this.$map["locationInfo"].addOverlay(this.addPoint);
            this.$map["locationInfo"].addEventListener(this.addPoint,"click", () => {
                this.openInfo(row,this.addPoint);
            });
            this.openInfo(row,this.addPoint);
        },
        openInfo(item,point) {
            let viewBox;
            let context = `<div><div><span style='color: #333;font-weight: bold;'>车牌号码:</span>${this.plateCode}</div>`+
            `<div><span class='titleName'>所属公司:</span>${item.enterpriseName}</span></div>`+
            `<div><span><span class='titleName'>时间:</span>${item.number}分</span></div>`+
            `<div><span ><span class='titleName'>海拔:</span>${item.elevation}(m)</span></div>`+
            `<div><span class='titleName'>位置信息:</span><span>${item.address} </span></div></div>`;
            this.infoMarker = this.$map["locationInfo"].infoWindow(context, point);
            this.$map["locationInfo"].cvOpenInfoWindow(this.infoMarker, point.point);
        },
        //选择时间搜索详细列表
        changeTime(row){
            if(row){
                if(this.addPoint){
                    this.$map["locationInfo"].closeInfoWindow(this.infoMarker);
                    this.$map["locationInfo"].removeOverlay(this.addPoint);
                }
                this.infoList.loading=true;
                this.queryInfo({id:row.id,mapType:this.$store.getters.mapType}).then(data =>{
                    if(data.flag){
                        this.infoList.options.table=data.data;
                    }else{
                        this.infoList.options.table=[];
                    }
                    this.infoList.loading=false;
                });
            }
        },
        clearMap(){
            this.options.table=[];
            this.infoList.options.table=[];
            this.$map['locationInfo'].clearOverlays();
        }
    },
    watch:{
        '$store.getters.ptSingleCar'(newVal) {
            this.vehicleId=newVal.id;
            this.plateCode=newVal.plateCode;
        }
    }
};
</script>
<style lang="scss"> 
.location{
    .locationMap{
        height: 370px;
        margin-bottom: 5px;
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
