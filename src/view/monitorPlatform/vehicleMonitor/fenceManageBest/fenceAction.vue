<template>
    <div class="main">
        <component :is="$store.getters.mapName" style="width: 100%;height: 100%;overflow: hidden;margin:0;" id="fenceActionBest" @ready="readyLoad"></component>
        <div class="formAction" v-show="isShow">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="line-height: 1;font-size: 18px;">{{$t("fenceManage.fenceManage")}}</span>
                    <el-button-group style="float: right;">
                        <el-button size="small" type="success" @click="previews">{{'预览'}}</el-button>
                        <el-button size="small" type="primary" :loading="subStatus" @click="submitFence">{{'保存'}}</el-button>
                        <el-button size="small" @click="nextBtn" v-if="next">
                            {{showfenceLine?'上一步':'下一步'}}
                        </el-button>
                        <el-button size="small" @click="comeBack">{{$t("action.back")}}</el-button>
                    </el-button-group>
                </div>
                <cv-scrollbar class="formClass">
                    <el-form :model="fenceForm" :rules="rules" :inline="true" label-width="97px" ref="fenceForm">
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
                        <!-- 圆形 -->
                        <el-form-item label="中心点" prop="enterPoints" v-show="typeShow.radius">
                            <el-input v-model="fenceForm.enterPoints" size="small" placeholder="经度,纬度" class="inputStype"></el-input>
                        </el-form-item>
                        <el-form-item label="半径(m)" prop="radius" v-show="typeShow.radius">
                            <el-input v-model="fenceForm.radius" size="small" placeholder="半径" class="inputStype"></el-input>
                        </el-form-item>
                        <!-- 矩形 -->
                        <el-form-item label="左上角经纬度" prop="lbrectangle" v-show="typeShow.rectangle">
                            <el-input v-model="fenceForm.lbrectangle" size="small" placeholder="经度,纬度" class="inputStype"></el-input>
                        </el-form-item>
                        <el-form-item label="右下角经纬度" prop="rtrectangle" v-show="typeShow.rectangle">
                            <el-input v-model="fenceForm.rtrectangle" size="small" placeholder="经度,纬度" class="inputStype"></el-input>
                        </el-form-item>
                        <!-- 多边形 -->
                        <el-form-item label="经纬度" prop="poly" v-show="typeShow.polyEditor">
                            <el-input v-model="fenceForm.poly" size="small" placeholder="经度,纬度;经度,纬度" class="inputStype"></el-input>
                        </el-form-item>
                        <!-- 线形 -->
                        <el-form-item label="经纬度" prop="line" v-show="typeShow.line">
                            <el-input v-model="fenceForm.line" size="small" placeholder="经度,纬度;经度,纬度" class="inputStype"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.areaType')" prop="fenceType">
                            <el-select v-model="fenceForm.fenceType" multiple style="width:330px" @change="typeChange" @remove-tag="removeRuleType" size="small" :placeholder="$t('placeholder.selectValue')">
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
                            <el-input :maxlength="3" type="text" size="small" v-model="fenceForm.speed"></el-input><span style="position:absolute;">&nbsp;(km/h)</span>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.aseconds')" prop="speedTime" v-show="isShowLimitSpeed">
                            <el-input :maxlength="3" type="text" size="small" v-model="fenceForm.speedTime"></el-input><span style="position:absolute;">&nbsp;(s)</span>
                        </el-form-item>
                        <el-form-item :label="$t('fenceManage.remark')" prop="remark">
                            <el-input type="textarea" :rows="3" size="small" v-model="fenceForm.remark" :placeholder="$t('placeholder.inputValue')" class="inputStype"></el-input>
                        </el-form-item>
                    </el-form>
                </cv-scrollbar>
            </el-card>
            <fenceLine 
                class="fenceLine" 
                :options="linesData"
                :class="{fenceCurrent: showfenceLine ? true:false}"></fenceLine>
        </div>
    </div>
</template>

