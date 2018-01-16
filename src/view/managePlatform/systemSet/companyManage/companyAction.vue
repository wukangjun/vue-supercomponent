<template>
    <div>
        <el-row class="companyManageAction">
            <el-tabs>
                <el-tab-pane :label="$t('companyManage.baseInfo')">
                    <el-form class="addAndModify" ref="companyForm" :model="companyForm" :rules="rules" label-width="130px" :inline="true">
                        <el-form-item :label="$t('companyManage.parentCompany')" prop="pEnterpriseName">
                            <cv-dropdown-tree style="width:217px" v-model="companyForm.pEnterpriseName" :readonly="enterpriseSelectReadonly" @label="selectValue" :data="options.childTreeData" :placeholder="$t('companyManage.parentCompany')"></cv-dropdown-tree>
                        </el-form-item>
                        <el-form-item :label="$t('companyManage.ename')" prop="enterpriseName">
                            <el-input v-model="companyForm.enterpriseName" :placeholder="$t('companyManage.ph1')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('companyManage.gmaccount')" prop="account">
                            <el-input v-model="companyForm.account" :readonly="enterpriseSelectReadonly" :placeholder="$t('companyManage.ph1')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('companyManage.eshortName')" prop="simpleName">
                            <el-input v-model="companyForm.simpleName" :placeholder="$t('companyManage.ph1')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('companyManage.orgCode')" prop="orgCode">
                            <el-input v-model="companyForm.orgCode" :placeholder="$t('companyManage.ph1')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('companyManage.fid')" prop="identcode">
                            <el-input v-model="companyForm.identcode" :placeholder="$t('companyManage.ph1')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('companyManage.fname')" prop="legal">
                            <el-input v-model="companyForm.legal" :placeholder="$t('companyManage.ph1')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('companyManage.efox')" prop="enterFox">
                            <el-input v-model="companyForm.enterFox" :placeholder="$t('companyManage.ph1')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('companyManage.ephone')" prop="enterTel">
                            <el-input v-model="companyForm.enterTel" :placeholder="$t('companyManage.ph1')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('companyManage.email')" prop="enterZipcode">
                            <el-input v-model="companyForm.enterZipcode" :placeholder="$t('companyManage.ph1')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('companyManage.eaddress')" prop="address">
                            <el-input v-model="companyForm.address" :placeholder="$t('companyManage.ph1')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('companyManage.ecarType')" prop="">
                            <el-select v-model="carType" multiple clearable :placeholder="$t('companyManage.ph1')">
                                <el-option v-for="item in carTypeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('companyManage.mapType')" prop="">
                            <el-select v-model="mapType" :placeholder="$t('companyManage.ph1')">
                                <el-option v-for="item in mapTypeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('车辆上级平台')" prop="">
                            <el-input style="width:217px;" v-model="companyForm.superiorPlatform" :readonly="true" @click.native="bindPt" :icon="(companyForm.superiorPlatform == ''||companyForm.superiorPlatform == null)?'':'circle-close'" :on-icon-click="del"></el-input>
                            <!-- <cv-icon 
                            name="remove"
                            style="position:absolute;right:10px;top:11px;"
                            @click.native="del"
                            v-show="companyForm.superiorPlatform == ''?false:true">
                            </cv-icon> -->
                        </el-form-item>
                        <el-form-item :label="$t('业户码')" prop="consumerId">
                            <el-input style="width:217px;" v-model="companyForm.consumerId"></el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane :label="$t('companyManage.menuManage')">
                    <!-- 企业树 -->
                    <cv-dropdown-tree v-show="this.companyForm.pid !=''" style="width:240px;margin-left:40px;" :placeholder="$t('公司菜单模板选择')" :interface="$COMMON.baseUrl + '/enterprise/findEntTreesByEntId'" :readonly="false" :enterpriseId="this.companyForm.pid" v-model="company" @label="label" :is-default="false"></cv-dropdown-tree>
                    <cv-scrollbar style="height:170px;padding-right:10px;">
                        <el-tree class="mt10" :data="menuData" :props="defaultProps" node-key="id" :expand-on-click-node="true" :default-expand-all="true" :render-content="renderContent">
                        </el-tree>
                    </cv-scrollbar>
                </el-tab-pane>
            </el-tabs>
        </el-row>
        <el-row>
            <el-col :span="24" class="dialog-footer" style="padding-top:20px;">
                <el-button :loading="loadFlag" @click="submitForm" type="primary">{{$t('companyManage.cf')}}</el-button>
                <el-button @click="resetForm">{{$t('companyManage.cc')}}</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import validators from "@/utils/mixins/validator.js"
