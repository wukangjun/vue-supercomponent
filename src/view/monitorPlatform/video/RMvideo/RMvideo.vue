<template>
    <div class="RMvideo">
        <div v-if="!$service.isIe()" style='height:200px;line-height:200px;text-align:center;font-size:24px;'>
            该视频播放只支持IE浏览器，请用IE浏览器打开!
        </div>
        <div v-if="$service.isIe()" style="text-align:center;margin-top:5px;">
            <a href="http://lib.cvtsp.com/video/NetVideoOCX.exe" style="color:red;">如果视频窗口显示不正常，请先下载视频控件！</a> &nbsp;
            <a href="http://lib.cvtsp.com/video/NPAPI_NetVideoOCX.exe" style="color:red;">视频控件更新！</a>
        </div>
        <cv-content v-if="$service.isIe()">
            <el-tabs class="tabContent" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="实时视频播放" name="realTimeVideo">
                    <div class="controlPanel">
                        <el-form label-width="80px">
                            <el-form-item label="摄像头">
                                <el-select :disabled="cameraFlag" v-model="CameraSelect">
                                    <el-option v-for="item in Camera" :label="item.label" :key="item._id" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="清晰度">
                                <el-select :disabled="clarityFlag" v-model="claritySelect">
                                    <el-option v-for="items in clarity" :label="items.label" :key="items._id" :value="items.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <div class="btnGroupOne">
                            <el-button type="primary" @click="getPic">抓图</el-button>
                            <el-button type="primary" @click="openSounds">{{openSound}}</el-button>
                        </div>
                        <div class="btnGroupTwo">
                            <el-button :disabled="rtvFlag" type="primary" @click="openVideo">打开视频</el-button>
                            <el-button type="primary" @click="stopVideo">关闭视频</el-button>
                        </div>
                    </div>
                    <div class="videoWindow">
                        <div class="up">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span style="line-height: 16px;">窗口1</span>
                                </div>
                                <object id="object1" classid="clsid:DB5D6116-F923-4aa0-83D9-D6538F55E174" width="350" height="230">
                                </object>
                            </el-card>
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span style="line-height: 16px;">窗口2</span>
                                </div>
                                <object id="object2" classid="clsid:DB5D6116-F923-4aa0-83D9-D6538F55E174" width="350" height="230">
                                </object>
                            </el-card>
                        </div>
                        <div class="down">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span style="line-height: 16px;">窗口3</span>
                                </div>
                                <object id="object3" classid="clsid:DB5D6116-F923-4aa0-83D9-D6538F55E174" width="350" height="230">
                                </object>
                            </el-card>
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span style="line-height: 16px;">窗口4</span>
                                </div>
                                <object id="object4" classid="clsid:DB5D6116-F923-4aa0-83D9-D6538F55E174" width="350" height="230">
                                </object>
                            </el-card>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="视频回放" name="playBack">
                    <div class="controlPanel">
                        <el-form label-width="100px" style="margin-bottom:0px;">
                            <el-form-item label="请选择时间">
                                <!-- <el-date-picker v-model="listData" type="date" placeholder="选择日期"> -->
                                <el-date-picker v-model="listData" type="date" placeholder="选择日期">
                                </el-date-picker>
                                <el-button :loading="searchFlag" @click="searchList">查询</el-button>
                            </el-form-item>
                        </el-form>
                        <cv-scrollbar class="listContent" style="height:337px;border-top:1px solid #ccc;padding:10px 0;text-align:center;">
                            <div v-if="firstStep" style="heigth:335px;line-height:335px;font-size:24px;">请选择日期查询获取回放列表！</div>
                            <div v-if="secondStep" style="heigth:335px;line-height:335px;font-size:24px;">查询日期无回放列表！</div>
                            <div v-if="secondStep1" style="heigth:335px;line-height:335px;font-size:24px;">请选择查询日期！</div>
                            <el-radio-group style="width:300px;text-align:left;" v-if="thirdStep" :disabled="radioFlag" v-model="checkedVideo" @change="change">
                                <el-radio ref="radioBoxes" v-for="item in rList" :label="item.index" :key="item._id" :data-st="item.st" :data-et="item.et">{{item.filelasts}}</el-radio>
                            </el-radio-group>
                        </cv-scrollbar>
                        <div class="btnGroupReview">
                            <el-button-group>
                                <el-button :disabled="playFlag" type="primary" @click="play">回放</el-button>
                                <el-button type="primary" @click="pause">{{pauseOrNot}}</el-button>
                                <el-button type="primary" @click="stop">停止</el-button>
                            </el-button-group>
                            <span>选择倍速：</span>
                            <el-select style="width:80px;vertical-align:middle" v-model="speedS" @change="speedChange">
                                <el-option v-for="item in speedSelect" :key="item.id" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <!-- <div style="margin-top:20px;padding:0 20px;">
                                <el-progress :text-inside="true" :stroke-width="18" :percentage="progressTime" status="success"></el-progress>
                                <br>
                                <el-slider v-model="progressTime" @change="pchange"></el-slider>
                            </div> -->
                        </div>
                    </div>
                    <div class="videoWindow">
                        <div class="one">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span style="line-height: 14px;">视频回放</span>
                                </div>
                                <object id="object5" classid="clsid:DB5D6116-F923-4aa0-83D9-D6538F55E174" width="686" height="512">
                                </object>
                            </el-card>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </cv-content>
    </div>