<script>
import filters from "@/utils/filter";
import fenceLine from "./fenceLineSet.vue";
export default {
  components: { fenceLine },
  props: {
    options: {}
  },
  data() {
    var isNullOrDate = (rule, value, callback) => {
      if (
        this.fenceForm.fenceType.findIndex(x => x == "1") > -1 &&
        this.fenceForm.dateType == 0
      ) {
        if (value.length == 0) {
          callback(new Error("请选择日期"));
        } else {
          if (value[0] == null || value[1] == null) {
            callback(new Error("请选择日期"));
          } else {
            callback();
          }
        }
      } else {
        callback();
      }
    };
    var isNullOrTime = (rule, value, callback) => {
      if (
        this.fenceForm.fenceType.findIndex(x => x == "1") > -1 &&
        this.fenceForm.dateType == 1
      ) {
        if (value.length == 0) {
          callback(new Error("请选择时间"));
        } else {
          if (value[0] == null || value[1] == null) {
            callback(new Error("请选择时间"));
          } else {
            callback();
          }
        }
      } else {
        callback();
      }
    };
    var o1 = (rule, value, callback) => {
      if (value >= 0 && value - 100 <= 0) {
        callback();
      } else {
        callback(new Error("限速范围0(km/h)-100(km/h)"));
      }
    };
    var o2 = (rule, value, callback) => {
      if (value >= 0 && value - 100 <= 0) {
        callback();
      } else {
        callback(new Error("限速时长范围0(s)-100(s)"));
      }
    };
    return {
      changePoint: false,
      orginArr: [],
      latOrgin: Number,
      lanOrgin: Number,
      //点击下一步之前先点击预览
      isNext: false,
      //是否显示下一步
      next: false,
      // 线路围栏修改参数
      linesData: [],
      showfenceLine: false,
      subStatus: false,
      selectDisabled: true,
      radius: 0,
      disBtn: false,
      btnText: false,
      // 显示类型
      typeShow: {
        radius: false,
        rectangle: false,
        polyEditor: false,
        line: false
      },
      fenceForm: {
        id: "",
        fenceName: "",
        fenceType: [],
        // 输入经纬度
        enterPoints: "",
        // 圆半径
        radius: "",
        // 左下角矩形
        lbrectangle: "",
        // 右上角矩形
        rtrectangle: "",
        poly: "",
        line: "",
        ruleType: "",
        remark: "",
        date: [],
        time: [],
        speed: "0",
        speedTime: "0",
        limitSpeed: "",
        dateType: 0
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
          {
            required: true,
            message: this.$t("filter.notEmpty"),
            trigger: "blur,change"
          },
          {
            min: 2,
            max: 15,
            message: this.$filter.lanReplace(this.$t("filter.Length"), {
              min: 2,
              max: 15
            })
          },
          {
            pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            message: this.$t("filter.type4")
          }
        ],
        enterPoints: [
          {
            required: false,
            message: this.$t("filter.notEmpty"),
            trigger: "blur,change"
          },
          {
            pattern: /([0-9]+[.]?[0-9]*)([,]{1})([0-9]+[.]?[0-9]*)$/,
            message: "经度纬度为数字,中间逗号隔开"
          }
        ],
        radius: [
          {
            required: false,
            message: this.$t("filter.notEmpty"),
            trigger: "blur,change"
          },
          {
            pattern: /^[1-9][0-9]*$/,
            message: this.$t("filter.type2") + "或者第一位数字不能为0"
          }
        ],
        lbrectangle: [
          {
            required: false,
            message: this.$t("filter.notEmpty"),
            trigger: "blur,change"
          },
          {
            pattern: /([0-9]+[.]?[0-9]*)([,]{1})([0-9]+[.]?[0-9]*)$/,
            message: this.$t("filter.type2") + "或者第一位数字不能为0"
          }
        ],
        rtrectangle: [
          {
            required: false,
            message: this.$t("filter.notEmpty"),
            trigger: "blur,change"
          },
          {
            pattern: /([0-9]+[.]?[0-9]*)([,]{1})([0-9]+[.]?[0-9]*)$/,
            message: this.$t("filter.type2") + "或者第一位数字不能为0"
          }
        ],
        poly: [
          {
            required: false,
            message: this.$t("filter.notEmpty"),
            trigger: "blur,change"
          },
          {
            pattern: /(([0-9]+[.]?[0-9]*)([,]{1})([0-9]+[.]?[0-9]*);)+$/,
            message: "正确格式:经度,纬度;经度,纬度;..."
          }
        ],
        line: [
          {
            required: false,
            message: this.$t("filter.notEmpty"),
            trigger: "blur,change"
          },
          {
            pattern: /(([0-9]+[.]?[0-9]*)([,]{1})([0-9]+[.]?[0-9]*);)+$/,
            message: "正确格式:经度,纬度;经度,纬度;..."
          }
        ],
        remark: [
          {
            min: 0,
            max: 150,
            message: this.$filter.lanReplace(this.$t("filter.Length"), {
              min: 0,
              max: 150
            })
          }
        ],
        date: [
          {
            type: "array",
            required: false,
            message: this.$t("el.datepicker.selectDate"),
            trigger: "change"
          },
          { validator: isNullOrDate, trigger: "blur,change" }
        ],
        time: [
          {
            type: "array",
            required: false,
            message: this.$t("el.datepicker.selectTime"),
            trigger: "change"
          },
          { validator: isNullOrTime, trigger: "blur,change" }
        ],
        speed: [
          {
            required: true,
            message: this.$t("filter.notEmpty"),
            trigger: "blur,change"
          },
          { validator: o1, trigger: "blur,change" },
          { pattern: /^[0-9]*$/, message: this.$t("filter.type2") }
        ],
        speedTime: [
          {
            required: true,
            message: this.$t("filter.notEmpty"),
            trigger: "blur,change"
          },
          { validator: o2, trigger: "blur,change" },
          { pattern: /^[0-9]*$/, message: this.$t("filter.type2") }
        ],
        fenceType: [
          {
            type: "array",
            required: true,
            message: "请选择围栏属性",
            trigger: "change"
          }
        ]
      },
      areaTypeItems: [],
      items: [
        {
          value: "1",
          label: this.$t("common.fence.1"),
          disabled: true
        },
        {
          value: "2",
          label: this.$t("common.fence.2"),
          disabled: true
        },
        {
          value: "4",
          label: this.$t("common.fence.4"),
          disabled: true
        },
        {
          value: "8",
          label: this.$t("common.fence.8"),
          disabled: true
        },
        {
          value: "16",
          label: this.$t("common.fence.16"),
          disabled: true
        },
        {
          value: "32",
          label: this.$t("common.fence.32"),
          disabled: true
        },
        {
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
        },
        {
          value: "32768",
          label: this.$t("common.fence.32768"),
          disabled: true
        }
      ],
      isShow: true,
      overlay: null
    };
  },
  computed: {
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
      if (
        this.fenceForm.fenceType.findIndex(x => x == "1") > -1 &&
        this.fenceForm.dateType == 0
      ) {
        this.rules.date[0].required = true;
        return true;
      } else {
        this.rules.date[0].required = false;
        this.fenceForm.date = [];
        return false;
      }
    },
    isShowTimeInput: function() {
      if (
        this.fenceForm.fenceType.findIndex(x => x == "1") > -1 &&
        this.fenceForm.dateType == 1
      ) {
        this.rules.time[0].required = true;
        return true;
      } else {
        this.rules.time[0].required = false;
        this.fenceForm.time = [];
        return false;
      }
    },
    isShowLimitSpeed: function() {
      return this.fenceForm.fenceType.findIndex(x => x == "2") > -1
        ? true
        : false;
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
      } else {
      }
    },
    nextBtn() {
      this.$refs["fenceForm"].validate(valid => {
        if (valid) {
          this.showfenceLine = !this.showfenceLine;
        } else {
          return false;
        }
      });
    },
    comeBack() {
      this.options.name = "fenceMain";
      this.options.id = "";
      this.$refs["fenceForm"].resetFields();
    },
    //添加圆形
    Addcircle() {
      this.next = false;
      this.typeShow = {
        radius: true,
        rectangle: false,
        polyEditor: false,
        line: false
      };
      // this.btnText = true;
      this.rules.enterPoints[0].required = true;
      this.rules.radius[0].required = true;
      this.rules.lbrectangle[0].required = false;
      this.rules.rtrectangle[0].required = false;
      this.rules.poly[0].required = false;
      this.rules.line[0].required = false;
      this.selectDisabled = false;
      this.clearOverlay();
      this.fenceForm.ruleType = 1;
    },
    //添加矩形
    Addrectangle() {
      this.next = false;
      this.typeShow = {
        radius: false,
        rectangle: true,
        polyEditor: false,
        line: false
      };
      this.btnText = true;
      this.rules.enterPoints[0].required = false;
      this.rules.radius[0].required = false;
      this.rules.lbrectangle[0].required = true;
      this.rules.rtrectangle[0].required = true;
      this.rules.poly[0].required = false;
      this.rules.line[0].required = false;
      this.selectDisabled = false;
      this.clearOverlay();
      this.fenceForm.ruleType = 2;
      // this.$map["fenceActionBest"].onclickRectangle(options => {
      //   this.overlay = options.overlay;
      //   this.$map["fenceActionBest"].overlayEdit(
      //     options.overlay,
      //     "RectangleEditor"
      //   );
      //   this.isShow = true;
      // });
    },
    //添加多边形
    Addpolygon() {
      this.next = false;
      this.typeShow = {
        radius: false,
        rectangle: false,
        polyEditor: true,
        line: false
      };
      // this.btnText = true;
      this.rules.enterPoints[0].required = false;
      this.rules.radius[0].required = false;
      this.rules.lbrectangle[0].required = false;
      this.rules.rtrectangle[0].required = false;
      this.rules.poly[0].required = true;
      this.rules.line[0].required = false;
      this.selectDisabled = false;
      this.clearOverlay();
      this.fenceForm.ruleType = 3;
      // this.$map["fenceActionBest"].onclickPolygon(options => {
      //   this.overlay = options.overlay;
      //   this.$map["fenceActionBest"].overlayEdit(options.overlay, "PolyEditor");
      //   this.isShow = true;
      // });
    },
    //添加线形
    Addline() {
      this.next = true;
      this.typeShow = {
        radius: false,
        rectangle: false,
        polyEditor: false,
        line: true
      };
      this.rules.enterPoints[0].required = false;
      this.rules.radius[0].required = false;
      this.rules.lbrectangle[0].required = false;
      this.rules.rtrectangle[0].required = false;
      this.rules.poly[0].required = false;
      this.rules.line[0].required = true;
      this.selectDisabled = false;
      this.clearOverlay();
      this.fenceForm.ruleType = 4;
      // this.$map["fenceActionBest"].onclickLine(options => {
      //   this.overlay = options.overlay;
      //   this.$map["fenceActionBest"].overlayEdit(options.overlay, "PolyEditor");
      //   this.isShow = true;
      // });
    },
    clearOverlay() {
      this.clearMap();
    },
    //清空地图
    clearMap() {
      if (this.overlay) {
        this.$map["fenceActionBest"].clearOverlays();
        this.overlay = null;
        this.fenceForm.ruleType = "";
      }
    },
    // 预览
    previews() {
      const that = this;
      this.$map["fenceActionBest"].clearOverlays();
      if (this.overlay)
        this.$map["fenceActionBest"].removeOverlay(this.overlay);
      if (this.infoWindow)
        this.$map["fenceActionBest"].closeInfoWindow(this.infoWindow);
      let callbackInfoWindow = function(infoWindow) {
        that.infoWindow = infoWindow;
      };
      this.$refs["fenceForm"].validate(valid => {
        if (valid) {
          switch (this.fenceForm.ruleType) {
            case 1:
              // 圆形
              let enterPoints = this.fenceForm.enterPoints.split(",");
              let radiusT = this.fenceForm.radius;
              let pointsP = this.$map["fenceActionBest"].transform(
                Number(enterPoints[1]),
                Number(enterPoints[0])
              );
              this.overlay = this.$map["fenceActionBest"].mapAddcircle(
                pointsP,
                radiusT
              );
              this.$map["fenceActionBest"].overlayClickOpenInfoWindow(
                this.overlay,
                this.overlay.getBounds().getCenter(),
                "",
                callbackInfoWindow,
                {}
              );
              this.$map["fenceActionBest"].getBestView(); //pointsP
              this.$map["fenceActionBest"].openInfoWindow(
                "",
                this.overlay,
                this.overlay.getBounds().getCenter()
              );
              break;
            case 2:
              // 矩形
              let rectangleDataP = {};
              // 左上角
              let leftBottom = this.fenceForm.lbrectangle.split(",");
              // 右下角
              let rightTop = this.fenceForm.rtrectangle.split(",");
              let point1 = this.$map["fenceActionBest"].transform(
                Number(leftBottom[1]),
                Number(leftBottom[0])
              );
              let point2 = this.$map["fenceActionBest"].transform(
                Number(rightTop[1]),
                Number(rightTop[0])
              );
              rectangleDataP.minLng = point1.lng;
              rectangleDataP.minLat = point2.lat;
              rectangleDataP.maxLng = point2.lng;
              rectangleDataP.maxLat = point1.lat;
              this.overlay = this.$map["fenceActionBest"].mapAddrectangle(
                rectangleDataP,
                {}
              );
              this.$map["fenceActionBest"].overlayClickOpenInfoWindow(
                this.overlay,
                this.overlay.getBounds().getCenter(),
                "",
                callbackInfoWindow,
                {}
              );

              this.$map["fenceActionBest"].openInfoWindow(
                "",
                this.overlay,
                this.overlay.getBounds().getCenter()
              );

              break;
            case 3:
              // 多边形
              let polygonPointsP = [];
              let that = [];
              let polys = this.fenceForm.poly
                .substr(0, this.fenceForm.poly.length - 1)
                .split(";");
              polys.forEach(poly => {
                that = poly.split(",");

                polygonPointsP.push(
                  this.$map["fenceActionBest"].transform(
                    Number(that[1]),
                    Number(that[0])
                  )
                );
              });
              this.overlay = this.$map["fenceActionBest"].mapAddpolygon(
                polygonPointsP,
                {}
              );
              this.$map["fenceActionBest"].overlayClickOpenInfoWindow(
                this.overlay,
                this.overlay.getBounds().getCenter(),
                "",
                callbackInfoWindow,
                {}
              );
              this.$map["fenceActionBest"].getBestView(); //polygonPointsP
              this.$map["fenceActionBest"].openInfoWindow(
                "",
                this.overlay,
                this.overlay.getBounds().getCenter()
              );
              break;
            case 4:
              // 线形
              let linePointsP = [];
              let lines = this.fenceForm.line
                .substr(0, this.fenceForm.line.length - 1)
                .split(";");
              this.linesData = [];
              lines.forEach((line, index) => {
                this.linesData.push({
                  //路段编号
                  sectionsId: index + 1,
                  //区域属性
                  areaAttributes: ["0", "0"],
                  //拐点编号
                  inflectionId: index + 1,
                  //行驶过长值
                  desconds: "0",
                  //行驶过低值
                  dlowseconds: "0",
                  //超速速度
                  aspeed: "1",
                  //超速持续时间
                  aseconds: "2",
                  //宽度
                  width: "0",
                  //限制转速
                  limitrpm: "1",
                  mucktruckfencepro: "0",
                  sequence: index + 1
                });
                let lines = line.split(",");
                linePointsP.push(
                  this.$map["fenceActionBest"].transform(
                    Number(lines[1]),
                    Number(lines[0])
                  )
                );
              });
              this.overlay = this.$map["fenceActionBest"].mapAddline(
                linePointsP,
                {}
              );
              this.$map["fenceActionBest"].overlayClickOpenInfoWindow(
                this.overlay,
                this.overlay.getBounds().getCenter(),
                "",
                callbackInfoWindow,
                {}
              );
              this.$map["fenceActionBest"].getBestView(); //linePointsP
              this.$map["fenceActionBest"].openInfoWindow(
                "",
                this.overlay,
                this.overlay.getBounds().getCenter()
              );
              break;
          }
        } else {
          return false;
        }
      });
    },
    //保存时的调用方法;
    submitFence() {
      this.$refs["fenceForm"].validate(valid => {
        if (valid) {
          let params = this.getParmas();
          if (this.fenceForm.ruleType == 1 && this.radius == 0) {
            this.$message.error({ message: "圆形半径不能为0" });
            return false;
          }
          if (this.fenceForm.id != "") {
            this.fenceActionBest(
              this.$COMMON.baseUrl + "/fenece/updatefencerule",
              params
            );
          } else {
            this.fenceActionBest(
              this.$COMMON.baseUrl + "/fenece/insertfencerule",
              params
            );
          }
        } else {
          return false;
        }
      });
    },
    fenceActionBest(url, params) {
      this.subStatus = true;
      this.$http({
        url: url,
        data: JSON.stringify(params)
      })
        .then(data => {
          // this.options.isModify ? (this.btnText = "保存") : (this.btnText = "预览");
          if (!data.flag && !!data.errorCode)
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
          else {
            this.$refs["fenceForm"].resetFields();
            this.clearOverlay();
            this.options.id = "";
            this.options.name = "fenceMain";

            this.$message.success({ message: this.$t("action.actionSuccess") });
          }
          this.subStatus = false;
        })
        .catch(_ => {
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
        endTime: null
      };
      let areaNameAndType = [],
        requestPoint = [],
        options = {};
      this.fenceForm.fenceType.forEach(data => {
        switch (data) {
          case "1":
            if (this.fenceForm.dateType == 0) {
              areaNameAndType.push({
                areaType: data,
                startTime: filters.format(
                  this.fenceForm.date[0],
                  "yyyy-MM-dd HH:mm:ss"
                ),
                endTime: filters.format(
                  this.fenceForm.date[1],
                  "yyyy-MM-dd HH:mm:ss"
                ),
                dataType: this.fenceForm.dateType
              });
            } else {
              areaNameAndType.push({
                areaType: data,
                startTime: filters.format(this.fenceForm.time[0], "HH:mm:ss"),
                endTime: filters.format(this.fenceForm.time[1], "HH:mm:ss"),
                dataType: this.fenceForm.dateType
              });
            }
            break;
          case "2":
            areaNameAndType.push({
              areaType: data,
              aseconds: this.fenceForm.speedTime + "",
              aspeed: this.fenceForm.speed + ""
            });
            break;
          default:
            areaNameAndType.push({ areaType: data });
            break;
        }
      });
      switch (this.fenceForm.ruleType) {
        case 1:
          // options = this.$map["fenceActionBest"].getCircleOptions(this.overlay);
          // if (this.options.id != "") {
          this.orginArr = this.fenceForm.enterPoints.split(",");
          requestPoint.push({
            latitude: this.orginArr[1] * Math.pow(10, 6),
            longitude: this.orginArr[0] * Math.pow(10, 6)
          });
          this.radius = parseInt(this.fenceForm.radius);
          // } else {
          //   requestPoint.push({
          //     latitude: options.center.lat * Math.pow(10, 6),
          //     longitude: options.center.lng * Math.pow(10, 6)
          //   });
          //   this.radius = parseInt(options.radius);
          // }
          break;
        case 2:
          options = this.$map["fenceActionBest"].getPolygonOptions(
            this.overlay
          );
          let lngArr = [],
            latArr = [],
            maxPoint = {},
            minPoint = {};
          // if (this.options.id == "") {
          // options.points.forEach(data => {
          //   lngArr.push(data.lng * Math.pow(10, 6));
          //   latArr.push(data.lat * Math.pow(10, 6));
          // });
          // maxPoint.longitude = Math.min.apply(Math, lngArr);
          // maxPoint.latitude = Math.max.apply(Math, latArr);
          // minPoint.longitude = Math.max.apply(Math, lngArr);
          // minPoint.latitude = Math.min.apply(Math, latArr);
          // requestPoint.push(maxPoint, minPoint);
          // } else {
          let leftArt = this.fenceForm.lbrectangle.split(",");
          let rightArt = this.fenceForm.rtrectangle.split(",");
          maxPoint.longitude = leftArt[0] * Math.pow(10, 6);
          maxPoint.latitude = leftArt[1] * Math.pow(10, 6);
          minPoint.longitude = rightArt[0] * Math.pow(10, 6);
          minPoint.latitude = rightArt[1] * Math.pow(10, 6);
          requestPoint.push(maxPoint, minPoint);
          // }
          break;
        case 3:
          // options = this.$map["fenceActionBest"].getPolygonOptions(this.overlay);
          //多边形传参时坐标点的重新赋值
          // if (this.options.id != "") {

          let nextAry = [];
          let ary = this.fenceForm.poly.split(";");
          ary.pop();
          ary.forEach(data => {
            nextAry = data.split(",");
            requestPoint.push({
              latitude: nextAry[1] * Math.pow(10, 6),
              longitude: nextAry[0] * Math.pow(10, 6)
            });
          });
          // } else {
          //   options.points.forEach(data => {
          //     requestPoint.push({
          //       latitude: data.lat * Math.pow(10, 6),
          //       longitude: data.lng * Math.pow(10, 6)
          //     });
          //   });
          // }

          break;
        case 4:
          //线段围栏的数据传递
          // options = this.$map["fenceActionBest"].getLineOptions(this.overlay);
          // if (this.options.id != "") {
          let nextArs = [];
          let ars = this.fenceForm.line.split(";");
          ars.pop();
          ars.forEach(data => {
            nextArs = data.split(",");
            requestPoint.push({
              latitude: nextArs[1] * Math.pow(10, 6),
              longitude: nextArs[0] * Math.pow(10, 6)
            });
          });
          // } else {
          //   options.points.forEach(data => {
          //     requestPoint.push({
          //       latitude: data.lat * Math.pow(10, 6),
          //       longitude: data.lng * Math.pow(10, 6)
          //     });
          //   });
          // }
          break;
        default:
          break;
      }
      let parmas = {
        id: this.fenceForm.id,
        mapType: this.$store.getters.mapType,
        ruleName: this.fenceForm.fenceName,
        ruleType: this.fenceForm.ruleType,
        fenceType: 2,
        linesData: this.linesData,
        requestPoint: requestPoint,
        radius: this.radius,
        remarksss: this.fenceForm.remark,
        areaNameAndType: areaNameAndType,
        type: this.options.type
      };
      return parmas;
    },

    //修改专业围栏
    getFenceToUpdate(id, type) {
      this.$map["fenceActionBest"].clearOverlays();
      if (this.overlay)
        this.$map["fenceActionBest"].removeOverlay(this.overlay);
      if (this.infoWindow)
        this.$map["fenceActionBest"].closeInfoWindow(this.infoWindow);
      let content = ``,
        point = {},
        that = this;
      let callbackInfoWindow = function(infoWindow) {
        that.infoWindow = infoWindow;
      };
      let params = { id: id, mapType: this.$store.getters.mapType, type: type };
      let loadingInstance = this.$loading({
        text: "正在拼命加载中",
        target: document.querySelector(".el-card")
      });
      this.$store.dispatch("queryGetFenceRule", params).then(data => {
        this.fenceForm.ruleType = data.data.ruleType;
        data.data.areaNameAndType.forEach(ele => {
          ele["aspeed"] &&
            ((this.fenceForm.speed = ele["aspeed"] + ""),
            console.log(ele["aspeed"] + ""));
          ele["aseconds"] && (this.fenceForm.speedTime = ele["aseconds"] + "");
        });
        switch (data.data.ruleType) {
          //圆形
          case 1:
            let pointarr = data.data.requestPoint[0];
            let points = { lat: pointarr.latitude, lng: pointarr.longitude };
            let pointOrgin = data.data.originalPoint[0];
            let radius = data.data.radius;
            //修改时获取到中心点和半径
            this.typeShow.radius = true;
            this.latOrgin = Number(pointOrgin.latitude) / Math.pow(10, 6);
            this.lanOrgin = Number(pointOrgin.longitude) / Math.pow(10, 6);
            this.fenceForm.enterPoints = this.lanOrgin + "," + this.latOrgin;
            this.fenceForm.radius = data.data.radius.toString();
            this.radius = data.data.radius;
            this.overlay = this.$map["fenceActionBest"].mapAddcircle(
              points,
              radius
            );
            content = this.tContent(data.data);
            point = this.$map["fenceActionBest"].point(points);
            this.$map["fenceActionBest"].overlayClickOpenInfoWindow(
              this.overlay,
              point,
              content,
              callbackInfoWindow,
              {}
            );
            this.$map["fenceActionBest"].openInfoWindow(
              content,
              this.overlay,
              point
            );
            break;
          //矩形
          case 2:
            let rectangle = [];
            let latArr = [],
              lngArr = [],
              rectangleData = {};
            this.typeShow.rectangle = true;
            let pointArt = data.data.originalPoint[1];
            let pointArs = data.data.originalPoint[0];
            let latTang = Number(pointArt.latitude) / Math.pow(10, 6);
            let lanTang = Number(pointArt.longitude) / Math.pow(10, 6);
            let latRec = Number(pointArs.latitude) / Math.pow(10, 6);
            let lanRec = Number(pointArs.longitude) / Math.pow(10, 6);
            this.fenceForm.lbrectangle = lanRec + "," + latRec;
            this.fenceForm.rtrectangle = lanTang + "," + latTang;
            if (data.data.requestPoint.length > 0) {
              data.data.requestPoint.forEach(data => {
                latArr.push(Number(data.latitude));
                lngArr.push(Number(data.longitude));
                rectangle.push({
                  latitude: data.latitude,
                  longitude: data.longitude
                });
              });
              rectangleData.minLng = Math.min.apply(Math, lngArr);
              rectangleData.minLat = Math.min.apply(Math, latArr);
              rectangleData.maxLng = Math.max.apply(Math, lngArr);
              rectangleData.maxLat = Math.max.apply(Math, latArr);

              this.overlay = this.$map["fenceActionBest"].mapAddrectangle(
                rectangleData,
                {}
              );
              content = this.tContent(data.data);
              point = this.$map["fenceActionBest"].point(rectangle[0]);
              this.$map["fenceActionBest"].getBestView(); //rectangle
              this.$map["fenceActionBest"].overlayClickOpenInfoWindow(
                this.overlay,
                this.overlay.getBounds().getCenter(),
                content,
                callbackInfoWindow,
                {}
              );
              this.$map["fenceActionBest"].openInfoWindow(
                content,
                this.overlay,
                this.overlay.getBounds().getCenter()
              );
            }

            break;
          //多边形
          case 3:
            let polygonPoints = [];
            this.typeShow.polyEditor = true;
            let pointArry = [];
            let morePoint = data.data.originalPoint;
            let str = "";
            morePoint.forEach(data => {
              str +=
                Number(data.longitude) / Math.pow(10, 6) +
                "," +
                Number(data.latitude) / Math.pow(10, 6) +
                ";";
            });
            this.fenceForm.poly = str;
            if (data.data.requestPoint.length > 0) {
              data.data.requestPoint.forEach(data => {
                polygonPoints.push({ lat: data.latitude, lng: data.longitude });
              });
              this.overlay = this.$map["fenceActionBest"].mapAddpolygon(
                polygonPoints,
                {}
              );
              content = this.tContent(data.data);
              point = this.$map["fenceActionBest"].point(polygonPoints[0]);
              this.$map["fenceActionBest"].getBestView(); //polygonPoints
              this.$map["fenceActionBest"].overlayClickOpenInfoWindow(
                this.overlay,
                this.overlay.getBounds().getCenter(),
                content,
                callbackInfoWindow,
                {}
              );
              this.$map["fenceActionBest"].openInfoWindow(
                content,
                this.overlay,
                this.overlay.getBounds().getCenter()
              );
            }
            break;
          // 折线
          case 4:
            this.next = true;
            this.typeShow.line = true;
            let linePoint = data.data.originalPoint;
            let strT = "";
            linePoint.forEach(data => {
              strT +=
                Number(data.longitude) / Math.pow(10, 6) +
                "," +
                Number(data.latitude) / Math.pow(10, 6) +
                ";";
            });
            this.fenceForm.line = strT;
            this.linesData = [];
            // this.linesData = data.data.linesData;
            data.data.linesData.forEach((arr, index) => {
              this.linesData.push({
                //路段编号
                sectionsId: index + 1,
                //区域属性
                areaAttributes: arr.areaAttributes,

                //拐点编号
                inflectionId: index + 1,
                //行驶过长值
                desconds: arr.desconds,
                //行驶过低值
                dlowseconds: arr.dlowseconds,
                //超速速度
                aspeed: arr.aspeed,
                //超速持续时间
                aseconds: arr.aseconds,
                //宽度
                width: arr.width,
                //限制转速
                limitrpm: arr.limitrpm,
                mucktruckfencepro: arr.mucktruckfencepro,
                sequence: index + 1
              });
            });

            if (data.data.requestPoint.length > 0) {
              let polylinPoints = [];
              data.data.requestPoint.forEach(data => {
                polylinPoints.push({ lat: data.latitude, lng: data.longitude });
              });
              this.overlay = this.$map["fenceActionBest"].mapAddline(
                polylinPoints,
                {}
              );
              content = this.tContent(data.data);
              point = this.$map["fenceActionBest"].point(polylinPoints[0]);
              this.$map["fenceActionBest"].getBestView(); //polylinPoints
              this.$map["fenceActionBest"].overlayClickOpenInfoWindow(
                this.overlay,
                point,
                content,
                callbackInfoWindow,
                {}
              );
              this.$map["fenceActionBest"].openInfoWindow(
                content,
                this.overlay,
                point
              );
            }

            break;
          default:
            break;
        }
        this.areaTypeSetVal(data.data);
        loadingInstance.close();
      });
    },
    areaTypeSetVal(data) {
      let startTime = "",
        endTime = "";
      //数据双向绑定
      this.fenceForm.fenceName = data.ruleName;
      this.fenceForm.remark = data.remarksss;
      data.areaNameAndType.forEach(data => {
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
            this.fenceForm.speedTime = data.aseconds + "";
            this.fenceForm.speed = data.aspeed + "";
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
    },

    tContent(data) {
      let content = `<div style="padding-top:5px;padding-bottom:5px;">`;
      content +=
        `<div style='font-size:16px;'><span>` +
        this.$t("fenceManage.ruleName") +
        `：</span><span>${data.ruleName}</span></div>`;
      data.area &&
        (content +=
          `<div style='font-size:16px;'><span>` +
          this.$t("fenceManage.area") +
          `：</span><span>${this.filterArea(data.area)}</span></div>`);
      content +=
        `<div style='font-size:16px;'><span>` +
        this.$t("fenceManage.areaType") +
        `：`;
      if (data.areaNameAndType.length > 0) {
        let areaArr = data.areaNameAndType;
        for (let i = 0; i < areaArr.length; i++) {
          switch (data.areaNameAndType[i].areaType) {
            case 2:
              content += `<div style='text-indent:20px;font-size:14px;'><span>${areaArr[
                i
              ].areaName} :</span></div>`;
              content +=
                `<div style='text-indent:40px;font-size:12px;'><span>` +
                this.$t("fenceManage.aseconds") +
                `：</span><span>${areaArr[i].aseconds} (s)</span></div>`;
              content +=
                `<div style='text-indent:40px;font-size:12px;'><span>` +
                this.$t("fenceManage.aspeed") +
                `：</span><span>${areaArr[i].aspeed} (km/h)</span></div>`;
              break;
            case 1:
              content += `<div style='text-indent:20px;font-size:14px;'><span>${areaArr[
                i
              ].areaName} :</span></div>`;
              content +=
                `<div style='text-indent:40px;font-size:12px;'><span>` +
                this.$t("fenceManage.sTime") +
                `：</span><span>${areaArr[i]
                  .startTime}</span></br><span style='margin-left:40px'>` +
                this.$t("fenceManage.eTime") +
                `：</span><span>${areaArr[i].endTime}</span></span></div>`;
              break;
            default:
              content += `<div style='text-indent:20px;font-size:14px;'><span>${areaArr[
                i
              ].areaName}</div>`;
              break;
          }
        }
      }
      content += `</div>`;
      return content;
    }
  },
  mounted() {
    console.log(this.$map["fenceActionBest"]);
    // this.options.isModify ? (this.btnText = "保存") : (this.btnText = "预览");
  },
  watch: {
    "fenceForm.date"(newval) {},
    overlay(newval) {
      if (newval) {
        this.selectDisabled = false;
      } else {
        this.selectDisabled = true;
        this.fenceForm.fenceType = [];
      }
    },
    //线路修改时的模块改变
    "fenceForm.line"(newVal) {
      if (newVal && !this.options.id) {
        // 线形
        let linePoints = [];
        let lines = this.fenceForm.line
          .substr(0, this.fenceForm.line.length - 1)
          .split(";");
        this.linesData = [];
        lines.forEach((line, index) => {
          this.linesData.push({
            //路段编号
            sectionsId: index + 1,
            //区域属性
            areaAttributes: ["0", "0"],
            //拐点编号
            inflectionId: index + 1,
            //行驶过长值
            desconds: "0",
            //行驶过低值
            dlowseconds: "0",
            //超速速度
            aspeed: "1",
            //超速持续时间
            aseconds: "2",
            //宽度
            width: "0",
            //限制转速
            limitrpm: "1",
            mucktruckfencepro: "0",
            sequence: index + 1
          });
        });
      }
    },
    "fenceForm.ruleType"(newval) {
      // console.log(newval)
      let selectArr = [];
      if (newval == 4) {
        let polylineArr = ["1", "4", "8", "16", "32"];
        this.items.forEach(data => {
          data.disabled = polylineArr.indexOf(data.value) == -1;
          selectArr.push(data);
        });
      } else {
        let enterpriseType = this.$store.getters.user.enterpriseType;
        if (enterpriseType) {
          if (enterpriseType.indexOf("2") == -1) {
            let arr = ["1", "2", "4", "8", "16", "32", "256", "16384", "32768"];
            this.items.forEach(data => {
              data.disabled = arr.indexOf(data.value) == -1;
              selectArr.push(data);
            });
          } else {
            this.items.forEach(data => {
              data.disabled = false;
              selectArr.push(data);
            });
          }
        } else {
          this.items.forEach(data => {
            data.disabled = false;
            selectArr.push(data);
          });
        }
      }
      this.areaTypeItems = selectArr;
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  margin: 0px;
  padding: 0px;
}

.formAction {
  z-index: 1;
  height: 550px;
  top: 10px;
  position: absolute;
  right: 20px;
}

.formClass {
  height: 380px; // overflow-y: auto;
}

.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
  height: 480px;
}

.el-card__header {
  padding: 5px 10px 5px 10px;
}

.inputStype {
  width: 200px;
}

.action {
  text-align: right;
  line-height: 36px;
  margin-bottom: 20px;
  margin-right: 20px;
}
.fenceLine {
  display: none;
  width: 98%;
  left: 1%;
  transition: all 0.3s ease-out;
  position: absolute;
  z-index: 1;
}
.fenceCurrent {
  display: block;
  transition: all 0.3s ease-out;
  top: 60px;
}
</style>