import { COMMON, http } from "@/utils"
export default {
    props: {
        options: {}
    },
    mixins: [
        validators
    ],
    data() {
        return {
            company: '',
            loadFlag: false,
            enterpriseSelectReadonly: false,
            filterText: '',
            companyForm: {
                text: '',
                id: '',
                //上级企业ID
                pid: '',
                //上级企业名称
                pEnterpriseName: '',
                pEnterpriseId: '',
                //组织机构代码证
                orgCode: '',
                //帐号
                account: '',
                //简称
                simpleName: '',
                //备注
                remark: '',
                //身份证
                identcode: '',
                //法人姓名
                legal: '',
                //公司名
                enterpriseName: '',
                //公司编码
                enterpriseCode: '',
                //邮编
                enterZipcode: '',
                //电话
                enterTel: '',
                //传真
                enterFox: '',
                //省
                areaP: '',
                //市
                areaC: '',
                //区
                areaA: '',
                //地址
                address: '',
                superiorPlatform:'',
                superiorPlatformId:'',
                consumerId:''
            },
            rules: {
                pEnterpriseName: [
                    { required: true, message: this.$t('filter.notEmpty'), trigger: 'change' },

                ],
                legal: [
                    { required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
                    { min: 0, max: 15, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 0, max: 15 }) }
                ],
                account: [
                    { required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
                    { min: 2, max: 15, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 2, max: 15 }) },
                    { pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: this.$t('filter.type4') },
                    { validator: this.isRoleSame, trigger: 'blur' }
                ],
                enterpriseName: [
                    { required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
                    { min: 2, max: 15, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 2, max: 15 }) },
                    { pattern: /^[a-zA-Z\u4e00-\u9fa5 ]{1,20}$/, message: this.$t('filter.type5') },
                    { validator: this.isSame, trigger: 'blur' }
                ],
                orgCode: [
                    { required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
                    { min: 8, max: 9, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 8, max: 9 }) },
                    { pattern: /^[0-9a-zA-Z]*$/, message: this.$t('filter.type9') }
                ],
                simpleName: [
                    { min: 2, max: 12, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 2, max: 12 }) },
                    { pattern: /^[a-zA-Z\u4e00-\u9fa5 ]{1,20}$/, message: this.$t('filter.type5') },
                ],
                identcode: [
                    { required: true, message: this.$t('filter.notEmpty') },
                    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: this.$t('companyManage.tipType1') }
                ],
                consumerId:[
                    
                ],
                userName: [
                    { required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
                    { min: 2, max: 100, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 2, max: 100 }) },
                    { pattern: /^[a-zA-Z\u4e00-\u9fa5 ]{1,20}$/, message: this.$t('filter.type5') },
                ],
                enterFox: [
                    { min: 0, max: 30, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 0, max: 30 }), trigger: 'change' }
                ],
                enterTel: [{ min: 0, max: 30, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 0, max: 30 }), trigger: 'blur,change' }],
                enterZipcode: [{ min: 0, max: 30, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 0, max: 30 }), trigger: 'blur,change' }],
                address: [
                    { min: 0, max: 200, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 0, max: 200 }), trigger: 'blur,change' },
                    { pattern: /^[a-zA-Z\u4e00-\u9fa5 ]{1,20}$/, message: this.$t('filter.type5') },]
            },
            menuData: [],
            menuDataD:[],
            defaultProps: {
                children: 'children',
                label: 'label'

            },
            carType: '',
            carTypeList: [
                { name: '货运', id: '1' },
                { name: '渣土', id: '2' },
                { name: '环卫', id: '3' },
                { name: '客运', id: '4' }
            ],
            mapType: '1',
            mapTypeList: [
                { name: '百度', id: '1' },
                { name: '高德', id: '3' },
                { name: '谷歌', id: '4' }
            ],
            // superiorPlateform,
        }
    },
    methods: {
        del(e){
            e.preventDefault();
            e.stopPropagation();
            this.options.childDialog.superiorPlatformId = '';
            this.options.childDialog.superiorPlatform = '';
            this.companyForm.superiorPlatform = '';
            this.companyForm.superiorPlatformId = '';
            this.companyForm.consumerId = '';
            this.rules.consumerId = [];
        },
        //菜单管理模板树点击回调
        label(val) {
            if(val.id == 'empty'){
                this.menuData = this.menuDataD;
            }else{
                this.$store.dispatch('getEntMenuTreeById', { id: val.id }).then(data => {
                this.menuData = data.data.entMenu
                })
                this.getSeclectMenuId(val.id);
            }
        },
        bindPt(){
            this.options.childDialog.title = '上级平台';
            this.options.childDialog.flag = true;
            this.options.childDialog.name = 'sPlatform'
        },
        // //tab切换执行事件
        // tabClick(tab,event){
        //     if(tab.index == 1){
        //         this.$store.dispatch('findEntTreesByEntId',{enterpriseId:this.options.nowId}).then(data=>{
        //             // console.log(data)
        //         })
        //     }
        // },
        //基础信息公司树点击回调
        selectValue(data) {
            data.id == 'empty' ? 
            (this.companyForm.pid = '',this.options.childDialog.menuUseEnterPriseId = ''):
            (this.companyForm.pid = data.id,this.options.childDialog.menuUseEnterPriseId = data.id)
        },

        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //菜单内容渲染
        renderContent(h, { node, data, store }) {
            return (
                <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                <span>
                    <span >{data.text}</span>
                </span>
                    <span>
                        <el-button icon="plus" size="mini" class={[((data.type == 1 && data.id == 2) || (data.type == 2)) ? 'show' : 'hide']} style="float:left" on-click={() => this.nodeAddMenu(node, store, data)}>{this.$t('companyManage.addMenu')}</el-button>
                        <el-button icon="plus" size="mini" class={[data.type == 3 || (node.parent.data.text == '管理'?(node.parent.data.type == 1):(node.parent.data.type == 2)) ? 'hide' : 'show']} style="float:left" on-click={() => this.nodeAddModule(node, store, data)}>{this.$t('companyManage.addMenuGroup')}</el-button>
                        <el-button icon="edit" size="mini" class={[data.type != 2 ? 'hide' : 'show']} style="float:left" on-click={() => this.nodeEdit(node, store, data)}>{this.$t('power.modify')}</el-button>
                        <el-button icon="delete" style="float:left" class={[data.type == 1 ? 'hide' : 'show']} size="mini" on-click={() => this.nodeDel(node, store, data)}>{this.$t('power.remove')}</el-button>
                    </span>
                </span>);
        },
        //菜单节点编辑
        nodeEdit(node, store, data) {
            // console.log(node,store,data)
            if (data.type == 2) {
                // console.log(data)
                // this.options.action.node = node;
                // this.options.action.store = store;
                // this.options.action.data = data;
                data.isModify = true;
                this.moduleActionDialog(this.$t('companyManage.editMenu'), node, store, data);
                // data.text = '111';
            } else {

            }
        },
        //菜单节点删除
        nodeDel(node, store, data) {
            // debugger
            if (data.type == 2 || data.type == 3) {
                let children = node.parent.data.children;
                // debugger
                for (let i = 0; i < children.length; i++) {
                    if (children[i].id == data.id) {
                        node.parent.data.children.splice(i, 1);
                        break;
                    }
                }

                if (data.type == 3) {
                    let selectMenuID = this.options.childDialog.selectMenuID;
                    for (let i = 0; i < selectMenuID.length; i++) {
                        if (selectMenuID[i] == data.id) {
                            this.options.childDialog.selectMenuID.splice(i, 1);
                            // console.log(this.options.childDialog.selectMenuID);
                            break;
                        }
                    }
                } else {
                    this.options.childDialog.selectMenuID = []
                }

            } else {
                // console.log(2)
            }
        },
        menuActionState(data, type) {
            let arr = data.children;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].type === type)
                    return false;
            }
            return true;
        },
        //添加菜单按钮
        nodeAddMenu(node, store, data) {
            if (data.type == 1) {
                this.menuActionDialog(this.$t('companyManage.addMenuM'), node, store, data);
            } else {
                let edit = this.menuActionState(data, 2)
                if (edit)
                    this.menuActionDialog(this.$t('companyManage.addMenuM'), node, store, data);
                else
                    this.$message.error({ message: this.$t('companyManage.tip4') });
            }
        },
        //添加模块按钮
        nodeAddModule(node, store, data) {
            // console.log("node", node);
            if (data.type == 1) {
                data.isModify = false
                this.moduleActionDialog(this.$t('companyManage.addMenuGroup'), node, store, data);
            } else {
                let edit = this.menuActionState(data, 3);
                if ((data.type == 1 || data.type == 2) && edit) {
                    data.isModify = false
                    this.moduleActionDialog(this.$t('companyManage.addMenuGroup'), node, store, data);
                } else {
                    this.$message.error({ message: this.$t('companyManage.tip4') });
                }
            }
        },
        //菜单二级弹框
        menuActionDialog(title, node, store, data) {
            this.options.childDialog.title = title;
            this.options.childDialog.name = 'menuAction';
            this.options.childDialog.flag = true;
            this.options.childDialog.action.node = node;
            this.options.childDialog.action.store = store;
            this.options.childDialog.action.data = data;
            // this.options.childDialog.isModify = true;
            this.options.childDialog.action.type = this.getParnetMenuId(node);

        },
        //模块二级弹框
        moduleActionDialog(title, node, store, data) {
            this.options.childDialog.title = title;
            this.options.childDialog.name = 'moduleAction';
            this.options.childDialog.flag = true;
            this.options.childDialog.action.node = node;
            this.options.childDialog.action.store = store;
            this.options.childDialog.action.data = data;
            this.options.childDialog.action.type = this.getParnetMenuId(node);
        },
        //获取最顶层平台的ID
        getParnetMenuId(node) {
            if (node.data.type == 1) {
                return node.data.id;
            } else {
                if (node.parent.data.type == 2) {
                    return node.parent.parent.data.id;
                } else {
                    return node.parent.data.id;
                }
            }
        },
        // 重置表单
        resetForm() {
            this.options.flag = false;
            this.companyForm.text="";
        },
        //提交表单
        submitForm() {
            this.$refs["companyForm"].validate((valid) => {
                if (valid) {
                    this.loadFlag = true;
                    if (this.companyForm.id == "")
                        //console.log("我是添加");
                        this.companyAction(COMMON.baseUrl + '/enterprise/addEnterprise');
                    else
                        //console.log("我是修改");
                        this.companyAction(COMMON.baseUrl + '/enterprise/updateEnterprise');
                } else {
                    return false;
                }
            });

        },
        //新增or更新（公司）
        companyAction(url) {
            // console.log(this.options)
            // console.log(url)
            let params = {
                id: this.companyForm.id, pid: this.companyForm.pid, enterpriseName: this.companyForm.enterpriseName,
                legal: this.companyForm.legal, identcode: this.companyForm.identcode, address: this.companyForm.address,
                enterTel: this.companyForm.enterTel, enterFox: this.companyForm.enterFox, enterZipcode: this.companyForm.enterZipcode,
                orgCode: this.companyForm.orgCode, remark: this.companyForm.remark, account: this.companyForm.account,
                simpleName: this.companyForm.simpleName,
                enterpriseMenus: JSON.stringify(this.menuData),
                enterpriseType: this.carType ? this.carType.join(',') : '',
                mapType: this.mapType,
                superiorPlatformId:this.companyForm.superiorPlatformId,
                consumerId:this.companyForm.consumerId
            };
            var regtext = /\"type\":3/
            if (regtext.test(params.enterpriseMenus)) {
                this.$http({
                    url: url,
                    data: params
                }).then((data) => {
                    // console.log(data)
                    if (!data.flag && !!data.errorCode) {
                        this.$message.error({ message: this.$t("error." + data.errorCode) });
                        this.loadFlag = false
                    }
                    else {
                        this.loadFlag = false
                        this.options.flag = false;
                        !this.options.isModify && (this.options.addId = data.data)
                        this.$emit("confirm");
                        // this.options.isModify && this.$emit("loadc");
                        this.$message.success({ message: this.$t('companyManage.operationSuccess') });
                        // console.log(this.options)
                    }
                });
            } else {
                this.$message.error({ message: this.$t('companyManage.tip5') });
                this.loadFlag = false
            }

        },

        //获取上级菜单
        getParentMenu() {
            http({
                url: COMMON.baseUrl + '/enterprise/getMenuType',
                params: {}
            }).then((data) => {
                if (!data.flag && !!data.errorCode) {
                    this.$message.error({ message: this.$t("error." + data.errorCode) });
                }
                else {
                    this.menuData = data.data;
                    this.menuDataD = data.data;
                    // console.log(this.menuData);
                }
            });

        },
        //获取公司信息
        getEterPriseById(id) {
            let loadingInstance = this.$loading({
                text: "正在拼命加载中",
                target: document.querySelector('.el-dialog')
            });
            this.$store.dispatch("getEnterpriseByID", { id: id }).then((data) => {
                if (!data.flag && !!data.errorCode) {
                    this.$message.error({ message: this.$t("error." + data.errorCode) });
                }
                else {
                    this.menuData = data.data.entMenu;
                    this.$service.extend(this.companyForm, data.data.entInfo);
                    this.companyForm.text=data.data.entInfo.enterpriseName;
                    // console.log(this.companyForm);
                    // console.log(this.companyForm.consumerId)
                    // console.log(!this.companyForm.consumerId)
                    if(this.companyForm.consumerId){
                        this.rules.consumerId.push({ required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' })
                    }
                    this.mapType = this.companyForm.mapType + "";
                    if (this.companyForm.enterpriseType != "") {
                        this.carType = this.companyForm.enterpriseType.split(',')
                    }
                    loadingInstance.close();
                }
            }).catch(_ => {
                loadingInstance.close();
            });

        },
        //获取选中菜单
        getSeclectMenuId(id) {
            http({
                url: COMMON.baseUrl + '/rolemenu/findEnterpriseDefaultMenu',
                params: { enterpriseId: id }
            }).then((data) => {
                // console.log(data)
                if (data.flag) {
                    // console.log("getcmpanymenu", data.data)
                    data.data.forEach((data) => {
                        this.options.childDialog.selectMenuID.push(data.id);
                    });
                    // console.log("getcmpanymenu", this.options.childDialog.selectMenuID)
                }
            });
        },
        //添加名称是否重复
        isSame(rules, value, callback) {
            if (!this.$service.isContext(value)) {
                let name = value + "";
                if (name != this.options.cn) {
                    this.$store.dispatch('isExistEnterpriseName', { enterpriseName: value }).then(data => {
                        if (!data.flag) {
                            callback(new Error(this.$t("companyManage.sameName")));
                        } else {
                            callback();
                        }
                    });
                } else {
                    callback();
                }
            }
        },
        //验证管理员账号是否存在
        isRoleSame(rules, value, callback) {
            if (!this.$service.isContext(value)) {
                let name = value + "";
                if (name != this.options.rn) {
                    this.$store.dispatch('checkEntUserIsAt', { account: value }).then(data => {
                        if (!data.flag) {
                            callback(new Error(this.$t("companyManage.sameRoleName")));
                        } else {
                            callback()
                        }
                    })
                } else {
                    callback()
                }
            }
        }
    },
    watch: {
        'options.flag'(newval) {
            if (!newval) {
                this.options.name = "";
                this.options.childDialog.selectMenuID = [];
                this.options.enterpriseId = '';
                this.options.pEnterpriseId = '';
                this.options.pEnterpriseName = '';
                this.$refs["companyForm"].resetFields();
                // console.log("selectMenuID-company-Action", this.options.childDialog.selectMenuID);
            }
        },
        'options.childDialog.superiorPlatformId'(newVal){
            if(newVal){
                this.companyForm.superiorPlatformId = newVal;
                this.rules.consumerId.push({ required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' })
            }
        },
        'options.childDialog.superiorPlatform'(newVal){
            if(newVal){
                this.companyForm.superiorPlatform = newVal;
            }
        }
    },
    mounted() {
        // console.log(this.options)
        // console.log(this.companyForm)
        if (this.options.enterpriseId == "") {
            // console.log('in')
            this.getParentMenu();
            this.enterpriseSelectReadonly = false;
            this.companyForm.pid = this.options.nowId;
            this.companyForm.pEnterpriseName = this.options.nowName;
        }
        else {
            this.getEterPriseById(this.options.enterpriseId);
            // console.log(this.options.enterpriseId);
            this.getSeclectMenuId(this.options.enterpriseId);
            this.companyForm.id = this.options.enterpriseId;
            this.companyForm.pid = this.options.pid;
            this.companyForm.pEnterpriseName = this.options.pname;
            this.enterpriseSelectReadonly = true;
            // console.log('modify')
            // console.log(this.companyForm)
        }
    }
}
</script>

<style lang="scss">
.companyManageAction {
    .hide {
        display: none
    }
    .show {
        display: block
    }
    .mt10 {
        margin-top: 10px;
    }
    .el-tree{
        border:0;
    }
    .el-tree-node__expand-icon.is-leaf{
        float: left;
    }
    .el-tree-node__content > .el-checkbox, .el-tree-node__content > .el-tree-node__expand-icon{
        float: left;
        margin-top:6px;
    }
    .el-badge__content,
    .el-message__group p,
    .el-steps.is-horizontal,
    .el-tabs__nav,
    .el-tag,
    .el-time-spinner,
    .el-upload-cover__title {
        white-space: normal;
    }
    .el-tabs__content {
        overflow: initial;
    }
    .addAndModify {
        .el-form-item:not(:first-child) {
            .el-input {
                width: 217px;
            }
        }
    }
}
</style>

