<template>
  <cv-scrollbar class="cv-home">
    <div class="xin">
      <div class="cart">
        <ul>
          <li v-for="item in list" :key="item.index">
            <img :src="item.pic">
            <span class="cars">{{item.name}}</span>
            <span>{{item.content}}</span>
          </li>
        </ul>
      </div>
      <div class="righty">
        <div style="border: 1px solid #edf0f5;margin-bottom:10px;">
          <p>系统帮助文档</p>
          <div class="three">
            <img :src="picture.html1">
            <img :src="picture.pdf1">
            <img :src="picture.word1">
          </div>
        </div>
        <div style="border: 1px solid #edf0f5;">
          <p>系统公告
            <!-- <a href="javascript:;">更多+</a> -->
          </p>
          <div class="announcement"></div>
        </div>
      </div>
      <div class="chinaMap" v-loading="chinaMap" element-loading-text="拼命加载中">
        <div class='chinaTitle'>车辆分布图<span v-if='isGetTime' style='font-size:16px;font-weight:400;display:inline-block'>(统计时间：{{accountTime}})</span></div>
        <echart name='map' style="width:100%; height:100%;float: left; margin-top:30px;" :data="mapChart"></echart>
      </div>
      <div class="onlineMap" v-loading="onlineCar" element-loading-text="拼命加载中">
        <ul class="online-switch-btn">
          <li class="week" @click="anweek" :class="[currentChart=='anweek'?'currentChart':'']">
            <em  :class="[currentChart=='anweek'?'currentBlue':'currentLitter']"></em>
            <span>按7天显示</span>
          </li>
          <li class="month" @click="anmonth" :class="[currentChart=='anmonth'?'currentChart':'']">
            <em  :class="[currentChart=='anmonth'?'currentBlue':'currentLitter']"></em>
            <span>按30天显示</span>
          </li>
        </ul>
        <echart name="line" style="width: 919px;height:400px; float:left; position:relative; z-index:2" :data="chartData"></echart>
      </div>
    </div>
  </cv-scrollbar>
