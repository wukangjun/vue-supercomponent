<template>
    <div :class="'cv-echart '+name" ref="chart"></div>
</template>
<script>
export default {
    props: {
        data: {},
        name: {}
    },
    data() {
        return {
            // chartdom元素
            chart: null,
            //lineData
            lineOptions: {
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: []
                },
                grid: {
                    top: '10px',
                    left: '30px',
                    right: '40px',
                    bottom: '25px',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['暂','无','数','据']
                },
                yAxis: {
                    type: 'value'
                },
                series: []
            },
            //pieData
            pieOptions: {
                title: {
                    text: '',
                    subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [
                            { value: 335, name: '直接访问' },
                            { value: 310, name: '邮件营销' },
                            { value: 234, name: '联盟广告' },
                            { value: 135, name: '视频广告' },
                            { value: 1548, name: '搜索引擎' }
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            },
            //barData
            barOptions: {
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '直接访问',
                        type: 'bar',
                        barWidth: '60%',
                        data: [10, 52, 200, 334, 390, 330, 220]
                    }
                ]
            },
            //mapData
            mapOptions: {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}'
                },
                 visualMap: {
                            // max:1000,
                            // min:0,
                            left: '30',
                            bottom: '50',
                            // text: ['高','低'],           // 文本，默认为数值文本
                            // calculable: true,
                            // textGap:['100px']
                            // inRange: {
                            //  color: ['lightskyblue','yellow', 'orangered']
                            // }
                        },
                series: [
                    {
                        name: '中国',
                        type: 'map',
                        mapType: 'china',
                        selectedMode: 'multiple',
                        left:'center',
                        top:'30px',
                        label: {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        aspectScale:0.8,
                         
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
                        data: [
                             {name: '北京',value: 0 },
                             {name: '天津',value: 0 },
                             {name: '上海',value: 0 },
                             {name: '重庆',value: 0 },
                             {name: '河北',value: 0 },
                             {name: '河南',value: 0 },
                             {name: '云南',value: 0 },
                             {name: '辽宁',value: 0 },
                             {name: '黑龙江',value: 0 },
                             {name: '湖南',value: 0 },
                             {name: '安徽',value: 0 },
                             {name: '山东',value: 0 },
                             {name: '新疆',value: 0 },
                             {name: '江苏',value: 0 },
                             {name: '浙江',value: 0 },
                             {name: '江西',value: 0 },
                             {name: '湖北',value: 0 },
                             {name: '广西',value: 0 },
                             {name: '甘肃',value: 0 },
                             {name: '山西',value: 0 },
                             {name: '内蒙古',value: 0 },
                             {name: '陕西',value: 0 },
                             {name: '吉林',value: 0 },
                             {name: '福建',value: 0 },
                             {name: '贵州',value: 0 },
                             {name: '广东',value: 0 },
                             {name: '青海',value: 0 },
                             {name: '西藏',value: 0 },
                             {name: '四川',value: 0 },
                             {name: '宁夏',value: 0 },
                             {name: '海南',value: 0 },
                             {name: '台湾',value: 0 },
                             {name: '香港',value: 0 },
                             {name: '澳门',value: 0 },

                        ]
                    }
                ]
            }
        }
    },
    methods: {
        getEchartScript(callback){
            if(!global.echarts){
                global.echarts = {};
                global.echarts._preloader = new Promise((resolve, reject) => {
                    const $script = document.createElement('script');                   
                    $script.src = `http://lib.cvtsp.com/echarts/echarts.min.js`;
                    global.document.body.appendChild($script);
                    if(this.$service.isIe()){
                        $script.onreadystatechange = function(){
                            if ($script.readyState == 'loaded' || $script.readyState == 'complete') { 
                                callback(global.echarts);
                                global.echarts._preloader = null;
                            } 
                        }
                    }else{
                        $script.onload = function(){
                            resolve(global.echarts);
                            global.echarts._preloader = null;
                        }
                    }
                })
                return global.echarts._preloader;
            }else if (!global.echarts._preloader) {
                return Promise.resolve(global.echarts);
            }
            else{
                return global.echarts._preloader;
            }
        },
        linearGradient(left, bottom, right, top, array){
            return new echarts.graphic.LinearGradient(left, bottom, right, top, array);
        },
        getEchart(){
            return this.chart;
        },
        setOptions(){
            if(this.name === 'map'){
                echarts.registerMap('china', require('./model/echarts/src/china').default)
            }
            this.chart = echarts.init(this.$refs['chart']);
            switch (this.name) {
                case 'line':
                    this.chart.setOption(
                        this.$service.isEmptyObject(this.data)
                        ?this.lineOptions
                        :this.data
                    );
                break;
                case 'bar':
                    this.chart.setOption(
                        this.$service.isEmptyObject(this.data)
                        ?this.barOptions
                        :this.data
                    );
                break;
                case 'pie':
                    this.chart.setOption(this.$service.isEmptyObject(this.data)
                        ?this.pieOptions
                        :this.data
                    );
                break;
                case 'map':
                    this.chart.setOption(this.$service.isEmptyObject(this.data)
                        ?this.mapOptions
                        :this.data
                    );
                break;
            };     
        }
    },
    watch: {
        data(newVal) {
            if(this.name === 'map'){
                echarts.registerMap('china', require('./model/echarts/src/china').default)
            }
            this.chart = echarts.init(this.$refs['chart']);
            switch (this.name) {
                case 'line':
                    this.$service.extend(this.lineOptions, newVal);
                    this.chart.clear();
                    this.chart.setOption(this.lineOptions);
                break;
                case 'bar':
                    this.$service.extend(this.barOptions, newVal);
                    this.chart.clear();
                    this.chart.setOption(this.barOptions);
                break;
                case 'pie':
                    this.$service.extend(this.pieOptions, newVal);
                    this.chart.clear();
                    this.chart.setOption(this.pieOptions);
                break;
                case 'map':
                    this.$service.extend(this.mapOptions, newVal);
                    this.chart.clear();
                    this.chart.setOption(this.mapOptions);
                    // myChart.on('legendselectchanged', function (params) {
                    //   console.log(params);
                    //  });
                break;
            }
        }
    },
    mounted() {
        const {getEchartScript, setOptions} = this;
        if(this.$service.isIe()){
            getEchartScript(function(){
                setOptions();
            })
        }else{
             getEchartScript().then(setOptions);
        }
        window.addEventListener("resize", _ => {
            this.chart && this.chart.resize();
        });
    }
}
</script>

