<template>
    <div class="cv-tiredDriving">
        <cv-header>
            <el-form-item label="车牌号:">
                <el-input size="small" v-model="search.plateCode"></el-input>
            </el-form-item>
            <el-form-item label="报警类型:">
                <el-select size="small" v-model="search.alarm">
                    <el-option
                        :key="alarm.id"
                        :value="alarm.id"
                        :label="alarm.val"
                        v-for="alarm in alarmArray"></el-option>
                </el-select>
            </el-form-item>
            <el-form slot="bottom">
                <el-form-item label="报警时间:">
                    <el-date-picker 
                        v-model="search.alarmTime"
                        :editable="false" 
                        :clearable="false" 
                        size="small" 
                        type="datetimerange" 
                        placeholder="请选择时间" 
                        style="width:330px"></el-date-picker>
                </el-form-item>
            </el-form>
            <el-form-item>
                <el-button icon="search" size="small" @click="loadTable">搜索</el-button>
            </el-form-item>
        </cv-header>
        <cv-content :fill="true">
            <cv-grid :options="table" class="table" @load="loadTable">
                <el-table border stripe 
                    :data="table.data" 
                    :max-height="this.$service.getAutoHeight(1)" 
                    v-loading="table.loading"
                    @row-click="rowHandler">
                    <el-table-column min-width="100" label="车牌号码" prop="plateCode" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="报警时间"  min-width="100" prop="time" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="速度(公里/小时)"  min-width="140" prop="speed" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="报警状态"  min-width="130" prop="alarm" :formatter="tableFilterTiredAlarm"></el-table-column>
                    <el-table-column label="设备状态 "  
                        min-width="100"
                        :show-overflow-tooltip="true">
                        <template scope="scope">
                            <cv-span type="danger"
                             v-if= "$service.isArray(scope.row.deviceStatuslist) && scope.row.deviceStatuslist.length > 0" 
                             @click.native="cellHandler(scope.row)">
                                报警详情
                            </cv-span>
                            <cv-span type="danger"
                            v-if="!($service.isArray(scope.row.deviceStatuslist) && scope.row.deviceStatuslist.length > 0)">无状态</cv-span>
                        </template>
                    </el-table-column>
                    <el-table-column label="报警位置 "  min-width="100" prop="locationInfo" :show-overflow-tooltip="true"></el-table-column>
                </el-table>
            </cv-grid>
            <imgMap class="imgMap" :url="imgArea.url" :point="imgArea.point" :mapName="mapName"></imgMap>
        </cv-content>
        <el-dialog :title="dialog.title" :visible.sync="dialog.flag">
            <el-tag 
                style="display: inline-block; margin: 5px"
                v-for="data in dialog.data" 
                :key="data">{{data}}</el-tag>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.flag = false">取 消</el-button>
                <el-button type="primary" @click="dialog.flag = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import table from '@/utils/mixins/table'
import imgMap from './src/imgMap'
export default {
    mixins: [table],
    components: {imgMap},
    props: {
        api: {
            default: '/driver/queryFatigueDriving'
        },
        mapName: {
            default: 'tiredDriving'
        }
    },
    data(){
        return {
            alarmArray: [
                {id: 0, val: '无报警'},
                {id: 1, val: '疲劳提醒'},
                {id: 2, val: '打哈欠报警'},
                {id: 3, val: '视线偏离前方报警'},
                {id: 4, val: '抽烟'},
                {id: 5, val: '进食'},
                {id: 6, val: '离岗报警'},
                {id: 7, val: '未识别到人脸'},
                {id: 8, val: '打电话'},
                {id: 9, val: '人脸不匹配报警'}
            ],
            deviceArray: {
                '0': '相机固件加载错误',
                '1': 'CMOS不工作',
                '2': '喇叭不工作',
                '3': '图像无法读取',
                '4': '配置文件加载错误',
                '5': '相机安装过远',
                '6': '相机安装过近',
                '7': '相机安装过高',
                '8': '相机安装过低',
                '9': '相机安装角度过大',
                '10': '配置文件加载错误',
                '11': '相机装歪',
                '12': '相机没有对着人脸',
                '13': '相机人为遮挡',
                '14': '光线不足',
                '15': '人脸检测模块故障',
                '16': '头肩检测模块故障',
                '17': '闭眼模块故障',
                '18': '抽烟模块故障',
                '19': '打电话模块故障',
                '20': '打哈欠模块故障',
                '21': '吃东西模块故障',
                '22': '视线偏离模块故障',
                '23': '(无)',
                '24': '人脸比对模块故障',
                '25': '证据保存模块故障',
                '26': '自学习模块故障',
                '27': '车速接入故障',
                '28': '时间戳接入故障',
                '29': '串口通信故障',
                '30': 'CAN1通信故障',
                '31': 'CAN2通信故障',
                '32': '视频输出故障',
                '33': '语音输出故障'
            },
            dialog: {
                title: '报警详情',
                flag: false,
                data: []
            },
            search: {
                plateCode: '',
                alarm: null,
                alarmTime: [
                    this.$filter.timeStamp(
                        this.$filter.format(
                            new Date(new Date() - 7 * (24 * 60 * 60 * 1000)),
                            "yyyy-MM-dd start"
                        )
                    ),
                    this.$filter.timeStamp(
                        this.$filter.format(new Date(), "yyyy-MM-dd end")
                    )
                ]
            },
            imgArea: {
                url: null,
                point: {}
            }
        }
    },
    methods: {
        loadTable(flag){
            const params = {
                plateCode: this.search.plateCode,
                startTime: this.$filter.format(this.search.alarmTime[0], "yyyy-MM-dd HH:mm:ss"),
                endTime: this.$filter.format(this.search.alarmTime[1], "yyyy-MM-dd HH:mm:ss"),
                alarm: this.search.alarm,
                mapType: this.$store.getters.mapType
            };
            this.tableLoading(this.api, params, flag);
        },
        // 单行点击事件
        rowHandler(row, event, column){
            this.imgArea = {
                url: row.mediaPath,
                point: {
                    mapLongitude: row.correctionLongitude,
                    mapLatitude: row.getCorrectionLatitude,
                    plateCode: row.plateCode
                }
            }
        },
        cellHandler(data){
            this.dialog.flag = true;
            
            if(this.$service.isArray(data.deviceStatuslist)){
                const result = data.deviceStatuslist.map(val => {
                    return this.deviceArray[val]
                });
                this.dialog.data = result;
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>
    .cv-tiredDriving{
        .table{
            position: absolute;
            right: 300px;
            top: 0;
            left: 0;
            
        }
        .imgMap{
            width: 290px;
            position: absolute;
            top: 0;
            right: 0;
        }
    }
</style>


