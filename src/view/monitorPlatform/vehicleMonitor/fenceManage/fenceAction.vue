<template>
    <div class="main">
        <component :is="$store.getters.mapName" style="width: 100%;height: 100%;overflow: hidden;margin:0;" id="fenceAction" @ready="readyLoad"></component>
        <div class="formAction" v-show="isShow">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="line-height: 1;font-size: 18px;">{{$t("fenceManage.fenceManage")}}</span>
                    <el-button-group style="float: right;">
                        <el-button size="small" type="primary" :loading="subStatus" @click="submitFence">{{$t('action.save')}}</el-button>
                        <el-button size="small" @click="comeBack">{{$t("action.back")}}</el-button>
                    </el-button-group>
                </div>
                <cv-scrollbar class="formClass">
                    <el-form :model="fenceForm" :rules="rules" :inline="true" label-width="80px" ref="fenceForm">
                        <el-form-item :label="$t('fenceManage.ruleType')">
                            <el-button-group>
                                <el-tooltip class="item" effect="dark" :content="$t('common.fence.circle')" placement="top-start">
                                    <el-button :style="(options.isModify &&fenceForm.ruleType == 1)?'background-color:#20a0ff;color:#fff':(fenceForm.ruleType == 1?'background-color:#20a0ff;color:#fff':'')" :disabled="disBtn" icon="tsp-yuanxing" @click="Addcircle"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" :content="$t('common.fence.rectangle')" placement="top-start">
                                    <el-button :style="(options.isModify &&fenceForm.ruleType == 2)?'background-color:#20a0ff;color:#fff':(fenceForm.ruleType == 2?'background-color:#20a0ff;color:#fff':'')" :disabled="disBtn" icon="tsp-rectangle" @click="Addrectangle"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" :content="$t('common.fence.polygon')" placement="top-start">
                                    <el-button :style="(options.isModify && fenceForm.ruleType == 3)?'background-color:#20a0ff;color:#fff':(fenceForm.ruleType == 3?'background-color:#20a0ff;color:#fff':'')" :disabled="disBtn" icon="tsp-duobianxing" @click="Addpolygon"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" :content="$t('common.fence.line')" placement="top-start">
                                    <el-button :style="(options.isModify && fenceForm.ruleType== 4)?'background-color:#20a0ff;color:#fff':(fenceForm.ruleType == 4?'background-color:#20a0ff;color:#fff':'')" :disabled="disBtn" icon="tsp-draw-polyline" @click="Addline"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" :content="$t('action.reset')" placement="top-start">
                                    <el-button :disabled="disBtn" icon="delete" @click="clearOverlay"></el-button>
                                </el-tooltip>
                            </el-button-group>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.ruleName')" prop="fenceName">
                            <el-input v-model="fenceForm.fenceName" size="small" :placeholder="$t('placeholder.inputValue')" class="inputStype"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.areaType')" prop="fenceType">
                            <el-select :disabled="selectDisabled" v-model="fenceForm.fenceType" multiple style="width:330px" @change="typeChange" @remove-tag="removeRuleType" size="small" :placeholder="$t('placeholder.selectValue')">
                                <el-option v-for="item in areaTypeItems" :disabled="item.disabled" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.dateTimeTYpe')" prop="dateType" v-show="isShowDateTime">
                            <el-radio-group v-model="fenceForm.dateType">
                                <el-radio :label="0" size="small">{{$t("fenceManage.selectDate")}}</el-radio>
                                <el-radio :label="1" size="small">{{$t("fenceManage.selectTime")}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.date')" prop="date" v-show="isShowDateInput">
                            <el-date-picker style="width:330px;" size="small" v-model="fenceForm.date" align="right" type="datetimerange" :clearable="false" :editable="false" :placeholder="$t('el.datepicker.selectDate')">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.time')" prop="time" v-show="isShowTimeInput">
                            <el-time-picker style="width:330px;" size="small" is-range v-model="fenceForm.time" align="right" :editable="false" :placeholder="$t('el.datepicker.selectTime')">
                            </el-time-picker>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.aspeed')" prop="speed" v-show="isShowLimitSpeed">
                            <!-- <el-input-number v-model="fenceForm.speed" :min="0" :max="1000"></el-input-number><span style="position:absolute;">&nbsp;(km/h)</span> -->
                            <el-input :maxlength="3" type="text" size="small" v-model="fenceForm.speed"></el-input><span style="position:absolute;">&nbsp;(km/h)</span>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.aseconds')" prop="speedTime" v-show="isShowLimitSpeed">
                            <!-- <el-input-number v-model="fenceForm.speedTime" :min="0" :max="255"></el-input-number><span style="position:absolute;">&nbsp;(s)</span> -->
                            <el-input :maxlength="3" type="text" size="small" v-model="fenceForm.speedTime"></el-input><span style="position:absolute;">&nbsp;(s)</span>
                        </el-form-item>
                        <!--                         <el-form-item label="空载"  v-show="isShowEmptyAndFull">
                                    <p><span style="padding-right:10px;">举升限制</span><el-switch v-model="fenceForm.empty_up"  on-text="开" off-text="关" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0"></el-switch></p>
                                    <p><span style="padding-right:10px;">开盖限制</span><el-switch v-model="fenceForm.empty_openOrClose"  on-text="开" off-text="关" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0"></el-switch></p>
                                    <p><span style="padding-right:10px;">发动机转速限制</span><el-switch v-model="fenceForm.empty_limitSpeedISshow"  on-text="开" off-text="关" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0"></el-switch></p>
                                </el-form-item> -->
                        <el-form-item :label="$t('fenceManage.remark')" prop="remarks">
                            <el-input type="textarea" :rows="3" size="small" v-model="fenceForm.remarksss" :placeholder="$t('placeholder.inputValue')" class="inputStype"></el-input>
                        </el-form-item>
                    </el-form>
                </cv-scrollbar>
            </el-card>
        </div>
    </div>
</template>

<script>
import filters from "@/utils/filter"
export default {
    props: {
        options: {}
    },
    data() {
        var isNullOrDate = (rule, value, callback) => {
            if (this.fenceForm.fenceType.findIndex(x => x == "1") > -1 && this.fenceForm.dateType == 0) {
                if (value.length == 0) {
                    callback(new Error('请选择日期'));
                } else {
                    if (value[0] == null || value[1] == null) {
                        callback(new Error('请选择日期'));
                    } else {
                        callback();
                    }

                }
            } else {
                callback();
            }
        };
        var isNullOrTime = (rule, value, callback) => {
            if (this.fenceForm.fenceType.findIndex(x => x == "1") > -1 && this.fenceForm.dateType == 1) {
                if (value.length == 0) {
                    callback(new Error('请选择时间'));
                } else {

                    if (value[0] == null || value[1] == null) {
                        callback(new Error('请选择时间'));
                    } else {
                        callback();
                    }

                }
            } else {
                callback();
            }
        };
        var o1 = (rule, value, callback) => {
            if (value >= 0 && (value - 100) <= 0) {
                callback()
            } else {
                callback(new Error('限速范围0(km/h)-100(km/h)'))
            }
        };
        var o2 = (rule, value, callback) => {
            if (value >= 0 && (value - 100) <= 0) {
                callback()
            } else {
                callback(new Error('限速时长范围0(s)-100(s)'))
            }
        };
        return {
            subStatus: false,
            selectDisabled: true,
            radius: 0,
            disBtn: false,
            fenceForm: {
                id: "",
                fenceName: "",
                fenceType: [],
                ruleType: "",
                remarksss: "",
                date: [],
                time: [],
                speed: "0",
                speedTime: "0",
                limitSpeed: "",
                dateType: 0,
                /*                 empty_up:1,
                                empty_openOrClose:1,
                                empty_limitSpeedISshow:1,
                                empty_limitSpeed:600,
                                full_up:0,
                                full_openOrClose:0,
                                full_limitSpeedISshow:0,
                                full_limitSpeed:600, */
            },
            rules: {
                fenceName: [
                    { required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
                    { min: 2, max: 15, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 2, max: 15 }) },
                    { pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: this.$t('filter.type4') }
                ],
                remarks: [
                    { min: 0, max: 150, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 0, max: 150 }) },
                ],
                date: [
                    { type: 'array', required: false, message: this.$t('el.datepicker.selectDate'), trigger: 'change' },
                    { validator: isNullOrDate, trigger: 'blur,change' }
                ],
                time: [
                    { type: 'array', required: false, message: this.$t('el.datepicker.selectTime'), trigger: 'change' },
                    { validator: isNullOrTime, trigger: 'blur,change' },
                ],
                speed: [
                    { required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
                    { validator: o1, trigger: 'blur,change' },
                    { pattern: /^[0-9]*$/, message: this.$t('filter.type2') }
                ],
                speedTime: [
                    { required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
                    { validator: o2, trigger: 'blur,change' },
                    { pattern: /^[0-9]*$/, message: this.$t('filter.type2') }
                ],
                fenceType: [
                    { type: 'array', required: true, message: '请选择围栏属性', trigger: 'change' }
                ]
            },
            areaTypeItems: [],
            items: [{
                value: "1",
                label: this.$t("common.fence.1"),
                disabled: true
            }, {
                value: "2",
                label: this.$t("common.fence.2"),
                disabled: true
            }, {
                value: "4",
                label: this.$t("common.fence.4"),
                disabled: true
            }, {
                value: "8",
                label: this.$t("common.fence.8"),
                disabled: true
            }, {
                value: "16",
                label: this.$t("common.fence.16"),
                disabled: true
            }, {
                value: "32",
                label: this.$t("common.fence.32"),
                disabled: true
            }, {
                value: "256",
                label: this.$t("common.fence.256"),
                disabled: true
            },
            // {
            //     value: "512",
            //     label: this.$t("common.fence.512"),
            //     disabled: true
            // },
            // {
            //     value: "1024",
            //     label: this.$t("common.fence.1024"),
            //     disabled: true
            // },
            // {
            //     value: "2048",
            //     label: this.$t("common.fence.2048"),
            //     disabled: true
            // },
            {
                value: "16384",
                label: this.$t("common.fence.16384"),
                disabled: true
            }, {
                value: "32768",
                label: this.$t("common.fence.32768"),
                disabled: true
            }],
            isShow: true,
            overlay: null
        };
    }, computed: {
        // isShowEmptyAndFull: function() {
        //     if (this.fenceForm.fenceType.findIndex(x => x == "512" || x == "1024" || x == "2048") > -1)
        //         return true;
        //     else
        //         return false;
        // },
        isShowDateTime: function() {
            if (this.fenceForm.fenceType.findIndex(x => x == "1") > -1) {
                //this.fenceForm.dateType=0;
                return true;
            } else {
                //this.fenceForm.dateType=0;
                this.rules.date[0].required = false;
                this.rules.time[0].required = false;
                return false;
            }
        },
        isShowDateInput: function() {
            if (this.fenceForm.fenceType.findIndex(x => x == "1") > -1 && this.fenceForm.dateType == 0) {
                this.rules.date[0].required = true;
                return true;
            } else {
                this.rules.date[0].required = false;
                this.fenceForm.date = [];
                return false;
            }
        },
        isShowTimeInput: function() {
            if (this.fenceForm.fenceType.findIndex(x => x == "1") > -1 && this.fenceForm.dateType == 1) {
                this.rules.time[0].required = true;
                return true;
            } else {
                this.rules.time[0].required = false;
                this.fenceForm.time = [];
                return false;
            }
        },
        isShowLimitSpeed: function() {
            console.log(this.fenceForm.fenceType)
            return this.fenceForm.fenceType.findIndex(x => x == "2") > -1 ? true : false;
        }
    },
    methods: {
        readyLoad() {
            if (this.options.id != "") {
                this.getFenceToUpdate(this.options.id, this.options.type);
                this.fenceForm.id = this.options.id;
                this.disBtn = true;
            } else {
                this.disBtn = false;
            }
        },
        typeChange(val) {
            let index = val.length - 1;
            // console.log(val)
            if (val[index] == "512") {
                // this.getIndexSplice(["1024", "2048"]);
            } else if (val[index] == "1024") {
                // this.getIndexSplice(["512", "2048"]);
            } else if (val[index] == "2048") {
                // this.getIndexSplice(["512", "1024"]);
            } else { }
        },
        comeBack() {
            this.options.name = "fenceMain";
            this.options.id = "";
            this.$refs["fenceForm"].resetFields();
        },
        //添加圆形
        Addcircle() {
            this.isShow = false;
            this.clearOverlay();
            this.fenceForm.ruleType = 1;
            this.$map["fenceAction"].onclickCircle((options) => {
                this.overlay = options.overlay;
                this.$map["fenceAction"].overlayEdit(options.overlay, true);
                this.isShow = true;
            });

        },
        //添加矩形
        Addrectangle() {
            this.isShow = false;
            this.clearOverlay();
            this.fenceForm.ruleType = 2;
            this.$map["fenceAction"].onclickRectangle((options) => {
                this.overlay = options.overlay;
                this.$map["fenceAction"].overlayEdit(options.overlay, true);
                this.isShow = true;
            });
        },
        //添加多边形
        Addpolygon() {
            this.isShow = false;
            this.clearOverlay();
            this.fenceForm.ruleType = 3;
            this.$map["fenceAction"].onclickPolygon((options) => {
                this.overlay = options.overlay;
                this.$map["fenceAction"].overlayEdit(options.overlay, true);
                this.isShow = true;
            });
        },
        //添加线形
        Addline() {
            this.clearOverlay();
            this.isShow = false;
            this.fenceForm.ruleType = 4;
            this.$map["fenceAction"].onclickLine((options) => {
                this.overlay = options.overlay;
                this.$map["fenceAction"].overlayEdit(options.overlay, true);
                this.isShow = true;
            });
        },
        clearOverlay() {
            this.clearMap();

        },
        //清空地图
        clearMap() {
            if (this.overlay) {
                this.$map['fenceAction'].removeOverlay(this.overlay);
                this.overlay = null;
                this.fenceForm.ruleType = "";
            }
        },
        submitFence() {
            this.$refs["fenceForm"].validate((valid) => {
                // console.log(valid);
                if (valid) {
                    if (this.overlay) {
                        let params = this.getParmas();
                        if (this.fenceForm.ruleType == 1 && this.radius == 0) {
                            this.$message.error({ message: '圆形半径不能为0' });
                            return false;
                        }
                        if (this.fenceForm.id != "") {
                            this.fenceAction(this.$COMMON.baseUrl + "/fenece/updatefencerule", params);
                        }
                        else {
                            this.fenceAction(this.$COMMON.baseUrl + "/fenece/insertfencerule", params);
                        }
                    } else {
                        this.$message.error({ message: this.$t("action.addOverlay") });
                    }

                } else {
                    return false;
                }

            });
        },
        fenceAction(url, params) {
            this.subStatus = true;
            this.$http({
                url: url,
                data: JSON.stringify(params)
            }).then((data) => {

                if (!data.flag && !!data.errorCode)
                    this.$message.error({ message: this.$t("error." + data.errorCode) });
                else {
                    this.$refs["fenceForm"].resetFields();
                    this.clearOverlay();
                    this.options.id = "";
                    this.options.name = "fenceMain";

                    this.$message.success({ message: this.$t("action.actionSuccess") });
                }
                this.subStatus = false;
            }).catch(_ => {
                this.subStatus = false;
            });
        },
        getParmas() {
            let baseType = {
                //区域属性ID
                areaType: "",
                //区域属性名
                areaName: "",
                //限速时间
                aseconds: null,
                //限速速度
                aspeed: null,
                //日期时间类型
                dataType: null,
                //起始时间
                startTime: null,
                //结束时间
                endTime: null,
            }
            let areaNameAndType = [], requestPoint = [], options = {};
            this.fenceForm.fenceType.forEach((data) => {
                switch (data) {
                    case "1":
                        if (this.fenceForm.dateType == 0) {
                            areaNameAndType.push({
                                areaType: data, startTime: filters.format(this.fenceForm.date[0], "yyyy-MM-dd HH:mm:ss"),
                                endTime: filters.format(this.fenceForm.date[1], "yyyy-MM-dd HH:mm:ss"), dataType: this.fenceForm.dateType,
                            });
                        }
                        else {
                            areaNameAndType.push({
                                areaType: data, startTime: filters.format(this.fenceForm.time[0], "HH:mm:ss"),
                                endTime: filters.format(this.fenceForm.time[1], "HH:mm:ss"), dataType: this.fenceForm.dateType
                            });
                        }
                        break;
                    case "2":
                        areaNameAndType.push({ areaType: data, aseconds: this.fenceForm.speedTime+"", aspeed: this.fenceForm.speed+"" });
                        break;
                    default:
                        areaNameAndType.push({ areaType: data });
                        break;
                }
            });

            switch (this.fenceForm.ruleType) {

                case 1:
                    options = this.$map["fenceAction"].getCircleOptions(this.overlay);
                    requestPoint.push({ latitude: options.center.lat, longitude: options.center.lng });
                    this.radius = parseInt(options.radius);
                    break;
                case 2:
                    options = this.$map["fenceAction"].getPolygonOptions(this.overlay);
                    let lngArr = [],
                        latArr = [],
                        maxPoint = {},
                        minPoint = {};
                    options.points.forEach((data) => {
                        lngArr.push(data.lng);
                        latArr.push(data.lat);
                    });
                    maxPoint.longitude = Math.max.apply(Math,lngArr);
                    maxPoint.latitude = Math.max.apply(Math,latArr);
                    minPoint.longitude = Math.min.apply(Math,lngArr);
                    minPoint.latitude = Math.min.apply(Math,latArr);
                    requestPoint.push(maxPoint,minPoint)
                    break;
                case 3:
                    options = this.$map["fenceAction"].getPolygonOptions(this.overlay);
                    options.points.forEach((data) => {
                        requestPoint.push({ latitude: data.lat, longitude: data.lng });
                    });
                    break;
                case 4:
                    options = this.$map["fenceAction"].getLineOptions(this.overlay);
                    options.points.forEach((data) => {
                        requestPoint.push({ latitude: data.lat, longitude: data.lng });
                    });
                    break;
                default:
                    break;

            };
            let parmas = {
                id: this.fenceForm.id, mapType: this.$store.getters.mapType, ruleName: this.fenceForm.fenceName, ruleType: this.fenceForm.ruleType,
                fenceType:1,
                requestPoint: requestPoint, radius: this.radius, remarksss: this.fenceForm.remarksss, areaNameAndType: areaNameAndType,
                type: this.options.type
            };
            return parmas;
        },
        getFenceToUpdate(id, type) {
            let params = { id: id, mapType: this.$store.getters.mapType, type: type };
            let loadingInstance = this.$loading({
                text: "正在拼命加载中",
                target: document.querySelector('.el-card')
            });
            this.$store.dispatch("queryGetFenceRule", params).then((data) => {
                // console.log(data)
                // debugger
                this.fenceForm.ruleType = data.data.ruleType;
                data.data.areaNameAndType.forEach(ele=>{
                    ele['aspeed'] && (this.fenceForm.speed = ele['aspeed']+'',console.log(ele['aspeed']+''))
                    ele['aseconds'] && (this.fenceForm.speedTime = ele['aseconds']+'')
                })
                // console.log(this.fenceForm)
                switch (data.data.ruleType) {
                    //圆形
                    case 1:
                        let pointarr = data.data.requestPoint[0];
                        let points = { lat: pointarr.latitude, lng: pointarr.longitude };
                        this.radius = data.data.radius;
                        let point = this.$map["fenceAction"].point(points);
                        this.overlay = this.$map["fenceAction"].mapAddcircle(point, this.radius);

                        break;
                    //矩形
                    case 2:
                        let rectangle = [];
                            let latArr = [],
                                lngArr = [],
                                rectangleData = {};
                            if(data.data.requestPoint.length>0){
                                data.data.requestPoint.forEach((data)=>{
                                    latArr.push(Number(data.latitude))
                                    lngArr.push(Number(data.longitude))
                                    rectangle.push({latitude:data.latitude,longitude:data.longitude})
                                });
                                rectangleData.minLng = Math.min.apply(Math,lngArr);
                                rectangleData.minLat = Math.min.apply(Math,latArr);
                                rectangleData.maxLng = Math.max.apply(Math,lngArr);
                                rectangleData.maxLat = Math.max.apply(Math,latArr);
                                this.overlay = this.$map["fenceAction"].mapAddrectangle(rectangleData, {});
                            };
                            break;
                    //多边形
                    case 3:
                        let polygonPoints = [];
                        data.data.requestPoint.forEach((data) => {
                            polygonPoints.push({ lat: data.latitude, lng: data.longitude });
                        });
                        this.overlay = this.$map["fenceAction"].mapAddpolygon(polygonPoints, {});
                        break;
                    case 4:
                        let polylinePoints = [];
                        data.data.requestPoint.forEach((data) => {
                            polylinePoints.push({ lat: data.latitude, lng: data.longitude });
                        });
                        this.overlay = this.$map["fenceAction"].mapAddline(polylinePoints, {});
                        break;
                    default:
                        break;
                }
                this.$map["fenceAction"].overlayEdit(this.overlay, true);
                this.areaTypeSetVal(data.data);
                loadingInstance.close();
            });
        },
        areaTypeSetVal(data) {
            let startTime = "", endTime = "";
            this.fenceForm.fenceName = data.ruleName;
            this.fenceForm.remarksss = data.remarksss;
            // console.log(this.fenceForm)
            data.areaNameAndType.forEach((data) => {
                this.fenceForm.fenceType.push(data.areaType.toString());
                switch (data.areaType) {
                    case 1:
                        this.fenceForm.dateType = parseInt(data.dataType);
                        if (this.fenceForm.dateType == 0) {
                            startTime = this.$service.dateTimeParse(data.startTime);
                            endTime = this.$service.dateTimeParse(data.endTime);
                            // console.log(startTime,endTime)
                            // console.log(data.startTime,data.endTime)
                            this.fenceForm.date = [startTime, endTime];
                        } else {
                            startTime = this.$service.timeParse(data.startTime);
                            endTime = this.$service.timeParse(data.endTime);
                            this.fenceForm.time = [startTime, endTime];

                        }
                        break;
                    case 2:
                        this.fenceForm.speedTime = data.aseconds + '';
                        this.fenceForm.speed = data.aspeed+'';
                        this.isSpeed = true;
                        break;
                    default:
                        break;
                }
            });
        },
        getIndexSplice(arr) {
            // console.log(this.fenceForm.fenceType)
            for (let i = 0; i < arr.length; i++) {
                let index = this.fenceForm.fenceType.findIndex(x => x == arr[i]);
                if (index > -1) {
                    this.fenceForm.fenceType.splice(index, 1);
                }
            }
     
        },
        removeRuleType(val) {
            if (val.value == "1") {
                this.fenceForm.time = [];
                this.fenceForm.date = [];
                this.fenceForm.dateType = 0;
                this.rules.date[0].required = false;
                this.rules.time[0].required = false;
            }
        }
    }, mounted() {
        // console.log(this.fenceForm)
    }, watch: {
        'fenceForm.date'(newval) {
        },
        'overlay'(newval) {
            if (newval) {
                this.selectDisabled = false;
            } else {
                this.selectDisabled = true;
                this.fenceForm.fenceType = [];
            }
        },
        'fenceForm.ruleType'(newval) {
            // console.log(newval)
            let selectArr = [];
            if (newval == 4) {
                let polylineArr = ["1", "4", "8", "16", "32"];
                this.items.forEach((data) => {
                    data.disabled = polylineArr.indexOf(data.value) == -1;
                    selectArr.push(data);
                });
            } else {
                let enterpriseType = this.$store.getters.user.enterpriseType;
                if (enterpriseType) {
                    if (enterpriseType.indexOf("2") == -1) {
                        let arr = ["1", "2", "4", "8", "16", "32", "256", "16384", "32768"];
                        this.items.forEach((data) => {
                            data.disabled = arr.indexOf(data.value) == -1;
                            selectArr.push(data);
                        });
                    } else {
                        this.items.forEach((data) => {
                            data.disabled = false;
                            selectArr.push(data);
                        });
                    }
                } else {
                    this.items.forEach((data) => {
                        data.disabled = false;
                        selectArr.push(data);
                    });
                }

            }
            this.areaTypeItems = selectArr;
        }
    }


}
</script>

<style lang="scss" scoped>
.main {
    margin: 0px;
    padding: 0px;
}

.formAction {
    z-index: 1;
    width: 480px;
    height: 550px;
    top: 10px;
    position: absolute;
    right: 20px;
}

.formClass {
    height: 380px; // overflow-y: auto;
}

.clearfix:after {
    clear: both
}

.box-card {
    width: 480px;
    height: 480px;
}

.el-card__header {
    padding: 5px 10px 5px 10px;
}

.inputStype {
    width: 330px;
}

.action {
    text-align: right;
    line-height: 36px;
    margin-bottom: 20px;
    margin-right: 20px;
}
</style>