</template>
<script>
import { service } from '@/utils'
export default {
    components: {

    },
    mixins: [''],
    data() {
        return {
            progressTime: 0,
            totalTime: 0,
            reTime: 0,
            firstStep: true,
            secondStep: false,
            secondStep1: false,
            thirdStep: false,
            timer: null,
            checkedReview: null,
            progress: 0,
            radioFlag: false,
            searchFlag: false,
            cameraFlag: false,
            clarityFlag: false,
            openSound: '打开声音',
            soundFlag: 1,
            rtvFlag: false,
            timePoint: null,
            checkedVideo: '',
            pauseOrNot: '暂停',
            pauseFlag: 1,
            playFlag: false,
            rList: [],
            listData: new Date(),
            videoData: null,
            activeName: 'realTimeVideo',
            CameraSelect: "0",
            claritySelect: '0',
            Camera: [
                { value: "0", label: '全部' },
                { value: '1', label: '摄像头1' },
                { value: "2", label: '摄像头2' },
                { value: '3', label: '摄像头3' },
                { value: '4', label: '摄像头4' },
            ],
            clarity: [
                { value: "0", label: '高清' },
                { value: '1', label: '普清' },
            ],
            speedSelect:[
                {label:'×1',value:1},
                {label:'×2',value:2},
                {label:'×4',value:4},
                {label:'×8',value:8},
                {label:'×16',value:16},
                {label:'×32',value:32},
                {label:'×-2',value:-2},
                {label:'×-4',value:-4},
                {label:'×-8',value:-8},
                {label:'×-16',value:-16},
                {label:'×-32',value:-32},
            ],
            speedS:1
        }
    },
    methods: {
        //获取视口OBJ
        getVideoDom(item) {
            return document.getElementById(item)
        },
        //初始化控件
        initVideo(data) {
            for (let i = 1; i < 5; i++) {
                this.getVideoDom("object" + i).SetDeviceInfo(124, data.dvrId, data.dvrId, 5556, data.ip, data.port, "", "")
            }
        },
        //打开实时视频
        openVideo() {
            let clarity = parseInt(this.claritySelect)
            if (this.CameraSelect == 0) {
                for (let i = 1; i < 5; i++) {
                    this.getVideoDom("object" + i).OpenVideo(i - 1, clarity)
                }
            } else {
                this.getVideoDom("object" + this.CameraSelect).OpenVideo(this.CameraSelect - 1, clarity)
            }
            this.rtvFlag = true;
            this.cameraFlag = true;
            this.clarityFlag = true;
        },
        //关闭实时视频
        stopVideo() {
            for (let i = 1; i < 5; i++) {
                this.getVideoDom("object" + i).CloseVideo()
            }
            this.rtvFlag = false;
            this.cameraFlag = false;
            this.clarityFlag = false;
        },
        //抓图
        getPic() {
            if (!this.rtvFlag) {
                this.$message.error(this.$t('请先开启视频'))
                return false;
            }
            let nowTime = this.$filter.format(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(/-/g, "").replace(/:/g, "").replace(/ /g, "");
            if (this.CameraSelect == 0) {
                for (let j = 1; j < 5; j++) {
                    this.getVideoDom("object" + j).CapturePic("D:\\getpic\\CH" + j + "-" + nowTime + ".bmp", 0);
                }
                if (this.getVideoDom("object" + 1).CapturePic("D:\\getpic\\CH" + 1 + "-" + nowTime + ".bmp", 0) == 0) {
                    this.$message.success(this.$t('抓拍图片已保存至D:\\getpic文件夹'))
                } else {
                    this.$message.error(this.$t('抓图失败'))
                }
            } else {
                this.getVideoDom("object" + this.CameraSelect).CapturePic("D:\\getpic\\CH" + this.CameraSelect + "-" + nowTime + ".bmp", 0);
                if (this.getVideoDom("object" + this.CameraSelect).CapturePic("D:\\getpic\\CH" + this.CameraSelect + "-" + nowTime + ".bmp", 0) == 0) {
                    this.$message.success(this.$t('抓拍图片已保存至D:\\getpic文件夹'))
                } else {
                    this.$message.error(this.$t('抓图失败'))
                }
            }
        },
        //打开声音
        openSounds() {
            if (!this.rtvFlag) {
                this.$message.error(this.$t('请先开启视频'))
                return false;
            }
            if (this.CameraSelect == 0) {
                this.$message.error(this.$t("只能开启单个摄像头开启声音"))
            } else {
                if (this.soundFlag == 1) {
                    this.getVideoDom("object" + this.CameraSelect).SetEnableSound(this.soundFlag) == 0 ? (this.openSound = '关闭声音', this.soundFlag = 0) : null;
                } else {
                    this.getVideoDom("object" + this.CameraSelect).SetEnableSound(this.soundFlag) == 0 ? (this.openSound = "打开声音", this.soundFlag = 1) : null;
                }
            }
        },
        //搜索显示回放视频列表
        searchList() {
            if(!this.listData){
                this.secondStep1 = true;
                this.rList = []
                return false
            }
            this.rList = [];
            this.searchFlag = true;
            let loadingInstance = this.$loading({
                text: this.$t('role.type1'),
                target: document.querySelector('.listContent')
            });
            let allList = [];
            this.getVideoDom("object" + 5).SetDeviceInfo(124, this.videoData.dvrId, this.videoData.dvrId, 5556, this.videoData.ip, this.videoData.port, "", "")
            let tempArr = this.$filter.format(this.listData, "yyyy-MM-dd").split("-")
            let searchVideo = this.getVideoDom("object5").SearchTime(this.videoData.dvrId, tempArr[0], tempArr[1], tempArr[2], 0, 0, 0, 0, 0, 0, 0, 0)
            let resultsStr = this.getVideoDom("object5").SearchGetFileInfo();
            let list = resultsStr.split(";")
            list.forEach((ele, index) => {
                let tempArr = ele.split(',')
                let obj = {}
                obj.fileName = tempArr[0]
                obj.filelasts = tempArr[3]
                obj.index = index
                tempArr[3] && (obj.st = tempArr[3].split('-')[0], obj.et = tempArr[3].split("-")[1])
                allList.push(obj)
            });
            this.rList = service.unique(allList, 'st');
            this.rList.pop()
            if (searchVideo == 0) {
                setTimeout(_ => {
                    loadingInstance.close();
                    this.searchFlag = false;
                    this.secondStep1 = false;
                    this.firstStep = false;
                    this.thirdStep = true;
                }, 1000)
            } else {
                setTimeout(_ => {
                    loadingInstance.close();
                    this.searchFlag = false;
                    this.firstStep = false;
                    this.secondStep = true;
                    this.secondStep1 = false;
                }, 1000)
            }
            // this.searchFlag = false;
        },
        //点击回放视频列表
        change(val) {
            this.rList.forEach(ele => {
                ele.index == val && (this.timePoint = this.$filter.format(this.listData, "yyyy-MM-dd").split("-").join('') + ele.st.split(":").join(""), this.checkedReview = ele)
            })
            // let startTime = this.$filter.format(this.listData, "yyyy-MM-dd") + " " + this.checkedReview.st;
            // let endTime = this.$filter.format(this.listData, "yyyy-MM-dd") + " " + this.checkedReview.et;
            // this.totalTime = parseInt(this.$filter.timeStamp(endTime) - this.$filter.timeStamp(startTime)) / 1000
            // console.log(this.totalTime)
        },
        //回放视频
        play() {
            this.timePoint ? (this.getVideoDom("object5").MPlayOpen(1, this.timePoint, 15) == 0 ?
            (this.playFlag = true) : this.playFlag = false) :
            (this.$message.error(this.$t('请选择要回放的视频')))
            this.radioFlag = true;
        },
        //停止回放视频
        stop() {
            this.getVideoDom("object5").MPlayClose() == 0 ? (this.playFlag = false) : this.playFlag = true;
            // clearInterval(this.timer)
            this.radioFlag = false;
        },
        //回放 暂停/播放
        pause() {
            if (this.pauseFlag == 1) {
                this.getVideoDom("object5").PlayPause(this.pauseFlag) == 0 ? (this.pauseFlag = 0, this.pauseOrNot = "播放") : null;
                // clearInterval(this.timer)
            } else {
                this.getVideoDom("object5").PlayPause(this.pauseFlag) == 0 ? (this.pauseFlag = 1, this.pauseOrNot = "暂停") : null;
                // this.timer = setInterval(_=>{this.progressTime =  parseFloat(((this.reTime++)/this.totalTime * 100).toFixed(2))},1000)
            }
        },
        speedChange(val){
            this.getVideoDom("object5").PlaySetSpeed(val)
        }

    },
    mounted() {
        this.videoData = JSON.parse(localStorage.getItem("VideologinData"))
        this.initVideo(this.videoData)
    }
}
</script>
<style lang="scss">
.RMvideo {
    .cv-content {
        top: 20px;
        left: 10px;
        .tabContent {
            width: 1200px;
            margin: 0 auto;
            .el-tabs__content {
                padding-top: 10px;
                text-align: center;
            }
            .controlPanel {
                vertical-align: top;
                display: inline-block;
                width: 398px;
                height: 565px;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
                .el-form {
                    margin-top: 20px;
                    margin-bottom: 360px;
                }
                .el-select {
                    width: 250px;
                }
                .btnGroupOne,
                .btnGroupTwo {
                    text-align: center;
                    margin-bottom: 10px;
                    .el-button {
                        width: 150px;
                    }
                }
                .btnGroupReview {
                    // text-align: center;
                    padding-top: 10px;
                    border-top: 1px solid #ccc;
                    height: 150px;
                }
                .el-radio {
                    margin: 8px 20px;
                    display: block;
                }
            }
            .videoWindow {
                width: 688px;
                height: 568px;
                display: inline-block;
                .up,
                .down {
                    .box-card {
                        width: 340px;
                        height: 280px;
                        display: inline-block;
                        .el-card__body {
                            padding: 0;
                        }
                    }
                }
                .one {
                    .box-card {
                        width: 686px;
                        height: 566px;
                        display: inline-block;
                        .el-card__body {
                            padding: 0;
                        }
                    }
                }
            }
        }
    }
}
</style>
