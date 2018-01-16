<template>
    <div class="cv-play" ref='play' :mapName='mapName' >
        <cv-icon :name="!playFlag ?'bofang':'zanting'"  ref='playBtn'  size='23' style='cursor: pointer' @click.native="trackPaly" :disabled="allData.length >0 ? false :true"></cv-icon>
        <el-slider v-model="showData" class='slider' ref='slider'  @change="changTrackIndex" :show-tooltip='false' :step='1' :disabled="allData.length >0 ? false :true" :max='allData.length > 0 ? allData.length-1 :100'></el-slider>
        <el-select v-model="playVal" placeholder="请选择" ref='playStep' size='mini' @change="changLabel" :disabled="allData.length >0 ? false :true">
            <el-option label="X1" value="1000"></el-option>
            <el-option label="X2" value="750"></el-option>
            <el-option label="X3" value="500"></el-option>
            <el-option label="X4" value="250"></el-option>
        </el-select>
    </div>
</template>
<script>
    import cvIcon from '@/components/icon/icon.vue'
    export default {
        props: {
           data: {},
           points:{},
           mapName:'',
           allPoints:[],
           selectedVehicle: {
				default() {
					return {
						plateCode: "",
						vehicleId: ""
					};
				}
			},
       },
       components: {cvIcon},
       data() {
           return {
              playFlag:false,//播放标示  
              playVal:'1000',//播放倍速
              setStepPoint:0,
              showData:0,
              allData:[],
              playSpeed:'1000',
              trackSpeed:null,
              allLinePoint:[],
              curIndex:0,
              addPoint:null,
              changSpeedFlag:false,
              infoWindowStatus:true,
           }
       },
       watch:{
            data(newVal){
                this.playFlag=false;
                this.allData=newVal;
                this.showData=0;
                this.curIndex=0;
                this.runTrack();
            },
            points(val){
                this.allLinePoint=val;
            }
       },

       methods:{ 
            trackPaly(){
                this.$store.dispatch("isToggleHistoryPanel", false);
                if(this.allData.length>0){
                    if(this.playFlag){
                        this.playFlag=false;
                        this.runTrack();
                    }else{
                        this.playFlag=true;
                        this.showData==this.allData.length-1 && (this.showData=0);
                        this.runTrack();
                    }
                     
                }
                
            },
             //轨迹运行
            runTrack(flag) {
                if (this.playFlag) {
                    if (flag) {
                        clearInterval(this.trackSpeed);
                        this.changSpeedFlag = false;
                    }
                    this.trackChage = false;
                    this.trackSpeed = setInterval(() => {
                        this.curIndex = ++this.curIndex;
                        this.showData=this.curIndex;
                        if(this.showData==this.allData.length-1||this.showData==0){
                            this.playFlag=false;
                        }
                        if(this.addPoint !=null){
                            this.$map['map'].moveToCenter([this.addPoint.point],6);
                        }
                        this.moveTrack();
                    }, parseInt(this.playSpeed));
                } else {
                    clearInterval(this.trackSpeed);
                }
            },
            moveTrack() {
                let trackNum = this.allLinePoint.length;
                if (trackNum > this.curIndex) {
                    //old 轨迹回放
                    this.generatesPoint();
                    //新轨迹回放
                    // this.$map["map"].setPosition(this.addPoint, {
                    //     lng: Number(this.allLinePoint[this.curIndex].lng),
                    //     lat: Number(this.allLinePoint[this.curIndex].lat)
                    // });
                } else {
                    this.curIndex = 0;
                    clearInterval(this.trackSpeed);
                }
            },
            generatesPoint() {
                (this.addPoint != null) & this.$map["map"].removeOverlay(this.addPoint);
                let _self = this;
                let _item = {
                    plateCode: this.selectedVehicle.plateCode,
                    alarmCount: this.allData[this.curIndex].alarmCount,
                    vehicleStatus: 1,
                    locationDesc: this.allData[this.curIndex].locationDesc,
                    gpsSpeed: this.allData[this.curIndex].gpsSpeed,
                    direction: this.$filter.direction(this.allData[this.curIndex].direction)
                };
                this.addPoint = this.$map["map"].mapAddpoint({
                        longitude: Number(this.allData[this.curIndex].mapLongitude),
                        latitude: Number(this.allData[this.curIndex].mapLatitude)
                    },this.$filter.isOnline(_item),{ width: 36, height: 36 }
                );
                this.addPoint.setRotation(this.allData[this.curIndex].direction);
                this.$map["map"].addOverlay(this.addPoint);
                this.$map["map"].addEventListener(this.addPoint, 'click', _ => {
                     _self.infoWindowStatus = true;
                    _self.openInfo(this.curIndex);
                })
                this.openInfo(this.curIndex);
            },
            openInfo(n) {
                let _item = this.allData[n];
                let viewBox;
                let _self=this;
                if (this.infoWindowStatus) {
                        let context = `<style>.BMap_pop{margin-left:5px;margin-top: 1px;visibility: visible !important;}.BMap_shadow{display:none}}</style>`+
                                `<div style="margin-top: 0;margin-bottom: 0;width:360px;height:180px;overflow:hidden;font-family: 'simsun';font-size: 14px;font-weight: bold;color: #333;">`+
                                `<div><span style='color: #333;font-weight: bold;'>车牌号码:</span>${this.selectedVehicle.plateCode}</div>`+
                                `<div><span style="display:inline-block;margin: 5px 10px 5px 0px;width: 185px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>GPS时间:</span>${this.$filter.format(_item.gpsTime,"yyyy-MM-dd HH:mm:ss")}</span>`+
                                `<span style="display:inline-block;margin: 5px 0px;width: 150px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>方向:</span>${this.$filter.direction(_item.direction)}</span>`+
                                `</div><div><span style="display:inline-block;margin: 5px 10px 5px 0px;width: 185px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>海拔:</span>${_item.high}(m)</span>`+
                                `<span style="display:inline-block;margin: 5px 0px;width: 150px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>里程:</span>${_item.mileage}(km)</span>`+
                                `</div><div><span style="display:inline-block;margin: 5px 10px 5px 0px;width: 185px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>行驶速度:</span>${_item.dspeed}(km/h)</span>`+
                                `<span style="display:inline-block;margin: 5px 0px;width: 150px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>GPS速度:</span>${_item.gpsSpeed}(km/h)</span>`+
                                `</div><div><span style="display:inline-block;margin: 5px 10px 5px 0px;width: 185px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>经度:</span>${this.$filter.toFixed(_item.mapLongitude,6)}</span>`+
                                `<span style="display:inline-block;margin: 5px 0px;width: 130px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>纬度:</span>${this.$filter.toFixed( _item.mapLatitude,6)}</span></div>`+
                                `<div style="margin-top: 6px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>位置信息:</span>${_item.locationDesc} </div></div>`
                        ;
                        if(this.$store.getters.mapName=="gaodeMap"){
                            this.infoMarker = this.$map["map"].infoWindow(context, this.addPoint,function(){
                                _self.infoWindowStatus = false;
                                _self.$map["map"].closeInfoWindow();
                            });
                        }else{
                            this.infoMarker = this.$map["map"].infoWindow(context, this.addPoint);
                            this.$map["map"].addEventListener(this.infoMarker, 'clickclose', _=>{
                                this.infoWindowStatus = false;
                            }); 
                        }
                        this.$map["map"].cvOpenInfoWindow(this.infoMarker, this.addPoint.point);
                }
            },
            changTrackIndex(){
                if(this.showData !=0){
                    this.curIndex=this.showData;
                    this.moveTrack();
                }
            },
            changLabel(){
                this.playSpeed=this.playVal;
                this.changSpeedFlag=true;
                this.runTrack(this.changSpeedFlag);
            }

       },
       mounted(){
           $(".el-slider__runway").css("margin","9px 0px");
       }

   }
