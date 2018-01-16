<template>
    <div class="main">
        <div class="left">
            <el-row>
                <cv-tool :name="$route.name" :data="$store.getters.monitorMenu" :is-modify="false" :is-remove="false" :is-export="false" @add="addFence" @search="searchClickLoadGrid"></cv-tool>
                <el-form :inline="true" style="float:right;margin-top:9px;">
                    <el-form-item :label="$t('fenceManage.ruleName')" prop="fenceName">
                        <el-input v-model="fence.fenceName" style="width:140px;" size="small" :placeholder="$t('placeholder.inputValue')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('fenceManage.ruleType')" prop="fenceType">
                        <el-select v-model="fence.fenceType" style="width:120px" size="small" :placeholder="$t('placeholder.selectValue')">
                            <el-option v-for="item in items" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <cv-grid :options="grid.options" @load="searchClickLoadGrid(false)">
                    <el-table border stripe :data="grid.table" v-loading="grid.loading" ref="table" :max-height="height">
                        <el-table-column :label="$t('fenceManage.ruleName')" prop="ruleName" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column :label="$t('fenceManage.ruleType')" prop="ruleType" :formatter="rowRender"></el-table-column>
                        <el-table-column :label="$t('fenceManage.remark')" prop="remarksss" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column :label="$t('fenceManage.options')">
                            <template scope="scope">
                                <cv-span type="info" @click.native="selectFence(scope)" style="float:left;padding-right:10px;">{{$t('power.look')}}</cv-span>
                                <cv-table-tool :name="$route.name" :data="$store.getters.monitorMenu" @modify="updateFence(scope)" style="float:left" @remove="removeFence(scope)"></cv-table-tool>
                            </template>
                        </el-table-column>
                    </el-table>
                </cv-grid>
            </el-row>

        </div>
        <div class="right">
            <el-row style="height:100%;">
                <component :is="$store.getters.mapName" style="width: 100%;height: 100%;overflow: hidden;margin:0;" id="fenceMainBest"></component>
            </el-row>
        </div>
        <div class="fenchBox"></div>
    </div>
</template>

