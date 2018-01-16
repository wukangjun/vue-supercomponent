<template>
<div class="">
    <el-row class="container" :gutter="10">
        <el-col :span="24">
            <el-form :model="formData" label-position="top" :rules="rules" :inline="false" ref="add">
                <!-- 协议  -->
                <el-col :span="8">
                    <el-form-item :label="$t('协议')" prop="agreement">
                        <el-input size='small' v-model="formData.agreement" :maxlength="15"></el-input>
                    </el-form-item>
                </el-col>
                <!-- 平台名称  -->
                <el-col :span="8">
                    <el-form-item :label="$t('平台名称')" prop="platform">
                        <el-input size='small' :maxlength="15" v-model="formData.platform"></el-input>
                    </el-form-item>
                </el-col>
                <!-- MonitorServer  -->
                <el-col :span="8">
                    <el-form-item :label="$t('superiorP.MonitorServer')" prop="MonitorServer">
                        <el-input size='small' :maxlength="15" placeholder="8.8.8.8" v-model="formData.MonitorServer"></el-input>
                    </el-form-item>
                </el-col>
                <!-- PortMonitorMain  -->
                <el-col :span="8">
                    <el-form-item :label="$t('superiorP.PortMonitorMain')" prop="PortMonitorMain">
                        <el-input size='small' :maxlength="15" placeholder="19100" v-model="formData.PortMonitorMain"></el-input>
                    </el-form-item>
                </el-col>
                <!-- USERID  -->
                <el-col :span="8">
                    <el-form-item :label="$t('superiorP.USERID')" prop="USERID">
                        <el-input size='small' :maxlength="15" placeholder="12345678" v-model="formData.USERID"></el-input>
                    </el-form-item>
                </el-col>
                <!-- PASSWORD  -->
                <el-col :span="8">
                    <el-form-item :label="$t('superiorP.PASSWORD')" prop="PASSWORD">
                        <el-input size='small' placeholder='1234ABCD' :maxlength="15" v-model="formData.PASSWORD"></el-input>
                    </el-form-item>
                </el-col>
                <!-- MSG_GNSSCENTERID  -->
                <el-col :span="8">
                    <el-form-item :label="$t('superiorP.MSG_GNSSCENTERID')" prop="MSG_GNSSCENTERID">
                        <el-input size='small' :maxlength="15" placeholder="12345678" v-model="formData.MSG_GNSSCENTERID"></el-input>
                    </el-form-item>
                </el-col>
                <!-- IA1 -->
                <el-col :span="8">
                    <el-form-item :label="$t('superiorP.IA1')" prop="IA1">
                        <el-input size='small' :maxlength="15" v-model="formData.IA1"></el-input>
                    </el-form-item>
                </el-col>
                <!-- KeepMainSec  -->
                <el-col :span="8">
                    <el-form-item :label="$t('superiorP.KeepMainSec')" prop="KeepMainSec">
                        <el-input size='small' :maxlength="15" v-model="formData.KeepMainSec"></el-input>
                    </el-form-item>
                </el-col>
                <!-- IC1  -->
                <el-col :span="8">
                    <el-form-item :label="$t('superiorP.IC1')" prop="IC1">
                        <el-input size='small' :maxlength="15" v-model="formData.IC1"></el-input>
                    </el-form-item>
                </el-col>
                <!-- M1  -->
                <el-col :span="8">
                    <el-form-item :label="$t('superiorP.M1')" prop="M1">
                        <el-input size='small' :maxlength="15" v-model="formData.M1"></el-input>
                    </el-form-item>
                </el-col>
                <!-- MonitorIP  -->
                <el-col :span="8">
                    <el-form-item :label="$t('superiorP.MonitorIP')" prop="MonitorIP">
                        <el-input size='small' placeholder="8.8.8.8" :maxlength="15" v-model="formData.MonitorIP"></el-input>
                    </el-form-item>
                </el-col>
                <!-- MonitorPort  -->
                <el-col :span="8">
                    <el-form-item :label="$t('superiorP.MonitorPort')" prop="MonitorPort">
                        <el-input size='small' placeholder="9988" :maxlength="15" v-model="formData.MonitorPort"></el-input>
                    </el-form-item>
                </el-col>
                <!-- BackMonitorServer  -->
                <el-col :span="8">
                    <el-form-item :label="$t('superiorP.BackMonitorServer')" prop="BackMonitorServer">
                        <el-input size='small' placeholder="8.8.8.8" :maxlength="15" v-model="formData.BackMonitorServer"></el-input>
                    </el-form-item>
                </el-col>
                <!-- 809服务绑定  -->
                <el-col :span="8">
                    <el-form-item :label="$t('superiorP.bind809')" prop="">
                        <el-input size='small' :maxlength="15" v-model="formData.bind809" readonly @click.native="bind"></el-input>
                    </el-form-item>
                </el-col>
                <!-- 是否自动连接  -->
                <el-col :span="8">
                    <el-form-item :label="$t('superiorP.isAutoLink')" prop="">
                        <el-switch v-model="formData.autoConn" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </el-form-item>
                </el-col>
                <!-- 是否自动重连  -->
                <el-col :span="8">
                    <el-form-item :label="$t('superiorP.isAutoLinkR')" prop="">
                        <el-switch v-model="formData.autoReConn" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-col>
    </el-row>
    <el-col :span="24" class="dialog-footer" style="padding-top:20px;padding-bottom:10px;">
        <el-button @click="submitForm('add')" :loading="saveFlag" type="primary">{{$t('action.save')}}</el-button>
        <el-button @click="options.flag=false">{{$t('action.cancel')}}</el-button>
    </el-col>
