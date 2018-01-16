<template>
    <table  cellspacing="0" cellpadding="0" border="0" class="el-table__body slots">
        <tr class="el-table__row">
            <td  colspan="3" style="text-align: center" >合计</td>
            <td style="text-align: center">{{showItem.totalKeepTime}}</td>
            <td style="text-align: center">{{showItem.totalMileage}}</td>
            <td style="text-align: center">{{showItem.totalRolloverCount}}</td>
            <td style="text-align: center">{{showItem.totalOverspeedCount}}</td>
            <td style="text-align: center">{{showItem.totalDriverFatigueCount}}</td>
            <td style="text-align: center">{{showItem.totalCollisionCount}}</td>
            <td style="text-align: center">{{showItem.totalHardAccelerationCount}}</td>
            <td style="text-align: center">{{showItem.totalSharpSlowdownCount}}</td>
            <td style="text-align: center">{{showItem.totalSharpTurnsCount}}</td>
            <td style="text-align: center">{{showItem.totalFuelEconomy }}</td>
        </tr>
        <tr class="el-table__row">
            <td style="text-align: center" colspan="4">运行天数</td>
            <td style="text-align: center" colspan="3"><label >{{showItem.totalDays}}</label></td>
            <td style="text-align: center" colspan="3">驾驶评分（分）</td> 
            <td style="text-align: center" colspan="3"><label >{{showItem.safeDrivingScore}}</label></td>
        </tr>
    </table>
</template>
<script>
export default {
	props: {
        data: {},
        wid: {
            default: 0
        },
	},
	data() {
		return {
			showItem:{
                "totalKeepTime":"-",
                "totalMileage":"-",
                "totalDriverFatigueCount":"-",
                "totalFuelEconomy":"-",
                "totalHardAccelerationCount":"-",
                "totalSharpSlowdownCount":"-",
                "totalSharpTurnsCount":"-",
                "totalCollisionCount":"-",
                "totalRolloverCount":"-",
                "totalOverspeedCount":"-",
                "totalDays":"-",
                "safeDrivingScore":"-",
            }
		}
	},
    watch:{
        data(newData){
            console.log(newData)
            this.showItem=newData;
        }
    }
}
</script>