</template>
<script>
  import car from '@/assets/img/home/car.png'
  import line from '@/assets/img/home/line.png'
  import leave from '@/assets/img/home/leave.png'
  import ratio from '@/assets/img/home/ratio.png'
  import html1 from '@/assets/img/home/html.png'
  import pdf1 from '@/assets/img/home/pdf.png'
  import word1 from '@/assets/img/home/word.png'
  import echart from '@/components/echart/echart.vue'
  import prot from './'

  export default {
    components: { echart },
    mixins: [prot],
    data() {
      return {
        name: 'echart',  //echart组件名称
        chartData: [],
        mapChart: [],
        chinaMap: true,
        onlineCar: true,
        chartDataFor7: null,
        chartDataFor30: null,
        getMapData:[],
        maxDataA:0,
        accountTime:'',
        isGetTime:false,
        currentChart: 'anweek',
        list: [
          {
            name: "入网车辆",
            content: '--',
            pic: car
          },
          {
            name: "在线",
            content: '--',
            pic: line
          },
          {
            name: "离线超时",
            content: '--',
            pic: leave
          },
          {
            name: "在线率",
            content: '--',
            pic: ratio
          },
        ],
        picture: {
          html1: html1,
          pdf1: pdf1,
          word1: word1,
        },
        timeButton: {
          weekDataKey: [],
          weekDataValue: [],
          monthDataKey: [],
          monthDataValue: [],
        },
        datas: [],
        queryType: '',
      }
    },
    methods: {
      //在线和离线车辆统计
      findCarOnlineCount(callabck) {
        this.findVehicleOnlineCount().then((data) => {
          this.list.forEach((ele, index) => {
            switch (index) {
              case 0:
                ele.content = data.data.totalCount + " 辆"
                break;
              case 1:
                ele.content = data.data.onlineCount + " 辆"
                break;
              case 2:
                ele.content = data.data.offlineCount + " 辆"
                break;
              case 3:
                ele.content = (data.data.totalCount == 0 ? "0.00%" : ((data.data.onlineCount / data.data.totalCount) * 100).toFixed(2) + "%")
                break;
            }
          });
          callabck();
        })
      },
      //获取表格数据(7天)
      getdataFor7() {
        this.loading = true;
        let params = { queryType: 7 }
        this.timeButton.weekDataKey = []
        this.timeButton.weekDataValue = []
        this.queryVehicleCountDaily(params).then((data) => {
          let myTemp, myyTemp;
          this.onlineCar = false;
          for (let key in data.data) {
            myTemp = {
              value: data.data[key].date
            }
            this.timeButton.weekDataKey.push(myTemp);
            myyTemp = {
              value: data.data[key].count
            }
            this.timeButton.weekDataValue.push(myyTemp);
          }
          let options = {
            title: {
              text: '在线车辆数(辆)'
            },
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.timeButton.weekDataKey
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                type: 'line',
                itemStyle: {
                  normal: {
                    color: '#01c302',
                    lineStyle: {
                      color: '#01c302'
                    }
                  }
                },
                data: this.timeButton.weekDataValue
              }
            ]
          }
          this.chartDataFor7 = options;
          this.chartData = options;
        }).catch(() => {
          // this.loading = false;
        });
      },
      //获取表格数据(30天)
      getdataFor30() {
        this.timeButton.monthDataKey = []
        this.timeButton.monthDataValue = []
        let params = { queryType: 30 }
        this.queryVehicleCountDaily(params).then((data) => {
          let myTemp, myyTemp;
          this.onlineCar = false;
          for (let key in data.data) {
            myTemp = {
              value: data.data[key].date
            }
            this.timeButton.monthDataKey.push(myTemp);
            myyTemp = {
              value: data.data[key].count
            }
            this.timeButton.monthDataValue.push(myyTemp);
          }
          let options = {
            title: {
              text: '在线车辆数(辆)'
            },
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.timeButton.monthDataKey
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                type: 'line',
                itemStyle: {
                  normal: {
                    color: '#01c302',
                    lineStyle: {
                      color: '#01c302'
                    }
                  }
                },
                data: this.timeButton.monthDataValue
              }
            ]
          }
          this.chartDataFor30 = options
        })
      },
      //按30天显示
      anmonth() {
        this.currentChart = "anmonth";
        this.chartData = this.chartDataFor30;
      },
      //按7天显示
      anweek() {
        this.currentChart = 'anweek';
        this.chartData = this.chartDataFor7;
      },
      //获取地图车辆数数据
      getCarCount(callback) {
        this.getMapVehcileCount().then((data) => {
          this.datas = data.data;
          if(data.data.result){
            this.getDataDone(data.data.result, callback);
          }else{
            if(data.data.length>0){
              this.getDataDone(data.data, callback);
            }
          }
          //如果有统计时间就显示，没有就不显示
          if(data.data.updateTime){
           this.accountTime= this.timeTranslate(data.data.updateTime);
           this.isGetTime=true;
          }
        })
      },
      //时间转换
      timeTranslate(time){
        let unixTimestamp = new Date(time);
        let commonTime = unixTimestamp.toLocaleString();
        return commonTime;
      },
      //得到数据进行处理
      getDataDone(data, callback){
      	let maxData=0;
        for(let i=0;i<data.length;i++){
          let ValueArr=data[i].url.split(":");
          let vL=parseInt(ValueArr[1]);
          vL>maxData ? maxData=vL:null;
          //部分地图区域数据的截取操作
          let name=data[i].name;
          this.SpliceAreaName(name);
          this.getMapData.push({
            name:this.SpliceAreaName(name),
            value:vL
          })
        };
        this.maxDataA = maxData;
        this.getMapCarCount(callback);
      },
      //部分区域名称的截取操作
      SpliceAreaName(AreaName){
        let newAreaName=AreaName;
        if(AreaName=="新疆维吾尔自治区"){newAreaName=AreaName.substring(0,2)};
        if(AreaName=="内蒙古自治区"){newAreaName=AreaName.substring(0,3)};
        if(AreaName=="广西壮族自治区"){newAreaName=AreaName.substring(0,2)};
        if(AreaName=="西藏自治区"){newAreaName=AreaName.substring(0,2)};
        if(AreaName=="宁夏回族自治区"){newAreaName=AreaName.substring(0,2)};
        if(AreaName=="澳门特别行政区"){newAreaName=AreaName.substring(0,2)};
        if(AreaName=="香港特别行政区"){newAreaName=AreaName.substring(0,2)};
        // if(AreaName=="上海市"){newAreaName=AreaName.substring(0,2)};
        // if(AreaName=="北京市"){newAreaName=AreaName.substring(0,2)};
        // if(AreaName=="天津市"){newAreaName=AreaName.substring(0,2)};
        // if(AreaName=="重庆市"){newAreaName=AreaName.substring(0,2)};
        // console.log(newAreaName);
        return newAreaName;
      },
      //将获取的车辆数数据渲染页面
      getMapCarCount(callback) {
        let that = this;
        let option = {
                tooltip: {
                   trigger: 'item',
                   formatter: function (params) {
                       if(params.data && parseInt(params.data.value)>=0 ){
                        return params.data.name+':'+params.data.value;
                       }else{
                        return '暂无车辆';
                       }
                    },
                },
               // toolbox:{
               //  right:"20px",
               //  top:"10px",
               //  feature:{
               //    restore:{
               //      show:true,
               //      title:'刷新'
               //    }
               //  }
               // },
               legend: {
                 orient: 'vertical',
                 selectedMode: false,
                 left: '30',
                 top:'50',
                 data:['车辆数']
                },
               visualMap: {
                   max: this.maxDataA,
                   left: '30',
                   bottom: '50',
                   text: [this.maxDataA, 0],           // 文本，默认为数值文本
                  //  calculable: true,
                   inRange: {
                      color: ['lightskyblue','yellow', 'orangered']
                   }
               },
               series: [
                   {
                       name: '车辆数',
                       type: 'map',
                       mapType: 'china',
                       roam: true,
                       scaleLimit:{
                        min:1,
                        // max:2
                       },
                       left:'center',
                       top:'30px',
                       aspectScale:0.8,
                       label: {
                           normal: {
                               show: true,
                               formatter: function (params) {
                                if(params.data.name && parseInt(params.data.value) >= 0){
                                  return params.data.name+':'+params.data.value;
                                }
                               },
                               position: 'inside',
                               backgroundColor: '#fff',
                               padding: [4, 5],
                               borderRadius: 3,
                               borderWidth: 1,
                               borderColor: '#000',
                               color: '#777',
                           },
                           emphasis: {
                               show: true
                           }
                       },
                       itemStyle: {
                          normal: {
                            borderWidth: .5,//区域边框宽度
                            borderColor: '#000',//区域边框颜色
                            areaColor: "#eee",//区域颜色
                          },
                          emphasis: {
                            borderWidth: .5,
                            borderColor: '#4b0082',
                            areaColor: "#ffdf33",
                          }
                        },
                       data:this.getMapData
                   }
               ]
        };
        this.mapChart = option;
        callback();
      }
    },
    mounted() {
      this.findCarOnlineCount( _ => {
          this.getCarCount(_ => {
              this.chinaMap = false;
              this.getdataFor7();
              this.getdataFor30();
          });
      }) 
    }
  }
