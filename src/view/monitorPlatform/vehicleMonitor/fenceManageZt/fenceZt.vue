<template>
    <div class="mainZT">
        <component :is="$store.getters.mapName" style="width: 100%;height: 100%;overflow: hidden;margin:0;" id="fenceActionZt" @ready="readyLoad"></component>
        <div class="formAction" v-show="isShow">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="line-height: 1;font-size: 18px;">{{$t("fenceManage.zt.name")}}</span>
                    <el-button-group style="float: right;">
                        <el-button size="small" type="primary" :loading="subStatus" @click="submitFence">{{$t('action.save')}}</el-button>
                        <el-button size="small" @click="comeBack">{{$t("action.back")}}</el-button>
                    </el-button-group>
                </div>
                <cv-scrollbar class="formClass">
                    <!-- <div class="formClass"> -->
                    <el-form :model="fenceForm" :rules="rules" :inline="true" label-width="100px" ref="fenceForm">
                        <el-form-item style="text-align:left;margin-right:0px;width:100%;">
                            <el-button @click="Addpolygon" style="margin-left:15px;width:250%;" type="primary">{{$t('fenceManage.zt.select')}}</el-button>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.ruleName')" prop="fenceName">
                            <el-input v-model="fenceForm.fenceName" size="small" :placeholder="$t('placeholder.inputValue')" class="inputStype"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.area')">
                            <el-select style="width:300px;" size="small" v-model="fenceForm.area">
                                <el-option v-for="item in ztArea" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.areaType')" prop="fenceType">
                            <el-select v-model="fenceForm.fenceType" multiple style="width:300px" @change="typeChange" @remove-tag="removeRuleType" size="small" :placeholder="$t('placeholder.selectValue')">
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
                            <el-date-picker style="width:300px;" size="small" v-model="fenceForm.date" align="right" type="datetimerange" :clearable="false" :editable="false" :placeholder="$t('el.datepicker.selectDateTime')">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.time')" prop="time" v-show="isShowTimeInput">
                            <el-time-picker style="width:300px;" size="small" is-range v-model="fenceForm.time" align="right" :editable="false" :placeholder="$t('el.datepicker.selectTime')">
                            </el-time-picker>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.limitrpm')" prop="limitrpm" v-show="isShowLimitSpeed">
                            <el-input :maxlength="4" style="width:150px;" type="text" size="small" v-model="fenceForm.limitrpm"></el-input><span style="position:absolute;">&nbsp;(r/min)</span>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.aspeed')" prop="aspeed" v-show="isShowLimitSpeed">
                            <el-input :maxlength="3" style="width:150px;" type="text" size="small" v-model="fenceForm.aspeed"></el-input><span style="position:absolute;">&nbsp;(km/h)</span>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.remark')" prop="remark">
                            <el-input type="textarea" :rows="3" size="small" v-model="fenceForm.remark" :placeholder="$t('placeholder.inputValue')" class="inputStype"></el-input>
                        </el-form-item>
                    </el-form>
                    <!-- </div> -->
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
            if ((value - 600) >= 0 && (value - 2000) <= 0) {
                callback()
            } else {
                callback(new Error('转速范围600-2000'))
            }
        };
        var o2 = (rule, value, callback) => {
            if ((value - 0) >= 0 && (value - 100) <= 0) {
                callback()
            } else {
                callback(new Error('限速范围0-100'))
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
                remark: "",
                date: [],
                time: [],
                limitrpm: "900",
                aspeed: "20",
                limitSpeed: "",
                dateType: 0,
                area: '2'
            },
            rules: {
                fenceName: [
                    { required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
                    { min: 2, max: 15, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 2, max: 15 }) },
                    { pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: this.$t('filter.type4') }
                ],
                remark: [
                    { min: 0, max: 150, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 0, max: 150 }) },
                ],
                date: [
                    { type: 'array', required: false, message: this.$t('el.datepicker.selectDate'), trigger: 'change' },
                    { validator: isNullOrDate, trigger: 'blur,change' }
                ],
                time: [
                    { type: 'array', required: false, message: this.$t('el.datepicker.selectTime'), trigger: 'change' },
                    { validator: isNullOrTime, trigger: 'blur,change' }
                ],
                limitrpm: [
                    { required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
                    { validator: o1, trigger: 'blur,change' },
                    { pattern: /^[0-9]*$/, message: this.$t('filter.type2') }
                ],
                aspeed: [
                    { required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
                    { validator: o2, trigger: 'blur,change' },
                    { pattern: /^[0-9]*$/, message: this.$t('filter.type2') }
                ],
                fenceType: [
                    { type: 'array', required: true, message: '请选择围栏属性', trigger: 'change' }
                ]
            },
            ztArea: [
                {
                    value: '2',
                    label: '禁区'
                },
                {
                    value: '1',
                    label: '装货区'
                },
                {
                    value: '3',
                    label: '倾倒区'
                }
            ],
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
                label: this.$t("common.fenceZt.256"),
                disabled: true
            },
            {
                value: "512",
                label: this.$t("common.fenceZt.512"),
                disabled: true
            }, {
                value: "1024",
                label: this.$t("common.fenceZt.1024"),
                disabled: true
            }, {
                value: "2048",
                label: this.$t("common.fenceZt.2048"),
                disabled: true
            }, {
                value: "4096",
                label: this.$t("common.fenceZt.4096"),
                disabled: true
            }],
            isShow: true,
            overlay: null
        };
    }, computed: {
        isShowDateTime: function() {
            if (this.fenceForm.fenceType.findIndex(x => x == "1") > -1) {
                return true;
            } else {
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
            let isShow = this.fenceForm.fenceType.findIndex(x => {
                switch (x) {
                    case '2':
                        return true;
                    case '256':
                        return true;
                    case '512':
                        return true;
                    case '1024':
                        return true;
                }
            })
            return isShow > -1 ? true : false;
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
            if (val[index] == "2") {
                this.getIndexSplice(["256", "512", "1024"]);
            } else if (val[index] == "256") {
                this.getIndexSplice(["2", "512", "1024"]);
            } else if (val[index] == "512") {
                this.getIndexSplice(["2", "256", "1024"]);
            } else if (val[index] == '1024') {
                this.getIndexSplice(["2", "256", "512"]);
            } else if (val[index] == "2048") {
                this.getIndexSplice(["4096"]);
            } else if (val[index] == "4096") {
                this.getIndexSplice(["2048"]);
            }
        },
        comeBack() {
            this.options.name = "fenceMainZt";
            this.options.id = "";
            this.$refs["fenceForm"].resetFields();
        },
        //添加多边形
        Addpolygon() {
            this.isShow = false;
            this.clearOverlay();
            this.fenceForm.ruleType = 3;
            this.$map["fenceActionZt"].onclickPolygon((options) => {
                this.overlay = options.overlay;
                this.$map["fenceActionZt"].overlayEdit(options.overlay, true);
                this.isShow = true;
            });
        },
        clearOverlay() {
            this.clearMap();
        },
        //清空地图
        clearMap() {
            if (this.overlay) {
                this.$map['fenceActionZt'].removeOverlay(this.overlay);
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
                            this.fenceActionZt(this.$COMMON.baseUrl + "/fenece/updatefencerule", params);
                        }
                        else {
                            this.fenceActionZt(this.$COMMON.baseUrl + "/fenece/insertfencerule", params);
                        }
                    } else {
                        this.$message.error({ message: this.$t("action.addOverlay") });
                    }

                } else {
                    return false;
                }

            });
        },
        fenceActionZt(url, params) {
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
                    this.options.name = "fenceMainZt";

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
                // console.log(data)
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
                        areaNameAndType.push({ areaType: data, limitrpm: this.fenceForm.limitrpm, aspeed: this.fenceForm.aspeed });
                        break;
                    case "256":
                        areaNameAndType.push({ areaType: data, limitrpm: this.fenceForm.limitrpm, aspeed: this.fenceForm.aspeed });
                        break;
                    case "512":
                        areaNameAndType.push({ areaType: data, limitrpm: this.fenceForm.limitrpm, aspeed: this.fenceForm.aspeed });
                        break;
                    case "1024":
                        areaNameAndType.push({ areaType: data, limitrpm: this.fenceForm.limitrpm, aspeed: this.fenceForm.aspeed });
                        break;
                    default:
                        areaNameAndType.push({ areaType: data });
                        break;
                }
            });
            switch (this.fenceForm.ruleType) {

                case 1:
                    options = this.$map["fenceActionZt"].getCircleOptions(this.overlay);
                    requestPoint.push({ latitude: options.center.lat, longitude: options.center.lng });
                    this.radius = parseInt(options.radius);
                    break;
                case 2:
                    break;
                case 3:
                    options = this.$map["fenceActionZt"].getPolygonOptions(this.overlay);
                    options.points.forEach((data) => {
                        requestPoint.push({ latitude: data.lat, longitude: data.lng });
                    });
                    break;
                case 4:
                    options = this.$map["fenceActionZt"].getLineOptions(this.overlay);
                    options.points.forEach((data) => {
                        requestPoint.push({ latitude: data.lat, longitude: data.lng });
                    });
                    break;
                default:
                    break;

            };
            let parmas = {
                id: this.fenceForm.id, mapType: 1, ruleName: this.fenceForm.fenceName, ruleType: this.fenceForm.ruleType,
                requestPoint: requestPoint, radius: this.radius, remarksss: this.fenceForm.remark, areaNameAndType: areaNameAndType,
                type: this.options.type, area: this.fenceForm.area
            };
            return parmas;
        },
        getFenceToUpdate(id, type) {
            let params = { id: id, mapType: 1, type: type };
            let loadingInstance = this.$loading({
                text: "正在拼命加载中",
                target: document.querySelector('.el-card')
            });
            this.$store.dispatch("queryGetFenceRule", params).then((data) => {
                this.fenceForm.ruleType = data.data.ruleType;
                this.fenceForm.area = data.data.area + "";
                data.data.areaNameAndType.forEach(ele => {
                    ele['limitrpm'] && (this.fenceForm.limitrpm = ele['limitrpm'] + '')
                    ele['aspeed'] && (this.fenceForm.aspeed = ele['aspeed'] + '')
                })
                switch (data.data.ruleType) {
                    //圆形
                    case 1:
                        let pointarr = data.data.requestPoint[0];
                        let points = { lat: pointarr.latitude, lng: pointarr.longitude };
                        this.radius = data.data.radius;
                        let point = this.$map["fenceActionZt"].point(points);
                        this.overlay = this.$map["fenceActionZt"].mapAddcircle(point, this.radius);
                        break;
                    //多边形
                    case 3:
                        let polygonPoints = [];
                        data.data.requestPoint.forEach((data) => {
                            polygonPoints.push({ lat: data.latitude, lng: data.longitude });
                        });
                        this.overlay = this.$map["fenceActionZt"].mapAddpolygon(polygonPoints, {});
                        break;
                    case 4:
                        let polylinePoints = [];
                        data.data.requestPoint.forEach((data) => {
                            polylinePoints.push({ lat: data.latitude, lng: data.longitude });
                        });
                        this.overlay = this.$map["fenceActionZt"].mapAddline(polylinePoints, {});
                        break;
                    default:
                        break;
                }
                this.$map["fenceActionZt"].overlayEdit(this.overlay, true);
                this.areaTypeSetVal(data.data);
                loadingInstance.close();
            });
        },
        areaTypeSetVal(data) {
            let startTime = "", endTime = "";
            this.fenceForm.fenceName = data.ruleName;
            this.fenceForm.remark = data.remarksss;
            data.areaNameAndType.forEach((data) => {
                this.fenceForm.fenceType.push(data.areaType.toString());
                switch (data.areaType) {
                    case 1:
                        this.fenceForm.dateType = parseInt(data.dataType);
                        if (this.fenceForm.dateType == 0) {
                            startTime = this.$service.dateTimeParse(data.startTime);
                            endTime = this.$service.dateTimeParse(data.endTime);
                            this.fenceForm.date = [startTime, endTime];
                        } else {
                            startTime = this.$service.timeParse(data.startTime);
                            endTime = this.$service.timeParse(data.endTime);
                            this.fenceForm.time = [startTime, endTime];
                        }
                        break;
                    case 2:
                        this.fenceForm.speedTime = data.aseconds;
                        this.fenceForm.speed = data.aspeed;
                        this.isSpeed = true;
                        break;
                    default:
                        break;
                }
            });
        },
        getIndexSplice(arr) {
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
        let selectArr = [];
        this.items.forEach((data) => {
            data.disabled = false;
            selectArr.push(data);
        });
        this.areaTypeItems = selectArr;
        !this.options.isModify && (this.fenceForm.fenceType = ['2', '4', '8', '16', '32', '2048'])
    }, watch: {
        'fenceForm.date'(newval) {
        },
        'fenceForm.area'(newval) {
            if (this.options.isModify) {

            } else {
                if (newval == 1) {
                    // this.fenceForm.fenceType = this.$service.extend(this.fenceForm.fenceType, ['4096','4','8','16','32','1024'])
                    this.fenceForm.fenceType = ['4096', '4', '8', '16', '32', '1024']
                    // console.log(this.fenceForm.fenceType)
                } else if (newval == 2) {
                    // this.fenceForm.fenceType = this.$service.extend(this.fenceForm.fenceType, ['2','4','8','16','32','2048'])
                    // console.log(this.fenceForm.fenceType)
                    this.fenceForm.fenceType = ['2', '4', '8', '16', '32', '2048']
                } else {
                    // this.fenceForm.fenceType = this.$service.extend(this.fenceForm.fenceType, ['4','8','16','32'])
                    // console.log(this.fenceForm.fenceType)
                    this.fenceForm.fenceType = ['4', '8', '16', '32']
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.mainZT {
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
    .el-form-item {
        margin-bottom: 20px;
    }
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
    width: 300px;
}

// .action {
//     text-align: right;
//     line-height: 36px;
//     margin-bottom: 20px;
//     margin-right: 20px;
// }
</style>