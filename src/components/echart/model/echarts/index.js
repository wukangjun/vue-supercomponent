import china from './src/china.js'

let echarts = require('@/components/echart/model/echarts/echarts.min.js').echarts;
echarts.registerMap('china', china)

export default echarts