</script>

<style lang="scss">
html,
body {
  height: 100%;
 overflow: auto;
}
.cv-home {
  width: 100%;
  background: #edf0f5;
  top: 60px !important;
  .xin {
    width: 1213px;
    margin: 0 auto;
    .cart {
      width: 921px;
      height: 101px;
      float: left;
      margin-top: 10px;
      ul {
        margin-top: 1px;
        li {
          height: 81px;
          float: left;
          padding-top: 20px;
          padding-left: 31px;
          width: 198px;
          border-right: 1px solid #edf0f5;
          border-top: 1px solid #edf0f5;
          border-bottom: 1px solid #edf0f5;
          position: relative;
          background: #fff;
          img {
            margin-right: 15px;
          }
          span:nth-of-type(1).cars {
            position: absolute;
            color: black;
            width: 113px;
            top: 34px;
            font-size: 14px;
          }
          span:nth-of-type(2) {
            position: absolute;
            top: 55px;
            font-size: 14px;
          }
        }
        li:first-child{
          border-left: 1px solid #edf0f5;
        }
        li:nth-of-type(2) {
          span:nth-of-type(1).cars {
            color: #fac111;
          }
        }
        li:nth-of-type(3) {
          span:nth-of-type(1).cars {
            color: #ff3762;
          }
        }
        li:nth-of-type(4) {
          span:nth-of-type(1).cars {
            color: #030f4a;
          }
        }
      }
    }
    .chinaMap {
      width: 920px;
      height: 522px;
      margin-top: 10px;
      float: left;
      border: 1px solid #edf0f5;
      // padding-left: 200px;
      background: #fff;
      overflow: hidden;
      position: relative;
      .chinaTitle {
        position: absolute;
        left: 15px;
        top:15px;
        font-size: 18px;
        font-weight: bold;
        color: #353535;
      }
      .map{
        margin-top: 0!important;
      }
    }
    .onlineMap{
        position: relative;
        background:#fff; 
        float:left; 
        margin-top:10px; 
        margin-bottom:10px;
        border: 1px solid #edf0f5;
        .currentChart{
          border-bottom: 2px solid #20a0ff;
        }
        .currentBlue{
          background: #2ec9e4
        }
        .currentLitter{
          background:#a6e5ee
        }
    }
    .righty {
      float: right;
      width: 274px;
      height: 935px;
      margin-top: 10px;
      p:nth-of-type(1) {
        height: 55px;
        background: #fff;
        line-height: 55px;
        font-size: 24px;
        color: #9a9a9a;
        border-bottom: 1px solid #edf0f5;
        padding-left: 25px;
      }
      .three {
        background: #fff;
        padding-top: 22px;
        height: 92px;
        img {
          margin-left: 25px;
        }
      }
      p:nth-of-type(2) {
        height: 55px;
        background: #fff;
        line-height: 55px;
        padding-left: 25px;
        font-size: 24px;
        color: #9a9a9a;
        border-bottom: 1px solid #edf0f5;
        position: relative;
        a {
          position: absolute;
          right: 0;
          top: 0;
          color: #008ee2;
          font-size: 14px;
          margin-right: 18px;
          text-decoration: none;
        }
      }
      .announcement {
        width: 100%;
        height: 836px;
        background: #fff;
      }
    }
    .online-switch-btn{
      position: absolute;
      z-index: 3;
      right: 10px;
      top: 10px;
      li{
        float: left;
        cursor: pointer;
        height: 30px;
        line-height: 30px;
        padding-right: 10px;
      }
      em{
        display: inline-block;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background: red;
      }

    }
  }
}
</style>