</script>

<style lang="scss">
    .cv-play{
        width: auto;
        padding: 0px 15px;
        box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        background: rgb(104,104,103);
        div{
            display: inline-block;
        }
        .el-select{
            width: 70px;
            .el-input .el-input__inner{
                background: rgba(0,0,0,0.60);
                border-color:#161616;
                color:#fff;
            }
        }
        .slider{
            width: 200px;
            margin: 0 5px;
            vertical-align: middle;
            .el-slider__runway{
                margin: 9px 0 !important;
            }
            .el-slider__button-wrapper .el-tooltip, .el-slider__button-wrapper:after{
                    margin-top: -3px;
            }
        }
        .cv-icon-font{
            vertical-align: middle;
        }
    }
    .el-slider__runway{
        margin: 9px 0 !important;
    }
   .titleName{
       width:55px;
       display:inline-block;
       text-align:right;
   }
   .info {
        border: solid 1px silver;
        .info-top {
            position: relative;
            background: none repeat scroll 0 0 #F9F9F9;
            div {
                display: inline-block;
                color: #333333;
                font-size: 14px;
                font-weight: bold;
                line-height: 25px;
                padding: 0 10px;
            }
            img {
                position: absolute;
                top: 10px;
                right: 10px;
                transition-duration: 0.25s;
            }
            img:hover {
                box-shadow: 0px 0px 5px #000;
                cursor: pointer;
            }
        }
        .info-middle {
            font-size: 12px;
            padding: 6px;
            line-height: 20px;
        }
        .info-bottom {
            height: 0px;
            width: 100%;
            clear: both;
            text-align: center;
            img {
                position: relative;
                z-index: 104;
            }
        }
        span {
            margin-left: 5px;
        }
        .info-middle img {
            float: left;
            margin-right: 6px;
        }
    }
        
 
</style>
