<template>
    <el-row class="container">
        <el-col :span="24">
            <el-tabs v-model="tabs.activeName">
                <el-tab-pane name="first" :label="$t('role.message')">
                    <el-form :model="roleForm" :inline="true" :rules="rules" ref="roleForm" label-width="80px" style="width:100%;">
                        <el-form-item :label="$t('common.enterprise.affiliated')" prop="enterpriseName">
                            <cv-dropdown-tree v-model="roleForm.enterpriseName" :readonly="options.isModify" @label="selectValue" :data="this.options.childTreeData" :placeholder="$t('role.company')"></cv-dropdown-tree>
                        </el-form-item>
                        <el-form-item :label="$t('role.roleName')" prop="roleName">
                            <el-input size="small" v-model.trim="roleForm.roleName" :placeholder="$t('placeholder.inputValue')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('role.roleType')" prop="roleType">
                            <el-select v-model="roleForm.roleType" style="width:160px;" :placeholder="$t('placeholder.selectValue')">
                                <el-option v-for="item in roleTypeOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('role.roleRemark')" prop="remark">
                            <el-input size="small" v-model="roleForm.remark" :placeholder="$t('placeholder.inputValue')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('role.roleCheckedUser')" prop="checkedUser">
                            <div class="mypanel">
                                <el-transfer v-model="checkedUser" filterable :props="{
                                                            label:'name',
                                                            key:'id'
                                                        }" :render-content="renderFunc" :titles="[this.$t('role.noCheckedUser'), this.$t('role.yCheckedUser')]" :footer-format="{
                                                        noChecked: '${total}'+this.$t('role.xiang'),
                                                        hasChecked: '${checked}/${total}'+this.$t('role.xiang')
                                                        }" @change="handleChange" :data="UserList">
                                </el-transfer>
                            </div>

                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane name="second" :label="$t('role.rolePermission')">
                    <el-select v-model="nothing" @clear="clear" clearable v-show="allModules.length>0" style='width:300px;margin-bottom:10px;' :placeholder="$t('placeholder.roleCopy')">
                        <el-option v-for="item in copyRoleJurisdiction" :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-collapse v-model="activeName">
                        <h2 v-show="allModules.length==0" style="position: relative; min-height:30px;text-align: center;width: 100%;height: 100%;color: #5e7382;font-size:14px;padding-top:30px; font-weight:100;">{{$t('el.table.emptyText')}}</h2>

                        <el-collapse-item v-show="allModules.length>0" v-for="modules in allModules" :title="modules.name" :name="modules.id" :key="modules.id">
                            <el-row>
                                <cv-scrollbar style="height:200px;">
                                    <all-check v-for="menu in modules.roleModules" :data="menu" :allChecked="allChecked" :key="menu.crumbs" @checked="checkedVal"></all-check>
                                </cv-scrollbar>
                            </el-row>
                        </el-collapse-item>
                    </el-collapse>
                </el-tab-pane>
            </el-tabs>
        </el-col>
        <el-col :span="24" class="dialog-footer" style="padding-top:20px;">
            <el-button :loading="loading" @click="submitForm('roleForm')" type="primary">{{$t('action.save')}}</el-button>
            <el-button @click="resetForm('roleForm')">{{$t('action.cancel')}}</el-button>
        </el-col>
    </el-row>
