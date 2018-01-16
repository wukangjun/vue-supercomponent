<template>
    <ul class="cv-map-legend">
        <li v-for="info in mapInfos" :key="info.name" class="map-legend-item">
            <img :src="info.icon" width="20" height="20" style="vertical-align:middle">
            <span>{{info.name}}</span>
        </li>
    </ul>  
</template>

<script>
import onlineIcon from '@/assets/img/map/tsp_green.png'
import unlineIcon from '@/assets/img/map/tsp_gray.png'
import extremIcon from '@/assets/img/map/tsp_yellow.png'
import stopIcon from '@/assets/img/map/tsp_blue.png'
import grayAlarm from '@/assets/img/map/vehicle_direction_0.gif'
import lineAlarm from '@/assets/img/map/2.gif'
import stopAlarm from '@/assets/img/map/3.gif'
import extremAlarm from '@/assets/img/map/4.gif'

export default {
    data(){
        return {
            mapInfos: [
                {name: '定位异常', icon: extremIcon},
                {name: '定位异常报警', icon: extremAlarm},
                {name: '车辆离线', icon: unlineIcon},
                {name: '车辆离线报警', icon: grayAlarm},    
                {name: '车辆停驶', icon: stopIcon},
                {name: '车辆停驶报警', icon: stopAlarm},
                {name: '车辆在线', icon: onlineIcon},
                {name: '车辆在线报警', icon: lineAlarm}   
            ]
        }
    }
}
</script>

<style lang="scss">
    .cv-map-legend{
        .map-legend-item{
            height: 30px;
            line-height: 30px;
            border-bottom: 1px solid #ccc;
        }
    }
</style>