</div>
</template>
<script>
import prot from "./index.js";
export default {
    props: {
        options: {}
    },
    components: {},
    mixins: [prot],
    data() {
        return {
            saveFlag: false,
            formData: {
                agreement: "",
                platform: "",
                MonitorServer: "",
                PortMonitorMain: "",
                USERID: "",
                PASSWORD: "",
                MSG_GNSSCENTERID: "",
                IA1: "20000000",
                KeepMainSec: "60",
                IC1: "30000000",
                M1: "10000000",
                MonitorIP: "",
                MonitorPort: "",
                BackMonitorServer: "",
                bind809: '',
                serviceName: '',
                autoReConn: true,
                autoConn: true
            },
            rules: {
                agreement: [{
                    required: true,
                    message: this.$t("filter.noempty"),
                    trigger: "blur,change"
                }],
                platform: [{
                    required: true,
                    message: this.$t("filter.noempty"),
                    trigger: "blur,change"
                }],
                MonitorServer: [{
                        required: true,
                        message: this.$t("filter.noempty"),
                        trigger: "blur,change"
                    },
                    {
                        pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/,
                        message: this.$t('filter.type13')
                    }
                ],
                PortMonitorMain: [{
                    required: true,
                    message: this.$t("filter.noempty"),
                    trigger: "blur,change"
                }, {
                    pattern: /^[1-9]\d*$/,
                    message: this.$t("filter.type14")
                }, {
                    min: 1,
                    max: 5,
                    message: this.$filter.lanReplace(this.$t("filter.Length"), {
                        min: 1,
                        max: 5
                    })
                }],
                USERID: [{
                        required: true,
                        message: this.$t("filter.noempty"),
                        trigger: "blur,change"
                    },
                    {
                        pattern: /^[1-9]\d*$/,
                        message: this.$t("filter.type14")
                    }
                ],
                PASSWORD: [{
                        required: true,
                        message: this.$t("filter.noempty"),
                        trigger: "blur,change"
                    },
                    {
                        pattern: /^[A-za-z0-9]+$/,
                        message: this.$t("filter.type9")
                    },
                    {
                        min: 1,
                        max: 8,
                        message: this.$filter.lanReplace(this.$t("filter.Length"), {
                            min: 1,
                            max: 8
                        })
                    }
                ],
                MSG_GNSSCENTERID: [{
                        required: true,
                        message: this.$t("filter.noempty"),
                        trigger: "blur,change"
                    },
                    {
                        pattern: /^[1-9]\d*$/,
                        message: this.$t("filter.type14")
                    }
                ],
                IA1: [{
                    required: true,
                    message: this.$t("filter.noempty"),
                    trigger: "blur,change"
                }, {
                    pattern: /^[1-9]\d*$/,
                    message: this.$t("filter.type14")
                }],
                KeepMainSec: [{
                    required: true,
                    message: this.$t("filter.noempty"),
                    trigger: "blur,change"
                }, {
                    pattern: /^[1-9]\d*$/,
                    message: this.$t("filter.type14")
                }],
                IC1: [{
                    required: true,
                    message: this.$t("filter.noempty"),
                    trigger: "blur,change"
                }, {
                    pattern: /^[1-9]\d*$/,
                    message: this.$t("filter.type14")
                }],
                M1: [{
                    required: true,
                    message: this.$t("filter.noempty"),
                    trigger: "blur,change"
                }, {
                    pattern: /^[1-9]\d*$/,
                    message: this.$t("filter.type14")
                }],
                MonitorIP: [{
                        required: true,
                        message: this.$t("filter.noempty"),
                        trigger: "blur,change"
                    },
                    {
                        pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/,
                        message: this.$t('filter.type13')
                    }
                ],
                MonitorPort: [{
                    required: true,
                    message: this.$t("filter.noempty"),
                    trigger: "blur,change"
                }, {
                    pattern: /^[1-9]\d*$/,
                    message: this.$t("filter.type14")
                }, {
                    min: 1,
                    max: 5,
                    message: this.$filter.lanReplace(this.$t("filter.Length"), {
                        min: 1,
                        max: 5
                    })
                }],
                BackMonitorServer: [{
                        required: true,
                        message: this.$t("filter.noempty"),
                        trigger: "blur,change"
                    },
                    {
                        pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/,
                        message: this.$t('filter.type13')
                    }
                ]
            }
        };
    },
    methods: {
        submitForm(formName) {
            if (this.options.isModify) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.formData.PortMonitorMain - 65535 > 0) {
                            this.$message.warning({
                                message: this.$t('主链路端口值为1~65535区间')
                            });
                            return false;
                        }
                        if (this.formData.MonitorPort - 65535 > 0) {
                            this.$message.warning({
                                message: this.$t('从链路端口值为1~65535区间')
                            });
                            return false;
                        }
                        let params = {
                            id: this.options.modifyData.id,
                            protocolName: this.formData.agreement, //协议名称
                            monitorServer: this.formData.MonitorServer, //主链路IP
                            portMonitorMain: this.formData.PortMonitorMain, //主链路端口
                            userId: this.formData.USERID, //用户id
                            password: this.formData.PASSWORD, //密码
                            msgGnsScenterId: this.formData.MSG_GNSSCENTERID, //唯一接入码
                            ia1: this.formData.IA1, //加密参数IA1
                            keepMainSec: this.formData.KeepMainSec, //主链路保持间隔
                            ic1: this.formData.IC1, //加密参数IC1
                            m1: this.formData.M1, //加密参数M1
                            monitorIp: this.formData.MonitorIP, //从链路IP
                            monitorPort: this.formData.MonitorPort, //从链路端口
                            backMonitorServer: this.formData.BackMonitorServer, //连接从链路IP
                            superiorPlatform: this.formData.platform, //平台名称
                            eznId: this.formData.eznId, //809服务id
                            autoConn: this.formData.autoConn ? 1 : 0, //是否自动连接
                            autoReConn: this.formData.autoReConn ? 1 : 0 //是否自动重连
                        }
                        this.saveFlag = true;
                        this.updateProtocolTransferGroupInfo(params).then(data => {
                            if (data.flag) {
                                this.options.flag = false;
                                this.$message.success({
                                    message: this.$t('修改成功')
                                })
                                this.$emit('confirm')
                            } else {
                                this.$message.error({
                                    message: this.$t('error.' + data.errorCode)
                                })
                            }
                            this.saveFlag = false;
                        }).catch(_ => {
                            this.saveFlag = false;
                        })
                    } else {
                        console.log('hhh')
                    }
                });
            } else {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.formData.PortMonitorMain - 65535 > 0) {
                            this.$message.warning({
                                message: this.$t('主链路端口值为1~65535区间')
                            });
                            return false;
                        }
                        if (this.formData.MonitorPort - 65535 > 0) {
                            this.$message.warning({
                                message: this.$t('从链路端口值为1~65535区间')
                            });
                            return false;
                        }
                        let params = {
                            protocolName: this.formData.agreement, //协议名称
                            monitorServer: this.formData.MonitorServer, //主链路IP
                            portMonitorMain: this.formData.PortMonitorMain, //主链路端口
                            userId: this.formData.USERID, //用户id
                            password: this.formData.PASSWORD, //密码
                            msgGnsScenterId: this.formData.MSG_GNSSCENTERID, //唯一接入码
                            ia1: this.formData.IA1, //加密参数IA1
                            keepMainSec: this.formData.KeepMainSec, //主链路保持间隔
                            ic1: this.formData.IC1, //加密参数IC1
                            m1: this.formData.M1, //加密参数M1
                            monitorIp: this.formData.MonitorIP, //从链路IP
                            monitorPort: this.formData.MonitorPort, //从链路端口
                            backMonitorServer: this.formData.BackMonitorServer, //连接从链路IP
                            superiorPlatform: this.formData.platform, //平台名称
                            eznId: this.formData.eznId, //809服务id
                            autoConn: this.formData.autoConn ? 1 : 0, //是否自动连接
                            autoReConn: this.formData.autoReConn ? 1 : 0 //是否自动重连
                        }
                        this.saveFlag = true;
                        this.insertProtocolTransferGroupInfo(params).then(data => {
                            if (data.flag) {
                                this.options.flag = false;
                                this.$message.success({
                                    message: this.$t('新增成功')
                                })
                                this.$emit('confirm')
                            } else {
                                this.$message.error({
                                    message: this.$t('error.' + data.errorCode)
                                })
                            }
                            this.saveFlag = false;
                        }).catch(_ => {
                            this.saveFlag = false;
                        })
                    } else {
                        console.log('hhh')
                    }
                });
            }
        },
        bind() {
            this.options.dialog2.flag = true;
            this.options.dialog2.name = 'bind809'
            this.options.dialog2.title = '809服务绑定'
        }
    },
    mounted() {
        if (this.options.isModify) {
            let MformData = this.options.modifyData;
            for (let x in MformData) {
                switch (x) {
                    case 'protocolName':
                        this.formData.agreement = MformData[x];
                        break;
                    case 'monitorServer':
                        this.formData.MonitorServer = MformData[x];
                        break;
                    case 'portMonitorMain':
                        this.formData.PortMonitorMain = MformData[x];
                        break;
                    case 'userId':
                        this.formData.USERID = MformData[x];
                        break;
                    case 'password':
                        this.formData.PASSWORD = MformData[x];
                        break;
                    case 'msgGnsScenterId':
                        this.formData.MSG_GNSSCENTERID = MformData[x];
                        break;
                    case 'ia1':
                        this.formData.IA1 = MformData[x];
                        break;
                    case 'keepMainSec':
                        this.formData.KeepMainSec = MformData[x];
                        break;
                    case 'ic1':
                        this.formData.IC1 = MformData[x];
                        break;
                    case 'm1':
                        this.formData.M1 = MformData[x];
                        break;
                    case 'monitorIp':
                        this.formData.MonitorIP = MformData[x];
                        break;
                    case 'monitorPort':
                        this.formData.MonitorPort = MformData[x];
                        break;
                    case 'backMonitorServer':
                        this.formData.BackMonitorServer = MformData[x];
                        break;
                    case 'superiorPlatform':
                        this.formData.platform = MformData[x];
                        break;
                    case 'serviceName':
                        this.formData.bind809 = MformData[x];
                        break;
                    case 'autoConn':
                        this.formData.autoConn = (MformData[x] == 0 ? false : true);
                        break
                    case 'autoReConn':
                        this.formData.autoReConn = (MformData[x] == 0 ? false : true);
                        break
                }
            }
        }
    },
    //监听弹框，每次弹框消失后重置弹框(仅限弹框内容绑定的是弹框内部数据，而不是options传入的)
    watch: {
        "options.flag" (newVal) {
            if (!newVal) {
                this.options.name = "";
            }
        },
        'options.dialog2.flag' (newVal) {
            if (!newVal) {
                this.options.dialog2.name = ''
            }
        },
        'options.dialog2.serviceName' (newVal) {
            if (newVal) {
                this.formData.bind809 = newVal
            }
        },
        'options.dialog2.eznId' (newVal) {
            if (newVal) {
                this.formData.eznId = newVal
            }
        }
    }
};
</script>
<style scoped lang="scss">

</style>