<script>
export default {
    props: {
        options: {}
    },
    data() {
        return {
            height: 500,
            grid: {
                options: {
                    current: 1,
                    size: 10,
                    total: 0,
                    flag: false
                },
                table: [],
                loading: false
            },
            fence: {
                fenceName: '',
                fenceType: '',
            },
            items: [
                { value: null, label: this.$t('action.all') },
                {
                    value: '1',
                    label: this.$t('common.fence.circle')
                }, 
                {
                    value: '2',
                    label: this.$t('common.fence.rectangle')
                }, 
                {
                    value: '3',
                    label: this.$t('common.fence.polygon')
                }, {
                    value: '4',
                    label: this.$t('common.fence.line')
                }],
            overlay: null,
            infoWindow: null
        }
    },
    computed: {

    },
    methods: {
        rowRender(row, column) {
            switch (row.ruleType) {
                case 1:
                    return this.$t('common.fence.circle');
                case 2:
                    return this.$t('common.fence.rectangle');
                case 3:
                    return this.$t('common.fence.polygon');
                case 4:
                    return this.$t('common.fence.line');
                default:
                    break;
            }
        },
        searchClickLoadGrid(flag) {
            if (flag) {
                this.grid.options.flag = true;
                this.grid.options.current = 1;
            } else {
                this.grid.options.flag = false;
            }
            this.LoadGrid(this.fence.fenceName, this.fence.fenceType, 101);
        },
        LoadGrid(fenceName, fenceType, type) {
            this.grid.loading = true;
            this.$http({
                url: this.$COMMON.baseUrl + "/fenece/queryfencerulepage",
                params: { ruleName: fenceName, ruleType: fenceType, size: this.grid.options.size, current: this.grid.options.current, type: type }
            }).then((data) => {
                if (!data.flag && !!data.errorCode)
                    this.$message.error({ message: this.$t("error." + data.errorCode) });
                else {
                    this.grid.table = data.data.records;
                    this.grid.options.total = data.data.total;
                }
                this.grid.loading = false;
            });
        },
        //查看围栏
        selectFence(data) {
            this.$map["fenceMainBest"].clearOverlays();
            if (this.overlay)
                this.$map["fenceMainBest"].removeOverlay(this.overlay);
            if (this.infoWindow)
                this.$map["fenceMainBest"].closeInfoWindow(this.infoWindow);
            this.grid.loading = true;
            let params = { id: data.row.id, mapType:this.$store.getters.mapType, type: data.row.type };
            this.$store.dispatch("queryGetFenceRule", params).then((data) => {
                this.grid.loading = false;
                if (data.flag) {
                    let content = ``, point = {}, that = this;
                    let callbackInfoWindow = function(infoWindow) {
                        that.infoWindow = infoWindow;
                    };
                    switch (data.data.ruleType) {
                        //圆形
                        case 1:
                            let pointarr = data.data.requestPoint[0];
                            let points = { lat: pointarr.latitude, lng: pointarr.longitude };
                            let radius = data.data.radius;
                            this.overlay = this.$map["fenceMainBest"].mapAddcircle(points, radius);
                            content = this.tContent(data.data);
                            point = this.$map["fenceMainBest"].point(points);
                            this.$map["fenceMainBest"].overlayClickOpenInfoWindow(this.overlay, point, content, callbackInfoWindow, {});
                            this.$map["fenceMainBest"].openInfoWindow(content, this.overlay, point);
                            break;
                        //矩形
                        case 2:
                            let rectangle = [];
                            let latArr = [],
                                lngArr = [],
                                rectangleData = {};
                            if(data.data.requestPoint.length > 0){
                                data.data.requestPoint.forEach((data)=>{
                                    latArr.push(Number(data.latitude))
                                    lngArr.push(Number(data.longitude))
                                    rectangle.push({lat:data.latitude,lng:data.longitude})
                                });
                                rectangleData.minLng = Math.min.apply(Math,lngArr);
                                rectangleData.minLat = Math.min.apply(Math,latArr);
                                rectangleData.maxLng = Math.max.apply(Math,lngArr);
                                rectangleData.maxLat = Math.max.apply(Math,latArr);
                                this.overlay = this.$map["fenceMainBest"].mapAddrectangle(rectangleData, {});
                                content = this.tContent(data.data);
                                point = this.$map["fenceMainBest"].point(rectangle[0]);
                                this.$map["fenceMainBest"].overlayClickOpenInfoWindow(this.overlay, this.overlay.getBounds().getCenter(), content, callbackInfoWindow, {});
                                this.$map["fenceMainBest"].openInfoWindow(content, this.overlay, this.overlay.getBounds().getCenter());
                            };
                            break;
                        //多边形
                        case 3:
                            let polygonPoints = [];
                            if (data.data.requestPoint.length > 0) {
                                data.data.requestPoint.forEach((data) => {
                                    polygonPoints.push({ lat: data.latitude, lng: data.longitude });
                                });
                                this.overlay = this.$map["fenceMainBest"].mapAddpolygon(polygonPoints, {});
                                content = this.tContent(data.data);
                                point = this.$map["fenceMainBest"].point(polygonPoints[0]);
                                this.$map["fenceMainBest"].overlayClickOpenInfoWindow(this.overlay, this.overlay.getBounds().getCenter(), content, callbackInfoWindow, {});
                                this.$map["fenceMainBest"].openInfoWindow(content, this.overlay, this.overlay.getBounds().getCenter());
                            }
                            break;
                        //折线
                        case 4:
                            if (data.data.requestPoint.length > 0) {
                                let polylinPoints = [];
                                data.data.requestPoint.forEach((data) => {
                                    polylinPoints.push({ lat: data.latitude, lng: data.longitude });
                                });
                                this.overlay = this.$map["fenceMainBest"].mapAddline(polylinPoints, {});
                                content = this.tContent(data.data);
                                point = this.$map["fenceMainBest"].point(polylinPoints[0]);
                                this.$map["fenceMainBest"].overlayClickOpenInfoWindow(this.overlay, point, content, callbackInfoWindow, {});
                                this.$map["fenceMainBest"].openInfoWindow(content, this.overlay, point);
                            }
                            break;
                        default:
                            break;
                    }

                }
            });
        },
        tContent(data) {
            let content = `<div style="padding-top:5px;padding-bottom:5px;">`;
            content += `<div style='font-size:16px;'><span>` + this.$t("fenceManage.ruleName") + `：</span><span>${data.ruleName}</span></div>`;
            data.area && (content += `<div style='font-size:16px;'><span>` + this.$t("fenceManage.area") + `：</span><span>${this.filterArea(data.area)}</span></div>`);
            content += `<div style='font-size:16px;'><span>` + this.$t("fenceManage.areaType") + `：`;
            if (data.areaNameAndType.length > 0) {
                let areaArr = data.areaNameAndType;
                for (let i = 0; i < areaArr.length; i++) {
                    switch (data.areaNameAndType[i].areaType) {
                        case 2:
                            content += `<div style='text-indent:20px;font-size:14px;'><span>${areaArr[i].areaName} :</span></div>`;
                            content += `<div style='text-indent:40px;font-size:12px;'><span>` + this.$t("fenceManage.aseconds") + `：</span><span>${areaArr[i].aseconds} (s)</span></div>`;
                            content += `<div style='text-indent:40px;font-size:12px;'><span>` + this.$t("fenceManage.aspeed") + `：</span><span>${areaArr[i].aspeed} (km/h)</span></div>`;
                            break;
                        case 1:
                            content += `<div style='text-indent:20px;font-size:14px;'><span>${areaArr[i].areaName} :</span></div>`;
                            content += `<div style='text-indent:40px;font-size:12px;'><span>` + this.$t("fenceManage.sTime") + `：</span><span>${areaArr[i].startTime}</span></br><span style='margin-left:40px'>` + this.$t('fenceManage.eTime') + `：</span><span>${areaArr[i].endTime}</span></span></div>`;
                            break;
                        default:
                            content += `<div style='text-indent:20px;font-size:14px;'><span>${areaArr[i].areaName}</div>`;
                            break;
                    }
                }
            }
            content += `</div>`;
            return content;
        },
        addFence() {
            this.options.name = "fenceAction";
            this.options.id = "";
            this.options.isModify = false;
            this.options.type = 101
        },
        updateFence(val) {
            this.options.name = "fenceAction";
            this.options.id = val.row.id;
            this.options.isModify = true;
            this.options.type = val.row.type;
        },
        removeFence(val) {
            this.$confirm(this.$t("action.confirmIsRemove"), this.$t("action.tip"), {
                confirmButtonText: this.$t('action.confirm'),
                cancelButtonText: this.$t("action.cancel"),
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$COMMON.baseUrl + "/fenece/deletefencerule",
                    params: { id: val.row.id, type: val.row.type }
                }).then((data) => {
                    if (data.flag) {
                        this.$message.success({ message: this.$t("action.actionSuccess") });
                        this.LoadGrid("", "", 101);
                        if (this.overlay)
                            this.$map["fenceMainBest"].removeOverlay(this.overlay);
                            this.$map["fenceMainBest"].clearOverlays()
                    } else {
                        this.$message.error({ message: this.$t("error." + data.errorCode) });
                    }
                });
            }).catch(() => {
                this.$message.info({ message: this.$t("action.cancelRemove") });
            });

        },
        //围栏区域过滤
        filterArea(data) {
            switch (data) {
                case 1:
                    return '装货区';
                case 2:
                    return '禁区';
                case 3:
                    return '倾倒区';
            }
        }
    }, mounted() {
        this.LoadGrid("", "", 101);
        // this.reheight()
        setTimeout(_ => {
            this.height = document.querySelector(".fenchBox").offsetHeight -
                document.querySelector(".el-row").offsetHeight -
                document.querySelector(".el-pagination").offsetHeight - 20;
            // console.log(this.height,document.querySelector(".right").offsetHeight,document.querySelector(".el-row").offsetHeight,document.querySelector(".el-pagination").offsetHeight-20)
        }, 0)

    }


}
</script>

<style lang="scss" scoped>
.main {
    top: 0px;
    bottom: 0px;
    .fenchBox {
        position: absolute;
        top: 60px;
        bottom: 0px;
        left: 0;
        right: 0;
        z-index: -1000;
    }
}

.main .left {
    float: left;
    width: 600px;
}

.main .right {
    margin-left: 610px;
    height: 100%;
    width: auto;
}
</style>