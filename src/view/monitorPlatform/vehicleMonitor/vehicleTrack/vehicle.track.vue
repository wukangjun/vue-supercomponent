<template>
    <div class="cv-vehicle-track">
        <cv-header>
            <el-form-item label="持续时间(单位:S)">
                <el-input-number 
                size="small"
                :min="5"
                v-model="searchOptions.totalTimeSeconds"></el-input-number>
            </el-form-item>
            <el-form-item label="发送频率(单位:S)">
                <el-input-number 
                size="small"
                :min="5"
                v-model="searchOptions.intervalSeconds"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button 
                type="success" 
                size="small"
                v-instruction="{
                    direct: true,
                    url: '/sendOrder/queryVehicleTrailCmd',
                    params: searchOptions,
                    callback: trackCallbackEvent
                }">跟踪下发{{count>0?(count):''}}</el-button>
            </el-form-item>
        </cv-header>
        <cv-content v-loading="loading">
            <cv-scrollbar class="vehicle-track-mess">
                <el-form :show-message="false" label-width="120px">
                    <el-form-item label="设备响应时间:">
                        {{vehicleMess.gpsTime | format('yyyy-MM-dd HH:mm:ss')|isValue}}
                    </el-form-item>
                    <el-form-item label="位置描述:">
                        {{vehicleMess.locationDesc|isValue}}
                    </el-form-item>
                    <el-form-item label="位置信息状态:">
                        {{vehicleMess.locateStatus |locationStatus(true)| isValue}}
                    </el-form-item>
                    <el-form-item label="经度:">
                        {{vehicleMess.mapLongitude|toFixed(6)|isValue}}
                    </el-form-item>
                    <el-form-item label="纬度:">
                        {{vehicleMess.mapLatitude|toFixed(6)|isValue}}
                    </el-form-item>
                    <el-form-item label="海拔高度(M):">
                        {{vehicleMess.height|isValue('m')}}
                    </el-form-item>
                    <el-form-item label="速度(km/h):">
                        {{(vehicleMess.dspeed == "0.0"?vehicleMess.gpsSpeed =='0.0'?'':vehicleMess.gpsSpeed:vehicleMess.dspeed) | isValue('km/h')}}
                    </el-form-item>
                    <el-form-item label="GPS时间:">
                        {{vehicleMess.gpsTime | format('yyyy-MM-dd HH:mm:ss')|isValue}}
                    </el-form-item>
                    <el-form-item label="GPS状态标签:">
                        
                    </el-form-item>
                    <el-form-item label="报警数目:">
                        {{vehicleMess.alarmCount|isValue}}
                    </el-form-item>
                </el-form>
            </cv-scrollbar>
            <component :is="$store.getters.mapName" id="vhicleTrack" class="vehicle-track-map" :point="vehicleMess"></component>
        </cv-content>
    </div>
</template>

<script>

export default {
    data(){
        return {
            searchOptions: {
                // 车辆id
                vehicleId: null,
                // 持续时间
                totalTimeSeconds: 120,
                // 发送频率
                intervalSeconds: 10
            },
            // 加载标示
            loading: false,
            // 车辆信息
            vehicleMess: {},
            // 定时器对象
            timer: null,
            // 计数器
            count: 0,
            // 秒的单位
            seconds: 1000,
            vehicleId: null
        }
    },
    methods: {
        /**
         * 根据车辆id查询车辆位置信息
         * @params 
         */
        async getMultiVehicleLastLocationList(id){
            this.loading = true;
            const { data, flag } = await this.$store.dispatch('getMultiVehicleLastLocationList', {ids:id,mapType:this.$store.getters.mapType});
            this.loading = false;
            if(flag && data.length > 0){
                this.vehicleMess = data[0];
                this.searchOptions.vehicleId = this.vehicleMess.vehicleId;
            }else{
                this.$message.error('暂无数据!');
                // 重置信息
                this.vehicleMess = {};
            }
        },
        /**
         * 指令回调的方法事件
         */
        trackCallbackEvent(flag){
            this.clearTimerAndCount();
            if(flag){
                this.count = Math.ceil(
                    this.searchOptions.totalTimeSeconds
                    / this.searchOptions.intervalSeconds);
                this.cyclicQueryLocation();
            }
        },
        /**
         * 循环查询车辆位置信息
         */
        cyclicQueryLocation(){     
            if(this.count <= 0){
               return this.clearTimerAndCount();
            }
            this.timer = setTimeout( _ => {
                this.$store.dispatch('getMultiVehicleLastLocationList', {ids:this.vehicleId,mapType:this.$store.getters.mapType})
                .then(mess => {
                    const {flag, data} = mess;
                    if(flag && data){
                        this.vehicleMess = data[0];
                        this.count--;
                        this.cyclicQueryLocation();
                    }
                });
            }, this.searchOptions.intervalSeconds * this.seconds);  
        },
        /**
         *  清空循环数据
         */
        clearTimerAndCount(){
            this.count = 0;
            clearTimeout(this.timer);
            this.timer = null;
        }
    },
    watch: {
        '$store.getters.ptSingleCar'(newVal){
            this.vehicleId = newVal.id;
            this.clearTimerAndCount();
            this.getMultiVehicleLastLocationList(newVal.id);
        }
    },
    beforeDestroy(){
        this.clearTimerAndCount();
    }
}
</script>

<style lang="scss">
    .cv-vehicle-track{
        .vehicle-track-mess{
            position: absolute;
            top: 10px;
            bottom: 10px;
            left: 10px;
            width: 350px;
            .el-form-item{
                margin-bottom: 5px;
                border-bottom: 1px solid #eef1f6;
            }
        }
        .vehicle-track-map{
            position: absolute;
            top: 10px;
            bottom: 10px;
            left: 370px;
            right: 20px;
            box-shadow: 2px 2px 2px #ccc;
        }
    }
</style>
