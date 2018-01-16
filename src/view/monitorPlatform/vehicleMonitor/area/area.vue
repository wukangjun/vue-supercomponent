<template>
    <div class='areaDiv'>
        <component :is="$store.getters.mapName" id="areaMap" class="multiMap" v-loading="loadFlag" element-loading-text="拼命加载中" style="width: 100%;height: 100%;overflow: hidden;margin:0;"></component>
        <el-card class="box-card areaCard" :body-style="{'display': disStr}">
            <div slot="header" class="clearfix textFont">
                <span style="line-height: 1;">定时定位查车</span>
                <span class="toolItem" @click="toggleSearch">
                    <cv-icon :name="isFull ?'shanglajiantou-copy':'xialajiantou'"></cv-icon>
                </span>	
            </div>
            <cv-scrollbar class="formClass" ref='searchText'>
                <el-form :model="areaForm" ref="searchForm">
                    <el-form-item label="选择时间:">
                        <el-tooltip  placement="top"  :enterable="false">
                            <div slot="content">
                                {{/NAN/ig.test(this.$filter.format(this.time[0]))?this.time[0]:$filter.format(this.time[0], 'yyyy-MM-dd HH:mm:ss')}}
                                -
                                {{/NAN/ig.test(this.$filter.format(this.time[1]))?this.time[1]:$filter.format(this.time[1], 'yyyy-MM-dd HH:mm:ss')}}
                            </div>
                            <el-date-picker class="picker" v-model="time" :picker-options='pickerOptions0'  :clearable="false" :editable="false" type="datetimerange"  placeholder="选择时间范围" prop='time'></el-date-picker>
                        </el-tooltip>
                    </el-form-item>
                </el-form>
                <div class='areaBtn'>
                    <el-button-group class="btnfloat">
                        <el-button :disabled="addOverLayFlg" @click="addOverLay">画框</el-button>
                        <el-button :disabled="cleanFlg" @click="cleanMap">重置</el-button>
                        <el-button :disabled="searchFlg" @click="searchDate">查询</el-button>
                    </el-button-group>
                </div>
            </cv-scrollbar>
            <!-- 画框生成区域 -->
            <div class='areaTag'>
                <el-tag v-for="tag in tagArry" :key="tag.name" :closable="true" :type="tag.type"  @close="handleClose(tag)" class='tag'>{{tag.name}}</el-tag>
            </div>
        </el-card>
        <!-- 信息面板 -->
        <vehicle-message style="top:0px;right:5px;" :data="vehicleData" :is-show="popover" :is-send='false'></vehicle-message>
        <!-- 下方表格组件 -->
        <scrollbar-pagination  class="track-list"  :all="allData" @position="paginationClick" :current-id="currentId"></scrollbar-pagination>
    </div>
  