</template>
<script>
import allCheck from './allCheck.vue'
export default {
    components: {
        allCheck
    },
    props: {
        options: {}
    },
    data() {
        return {
            tabs: {
                activeName: "first"
            },
            originalActionsId: [],
            companysId: '',
            companysIds: '',
            styles: 'display:none',
            allChecked: [],
            allModules: [],
            UserList: [],
            checkedUser: [],
            loading: false,
            nothing: '',
            copyRoleJurisdiction: [],
            renderFunc(h, option) {
                return <span>{option.name}</span>;
            },
            //collapse
            activeName: ['1', '2', '3'],
            roleForm: {
                id: '',
                enterpriseName: '',
                enterpriseId: '',
                roleName: '',
                company: '',
                roleType: '',
                remark: ''
            },
            rules: {
                roleName: [
                    { required: true, message: this.$t('filter.notEmpty'), trigger: 'blur,change' },
                    { min: 2, max: 15, message: this.$filter.lanReplace(this.$t('filter.Length'), { min: 2, max: 15 }) }
                ],
                roleType: [
                    { required: true, message: this.$t('filter.notEmpty'), trigger: 'change' }
                ],
                enterpriseName: [{ required: true, message: this.$t('filter.notEmpty'), trigger: 'change' }]
            },
            treeData: [],
            roleTypeOptions: [{
                value: "0",
                label: this.$t('common.roleType.0'),
                disabled: true
            }, {
                value: "1",
                label: this.$t('common.roleType.1'),
                disabled: true
            }, {
                value: "2",
                label: this.$t('common.roleType.2'),
                disabled:true
            }, {
                value: "3",
                label: this.$t('common.roleType.3')
            }]
        };
    },
    methods: {
        checkedVal(val) {
            // console.log(val.checked.length)
            if (val.checked.length > 0) {
                if (this.allChecked.length > 0) {
                    let obj = this.findMenuID(val.id);
                    if (obj.flag) {
                        this.allChecked[obj.index].actionIds = val.checked.join(',')
                    }
                    else {
                        this.allChecked.push({ menuId: val.id, actionIds: val.checked.join(','), moduleId: val.moduleId });
                    }
                } else {
                    this.allChecked.push({ menuId: val.id, actionIds: val.checked.join(','), moduleId: val.moduleId });
                }
            }
            if (val.checked.length == 0) {
                this.allChecked.forEach((data, index) => {
                    if (parseInt(data.menuId) == parseInt(val.id)) {
                        this.allChecked.splice(index, 1);
                        return;
                    }
                });
            }
        },
        findMenuID(id) {
            let arr = this.allChecked, flag = false, index = -1;
            for (let i = 0; i < arr.length; i++) {
                if (parseInt(arr[i].menuId) == parseInt(id)) {
                    flag = true; index = i;
                    break;
                }
            }
            return { flag: flag, index: index };
        },
        selectValue(data) {
            this.companysId = data.id
            this.nothing = ''
            this.copyRoleJurisdiction = []
            this.allModules = []
            if (data.id) {
                this.roleForm.enterpriseId = data.id;
                var rId = this.roleForm.enterpriseId
                this.copyRole(rId)
                this.roleForm.enterpriseName = data.text;
                this.checkedUser = [];
                this.allModules = [];
                this.UserList = [];

            }
        },
        clear() {
            this.getMenuByIds(this.roleForm.enterpriseId, this.roleForm.id)
            // console.log('clear')
            // console.log(this.roleForm)
        },
        //获得公司下所有角色并复制权限
        copyRole(rId) {
            // console.log(rId)
            this.allModules = []
            this.$http({
                url: this.$COMMON.baseUrl + '/role/findAllRole',
                method: 'get',
                params: { enterpriseId: rId }
            }).then((data) => {
                // console.log(data)
                for (var i = 0; i < data.data.length; i++) {
                    this.copyRoleJurisdiction.push({ id: data.data[i].id, roleName: data.data[i].roleName });
                }
            });
        },
        //复制后角色权限显示
        getRoleJurisdiction(newval) {
            // console.log('角色ID： ' + newval)
            // console.log('公司ID： ' + this.companysId)
            // this.allModules=[]
            if (newval != '') {
                this.$http({
                    url: this.$COMMON.baseUrl + '/role/findRoleMenu',
                    method: 'post',
                    params: { enterpriseId: this.companysId, roleId: newval }
                }).then((data) => {
                    // console.log(data.data)
                    this.allModules = data.data
                });
            }
        },
        //复制后角色权限显示(修改)
        getRoleJurisdictionUpdata(newval) {
            // console.log('角色ID： ' + newval)
            // console.log('公司ID： ' + this.companysIds)
            // this.allModules=[]
            this.$http({
                url: this.$COMMON.baseUrl + '/role/findRoleMenu',
                method: 'post',
                params: { enterpriseId: this.companysIds, roleId: newval }
            }).then((data) => {
                // console.log(data.data)
                this.allModules = data.data
                // console.log(this.allModules)
            });
        },
        handleChange(value, direction, movedKeys) {
            // console.log(value, direction, movedKeys);
        },
        //获取所有角色列表
        getRoleByID() {
            this.$http({
                url: this.$COMMON.baseUrl + '/role/getRoleById',
                method: 'get',
                params: { id: '5005358293490005' }
            }).then((data) => {
                // console.log(data);
            });
            if (this.options.roleOptions.roleid != "" && this.options.roleOptions.companyID != "") {

            }
        },
        //获取角色下的用户
        getUserByRoleID(roleid) {
            // console.log('diandian')
            let loadingInstance = this.$loading({
                text: this.$t('role.type1'),
                target: document.querySelector('.el-dialog')
            });
            this.$http({
                url: this.$COMMON.baseUrl + "/userrole/findUserByRole",
                params: { roleId: roleid }
            }).then((data) => {
                loadingInstance.close();
                this.checkedUser = [];
                data.data.forEach((data) => {
                    this.checkedUser.push(data.id);
                });
            });
        },
        //根据公司号,角色来获取选中权限的菜单
        getMenuByIds(enterpriseId, roleIds) {
            let params = { enterpriseId: enterpriseId, roleIds: roleIds };
            this.$store.dispatch("getMenuByenterpriseIdAndroleIds", params).then((data) => {
                data.flag && !data.errorCode ? this.allModules = data.data : null;
            });
            // console.log(this.allModules)
        },
        getMenuById(enterpriseId, roleId) {
            let params = { enterpriseId: enterpriseId, roleId: roleId };
            this.$store.dispatch("findRoleMenu", params).then((data) => {
                data.flag && !data.errorCode ? this.allModules = data.data : null;
            });
        },
        //根据公司号获取所有用户
        getUserByCompanyID(id) {
            this.$http({
                url: this.$COMMON.baseUrl + '/user/findUserList',
                method: 'get',
                params: { enterpriseId: id }
            }).then((data) => {
                if (!data.flag && !!data.errorCode) {
                    this.$message.error({ message: this.$t("error." + data.errorCode) });
                }
                else {
                    let user = data.data;
                    user.forEach((row) => {
                        this.UserList.push({ id: row.id, name: (row.account + "-" + row.username) });
                    })
                }
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.roleForm.id, roleName: this.roleForm.roleName, roleType: this.roleForm.roleType,
                        remark: this.roleForm.remark, enterpriseId: this.roleForm.enterpriseId,
                        userIds: this.checkedUser.join(','), menuIds: this.allChecked
                    };
                    this.loading = true;
                    // console.log(this.checkedUser);
                    //添加
                    if (!this.roleForm.id)
                        this.ActionRole(this.$COMMON.baseUrl + "/role/insertRole", params);
                    //修改
                    else
                        this.ActionRole(this.$COMMON.baseUrl + "/role/updateRoleById", params);
                } else {
                    this.tabs.activeName = "first"
                    // console.log(this.tabs.activeName)
                    return false;
                }
            });

        },
        ActionRole(url, params) {
            this.$http({
                url: url,
                data: JSON.stringify(params)
            }).then((data) => {
                if (!data.flag && !!data.errorCode) {
                    this.$message.error({ message: this.$t("error." + data.errorCode) });
                }
                else {
                    this.$emit('confirm', this.roleForm.enterpriseId);
                    this.$message.success({ message: this.$t('UserManage.actionSuccess') });
                    this.options.flag = false;
                }
                this.loading = false
            }).catch(() => {
                this.loading = false
            });
        },
        getRoleBaseByID(id) {
            return new Promise((resolve, reject) => {
                this.$http({
                    url: this.$COMMON.baseUrl + '/role/getRoleById',
                    params: { id: id }
                }).then((data) => {
                    // console.log(data)
                    this.companysIds = data.data.enterpriseId
                    this.copyRole(data.data.enterpriseId)
                    this.roleForm = data.data;
                    this.roleForm.roleType = data.data.roleType.toString();
                    // console.log("roleForm",this.roleForm);
                    resolve(data)
                });
            })

        },
        resetForm(formName) {
            this.options.flag = false;

        }
    },
    watch: {
        'options.flag'(newval) {
            //console.log(newval);
            if (!newval) {
                this.options.name = "";
                this.options.roleOptions.roleID = "";
                this.options.roleOptions.companyID = "";
            }
        },
        "roleForm.enterpriseName"(newVal, oldVal) {
            if (newVal == '') {
                this.roleForm.enterpriseId = 0
            }
        },
        "roleForm.enterpriseId"(newval, oldVal) {
            // console.log('in')
            // console.log(newval,oldVal)
            this.getUserByCompanyID(newval);
            if (!this.options.isModify) {
                this.getMenuByIds(newval, this.roleForm.id);
                // this.styles = 'width:300px;display:block;'
            }
            // else{
            //     this.styles = 'display:none;'
            // }
            // if(this.options.isModify){
            //     this.styles = 'display:none'
            // }

        },
        'nothing'(newval, oldVal) {
            if (!this.options.isModify) {
                this.getRoleJurisdiction(newval)
            }
            if (this.options.isModify) {
                this.getRoleJurisdictionUpdata(newval)
            }
        },
        'allModules'(newVal) {
            // console.log(newVal)
        }

    },
    mounted() {
        // console.log(this.options)
        this.roleForm.id = this.options.roleOptions.roleID;
        // console.log(this.roleForm.id);
        if (this.roleForm.id != "") {
            let roleid = this.roleForm.id;
            this.getRoleBaseByID(roleid).then(data => {
                this.getUserByRoleID(this.roleForm.id);
                this.getMenuById(this.roleForm.enterpriseId, this.roleForm.id);
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.dialog-search {
    margin-top: 24px;
}

.el-select {
    width: 120px;
}

.mypanel {
    width: 700px;
}
</style>