</template>
<script>
    import cvIcon from '@/components/icon/icon.vue'
    import prot from "./index.js"
    import scrollbarPagination from "@/components/scrollbar-pagination/scrollbar.pagination.vue"
    import vehicleMessage from "@/components/vehicle-message/vehicle.message.vue";
    export default {
    components: {scrollbarPagination,vehicleMessage},
    mixins: [prot],
		data(){
			return{
                areaForm: {

                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now()-1000*60*60*24;
                    }
                },
                isFull:false,
                disStr:'block',
                num:0,
                countNum:2,//可以画框的数量，不能超过该数
                addOverLayFlg:false,//画框按钮是否禁止
                cleanFlg:true,//重置按钮是否禁止
                searchFlg:true,//查询按钮是否禁止
                tagArry:[],//存放画框的数组
                loadFlag:false,
                pointMarkers: {},
                vehicleData:{},
                MarkerClusterer:null,
                mapAllPoint:[],
                time: [
					this.$filter.timeStamp(this.$filter.format(new Date()-1000*60*60*24, 'yyyy-MM-dd start')),
		        	this.$filter.timeStamp(this.$filter.format(new Date()-1000*60*60*24, 'yyyy-MM-dd end'))	
                ],
                searchObj:{
                    beginTime:"",
                    endTime:"",
                    overLayObj:{}
                },
                popover: {
                    flag: false
                },
                scurrent:0,
                currentId:null,
                scrollPageData:null,
                allData:null,
                allPoint:[]
			}
		},
		methods: {	
            //收缩搜索div
            toggleSearch(){
                if(this.isFull){
                    this.isFull=false;
                    this.disStr='block';
                }else{
                    this.isFull=true;
                    this.disStr='none';
                }
            },
            //添加画框
            addOverLay(){
                this.toggleSearch();
                this.pointMarkers = {};
                let _self=this;
                this.$map["areaMap"].onclickRectangle((options) => {
                    _self.num++;
                    _self.$map["areaMap"].overlayEdit(options.overlay, false);
                    _self.tagArry.push({name:'区域'+_self.num,type:"success",options:options});
                    _self.toggleSearch();
                    _self.tagArry.length == _self.countNum && (_self.addOverLayFlg = true);
                    _self.cleanFlg = false;
                    _self.searchFlg = false;
                });
                
            },
            //重置画框和清空地图覆盖物
            cleanMap(){
                this.$map["areaMap"].clearOverlays();
                this.$map['areaMap'].markerClustererClearAll();
                this.tagArry = [];
                this.allData=[];
                this.num = 0;
                this.addOverLayFlg = false;
                this.cleanFlg = true;
                this.searchFlg = true;
            },
            //查询区域内车辆
            searchDate(){
                if(this.time[0]){
                    let _data=this.getParams();
                    if(this.$filter.timeRange(this.searchObj.beginTime,this.searchObj.endTime) > 1){
                        this.$message.warning('查询时间不能超过1天!');
                        return false;
                    }
                    this.loadFlag=true;
                    this.findAreaCar({"areaList":_data,"mapType":this.$store.getters.mapType}).then(data =>{
                        if (data.flag) {
                            if(data.data.length!=0){
                                this.cleanMap();
                                this.allData=data.data;
                                this.setOverLay(this.allData);
                                console.log(3)
                                this.loadFlag = false;
                                this.scurrent = 1;
                                this.$map["areaMap"].getBestView(this.allPoint);
                                console.log(4)
                            }else{
                                this.cleanMap();
                                this.$message.error("查询数据为空");
                                this.loadFlag=false;
                            }
                        }else{
                            this.$message.error(this.$t('error.'+data.errorCode));
                            this.cleanMap();
                            this.loadFlag = false;
                        }
                    }).catch(_=>{
                        console.log(7)
                        this.$message.error("请求错误");
                        this.cleanMap();
                        this.loadFlag = false;
                    });
                }else{
                    this.$message.warning("请选择时间!");
                }
            },
            setOverLay(data){
                data.forEach(ele => {
                    let tempPoint = {};
                    tempPoint.latitude = ele.mapLatitude;
                    tempPoint.longitude = ele.mapLongitude;
                    this.allPoint.push({lat: ele.mapLatitude,lng: ele.mapLongitude});
                    let point = this.$map["areaMap"].point(tempPoint);
                    let mapPoint = this.$map["areaMap"].mapAddpoint(tempPoint,this.$filter.isOnline(ele));
                    mapPoint.setRotation(ele.directionText);
                    mapPoint.label=this.$map['areaMap'].addLabel(mapPoint, ele.plateCode);
                    this.mapAllPoint.push(mapPoint);
                     //marker点击事件
                    this.$map['areaMap'].addEventListener(mapPoint, 'click', _ => {
                        this.popover.flag = true;
                        this.vehicleData = ele;
                        mapPoint.label.setStyle({
                            backgroundColor: "black",
                            color: "#fff"
                        });
                        this.currentId = ele.vehicleId;
                        mapPoint.setTop(true);
                        this.$map["areaMap"].moveToCenter(point, 20);
                    });
                    mapPoint.setRotation(ele.direction);
                    this.mapAllPoint.push(mapPoint);
                    this.pointMarkers[ele.vehicleId] = mapPoint;
                });

                //点聚合
                this.$map['areaMap'].markerClustererAddMarkers(this.mapAllPoint);
                this.$map["areaMap"].getBestView(this.allPoint);
            },
            getParams(){//获取搜索传参
                let dataObj = this.tagArry , str = [];
                this.searchObj.beginTime = /NAN/ig.test(this.$filter.format(this.time[0]))?this.time[0]:this.$filter.format(this.time[0], 'yyyy-MM-dd HH:mm:ss');
                this.searchObj.endTime = /NAN/ig.test(this.$filter.format(this.time[1]))?this.time[1]:this.$filter.format(this.time[1], 'yyyy-MM-dd HH:mm:ss');
                for(let areaItem of dataObj){
                    let itemObj = areaItem.options.params;
                    str.push({ "leftX": itemObj.minLat, "leftY": itemObj.minLng, "rightX": itemObj.maxLat, "rightY":itemObj.maxLng, "beginTime": this.searchObj.beginTime, "endTime":this.searchObj.endTime});
                }
                return JSON.stringify(str);
            },
            handleClose(_idx){//删除标签
                this.$map["areaMap"].removeOverlay(_idx.options.overlay);
                this.tagArry.splice(this.tagArry.indexOf(_idx), 1);
                this.tagArry.length < this.countNum && (this.addOverLayFlg = false);
                this.tagArry.length ==0 && (this.cleanFlg = true, this.searchFlg = true);
            },
            paginationClick(val) {
                let point = this.$map["areaMap"].point({
                    lat: val.mapLatitude, 
                    lng: val.mapLongitude
                });
                this.$map["areaMap"].moveToCenter(point, 20);
                this.pointMarkers[val.vehicleId].label.setStyle({
                    backgroundColor: "black",
                    color: "#fff"
                });
                this.pointMarkers[val.vehicleId].setTop(true);
                this.vehicleData = val;
                this.currentId = val.vehicleId;
                this.popover.flag = true;
            }
        },
        watch: {
            currentId(newVal, oldVal) {
            if (oldVal) {
                this.pointMarkers[oldVal].label.setStyle({
                backgroundColor: "#f8f8f8",
                color: "#666"
                });
                this.pointMarkers[oldVal].setTop(false);
            }
            }
        }
	}
</script>

<style lang="scss">
	.multiMap{
        height: 100%;
        widows: 100%;
    }
    .areaCard{
        position: absolute;
        top:10px;
        left:10px;
        width:465px;
        height: auto;
        .textFont{
            color:#333;
            font-size: 18px;
            text-align: center;
            .toolItem{
                float: right;
            }
        }
        .btnfloat{
            float: right;
        }
        .tag{
            margin:3px 5px;
        }
        .el-card__header{
            padding:10px;
        }
        .el-card__body{
            padding:10px 20px;
        }
        .el-form-item{
            margin-bottom:10px;
        }
    }
    .areaDiv .track-list {
        width: 100%;
        position: absolute;
        bottom: 0px;
    }
</style>