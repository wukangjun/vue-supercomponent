<template>
  <el-row class="container">
    <el-col :span="24">
      <el-tabs v-model="tabs.activeName">
        <!-- 基本信息 -->
        <el-tab-pane name="first" :label="$t('UserManage.basicInformation')">
          <el-form :model="userForm" ref="userForm" :rules="rules" :inline="true" label-width="80px" style="width:100%;">
            <!-- 所属公司 -->
            <el-form-item :label="$t('UserManage.wellmadestarm')" prop="enterpriseName">
              <cv-dropdown-tree :readonly='disable' v-model="userForm.enterpriseName" style="width:300px" @label="selectEnterprise" :data="this.options.childTreeData" :placeholder="$t('role.company')" ref="enterpriseNameValue"></cv-dropdown-tree>
            </el-form-item>
            <!-- 所属角色 -->
            <el-form-item :label="$t('UserManage.role')" prop="roleToUser">
              <el-select :disabled='disable' v-model="roleCheckID" multiple style="width:300px" @change="selectRole" :placeholder="$t('placeholder.selectValue')">
                <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 账号 -->
            <el-form-item :label="$t('UserManage.accountNumber')" prop="account">
              <el-input :readonly='disable' v-model="userForm.account" :placeholder="$t('placeholder.inputValue')"></el-input>
            </el-form-item>
            <!-- 姓名 -->
            <el-form-item :label="$t('UserManage.name')" prop="username">
              <el-input v-model="userForm.username" style="width:300px" :placeholder="$t('placeholder.inputValue')"></el-input>
            </el-form-item>
            <!-- 用户类型 -->
            <el-form-item :label="$t('UserManage.userType')" prop="accountType">
              <el-select @change="estimateUserType" :disabled='disable' v-model="userForm.accountType" style="width:300px" :placeholder="$t('placeholder.selectValue')">
                <el-option v-for="item in userType" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 用户描述 -->
            <el-form-item :label="$t('UserManage.userDescribe')" prop="remark">
              <el-input v-model="userForm.remark" :placeholder="$t('placeholder.inputValue')"></el-input>
            </el-form-item>
            <!-- 性别 -->
            <el-form-item :label="$t('UserManage.gender')" prop="sex">
              <el-select v-model="userForm.sex" style="width:300px" :placeholder="$t('placeholder.selectValue')">
                <el-option v-for="item in sex" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 出生日期 -->
            <el-form-item :label="$t('UserManage.dateOfBirth')" prop="birthday">
              <el-date-picker v-model="userForm.userExt.birthday" type="date" :placeholder="$t('placeholder.selectDate')" :picker-options="pickerOptions0" :editable="false">
              </el-date-picker>
            </el-form-item>
            <!-- 邮政编码 -->
            <el-form-item :label="$t('UserManage.postalcode')" prop="zipCode">
              <el-input v-model="userForm.userExt.zipCode" :placeholder="$t('placeholder.inputValue')"></el-input>
            </el-form-item>
            <!-- 固定电话 -->
            <el-form-item :label="$t('UserManage.telephone')" prop="landline">
              <el-input v-model="userForm.landline" :placeholder="$t('placeholder.inputValue')"></el-input>
            </el-form-item>
            <!-- 身份证 -->
            <el-form-item :label="$t('UserManage.identityCard')" prop="idcards">
              <el-input v-model="userForm.idcards" :placeholder="$t('placeholder.inputValue')"></el-input>
            </el-form-item>
            <!-- 传真 -->
            <el-form-item :label="$t('UserManage.fax')" prop="fox">
              <el-input v-model="userForm.userExt.fox" :placeholder="$t('placeholder.inputValue')"></el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item :label="$t('UserManage.mailbox')" prop="email">
              <el-input v-model="userForm.email" :placeholder="$t('placeholder.inputValue')"></el-input>
            </el-form-item>
            <!-- 手机 -->
            <el-form-item :label="$t('UserManage.mobilePhone')" prop="mobilephone">
              <el-input v-model="userForm.mobilephone" :placeholder="$t('placeholder.inputValue')"></el-input>
            </el-form-item>
            <!-- 地址 -->
            <el-form-item :label="$t('UserManage.address')" prop="address">
              <el-input v-model="userForm.userExt.address" style="width:500px" :placeholder="$t('placeholder.inputValue')"></el-input>
            </el-form-item>
            <!-- 用户车辆限制权限 -->
            <div class='vlimit'>
              <label class='vLlabel'>{{$t('UserManage.vehicleLimit')}}</label>
              <el-switch v-model="userForm.hasLockCar" on-color="#13ce66" off-color="#eee" :on-value='1' :off-value='0' on-text='开' off-text='关' @change='getValue'>
              </el-switch>
            </div>
          </el-form>
        </el-tab-pane>
        <!-- 用户权限 -->
        <el-tab-pane name="second" :label="$t('UserManage.usePermission')">
          <el-collapse v-loading="panelLoading" style="min-height:230px;" v-model="activeName">
            <el-collapse-item v-show="allModules.length>0" v-for="modules in allModules" :title="modules.name" :name="modules.id" :key="modules._id">
              <el-row>
                <cv-scrollbar style="height:230px;padding-right:10px;">
                  <all-check v-for="menu in modules.roleModules" :data="menu" :allChecked="allChecked" :key="menu.crumbs" @checked="checkedVal" :checkDisabled="options.isShow"></all-check>
                </cv-scrollbar>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <!-- 车组权限 -->
        <el-tab-pane name="third" :label="$t('UserManage.carsPermission')">
          <el-input :placeholder="$t('placeholder.selectValue')" v-model="filterText" style="margin-bottom:10px;">
          </el-input>
          <search-tree ref="searchtree" @treeInit="treeReady" :data="fleetTree" :isCheck="true" @node-change="filterNode"></search-tree>
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <el-col :span="24" class="dialog-footer" style="padding-top:20px;">
      <el-button :loading='loading' @click="submitForm('userForm')" type="primary">{{$t('action.save')}}</el-button>
      <el-button @click="resetForm('userForm')">{{$t('action.cancel')}}</el-button>
    </el-col>
  </el-row>
</template>

<script>
  import allCheck from "../roleManage/allCheck.vue";
  import searchTree from "@/components/search-ztree/search.ztree.vue";
  export default {
    components: {
      allCheck,
      searchTree
    },
    props: {
      options: {}
    },
    data() {
      return {
        panelLoading: true,
        fleetIds: '', //车组权限勾选ids
        open: "",
        btn: true,
        tabs: {
          activeName: "first"
        },
        limitFlag: false,
        allChecked: [],
        allModules: [],
        arr: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          }
        },
        loading: false,
        disable: false,
        //collapse
        activeName: ["1", "2", "3"],
        fleetTree: [],
        //form
        roleCheckID: [],
        userForm: {
          enterpriseId: "",
          enterpriseName: "",
          username: "",
          account: "",
          mobilephone: "",
          shortname: "",
          email: "",
          sex: "",
          accountType: "",
          remark: "",
          //座机
          landline: "",
          id: "",
          roleIds: "",
          idcards: "",
          userExt: {
            birthday: "",
            fox: "",
            zipCode: "",
            address: ""
          },
          roleModule: [],
          fleetIds: "",
          hasLockCar: 0
        },
        rules: {
          enterpriseName: [{
            required: true,
            message: this.$t("filter.notEmpty"),
            trigger: "blur,change"
          }],
          account: [{
              required: true,
              message: this.$t("filter.notEmpty"),
              trigger: "blur,change"
            },
            {
              min: 2,
              max: 15,
              message: this.$filter.lanReplace(this.$t("filter.Length"), {
                min: 2,
                max: 15
              })
            },
            {
              pattern: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
              message: this.$t("filter.type4")
            },
            {
              validator: this.estimateEnterpriseName,
              trigger: "blur,change"
            },
            {
              validator: this.verificationAccount,
              trigger: "blur"
            }
          ],
          accountType: [{
            required: true,
            message: this.$t("filter.notEmpty"),
            trigger: "blur,change"
          }],
          roleToUser: [{
            message: this.$t("filter.notEmpty"),
            trigger: "blur,change"
          }],
          username: [{
            required: true,
            message: this.$t("filter.notEmpty"),
            trigger: "blur,change"
          }],
          // zipCode:[{pattern:/^[1-9][0-9]{5}$/,message:'开头不能为0，共六位数字',trigger: 'blur,change'}],
          idcards: [{
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: this.$t("filter.type11")
          }],
          mobilephone: [{
              required: true,
              message: this.$t("filter.notEmpty"),
              trigger: "blur,change"
            },
            {
              pattern: /^(1[3|4|5|7|8][0-9]{9})$/,
              message: this.$t("filter.type10")
            }
          ]
        },
        treeData: [],
        sex: [{
            value: "1",
            label: this.$t("common.sex.1")
          },
          {
            value: "0",
            label: this.$t("common.sex.0")
          }
        ],
        userType: [{
            value: "1",
            label: this.$t("common.userType.1"),
            disabled: true
          },
          {
            value: "2",
            label: this.$t("common.userType.2")
          },
          {
            value: "3",
            label: this.$t("common.userType.3"),
            disabled: true
          },
          {
            value: "4",
            label: this.$t("common.userType.4"),
            disabled: true
          },
          {
            value: "5",
            label: this.$t("common.userType.5"),
            disabled: true
          }
        ],
        roleList: [],
        filterText: "",
        defaultProps: {
          children: "children",
          label: "text",
          id: "id"
        }
      };
    },
    methods: {
      //车组树加载完成后执行
      treeReady() {
        //根据用户类型判断，只有普通用户才有操作权限
        if (this.userForm.accountType != 2) {
          this.$refs['searchtree'].checkAllNodes()
          this.$refs['searchtree'].disabledAllNodes(true)
        } else {
          this.$refs['searchtree'].disabledAllNodes(false)
          this.$refs['searchtree'].cancelAllNodes()
        }
      },
      //校验登陆用户是否存在
      verificationAccount(rules, value, callback) {
        if (!this.$service.isContext(value)) {
          let name = value + "";
          if (name != this.options.modifyData.account) {
            this.$store
              .dispatch("checkEntUser", {
                account: value
              })
              .then(data => {
                if (!data.flag) {
                  callback(new Error(this.$t("error.4000")));
                } else {
                  callback();
                }
              });
          } else {
            callback();
          }
        }
      },
      //用户选择操作
      estimateUserType() {
        //如果用户类型为默认管理员跟超级管理员的时候一些选项禁止
        if (this.userForm.accountType == 4 || this.userForm.accountType == 5) {
          this.disable = true;
        }
        //用户类型只有普通用户才能进行车组操作
        if (this.userForm.accountType != 2) {
          this.$refs['searchtree'].checkAllNodes()
          this.$refs['searchtree'].disabledAllNodes(true)
        } else {
          this.$refs['searchtree'].disabledAllNodes(false)
          this.$refs['searchtree'].cancelAllNodes()
        }
      },
      //检查公司名称是否存在
      estimateEnterpriseName(rules, value, callback) {
        if (this.userForm.enterpriseName == "") {
          callback(new Error(this.$t("UserManage.selectCompany")));
        } else {
          callback();
        }
      },
      //用户权限勾选操作
      checkedVal(val) {
        if (val.checked.length > 0) {
          if (this.allChecked.length > 0) {
            let obj = this.findMenuID(val.id);
            if (obj.flag) {
              this.allChecked[obj.index].actionIds = val.checked.join(",");
            } else {
              //用户新增和修改时重复新增和删除角色时的问题解决
              if (this.userForm.id != undefined) {
                this.allChecked.push({
                  menuId: val.id,
                  actionIds: val.checked.join(","),
                  moduleId: val.moduleId
                });
              } else {
                this.allChecked = [];
              }
            }
          } else {
            this.allChecked.push({
              menuId: val.id,
              actionIds: val.checked.join(","),
              moduleId: val.moduleId
            });
          }
        } else {
          let obj = this.findMenuID(val.id);
          if (obj.flag) {
            this.allChecked[obj.index].actionIds = val.checked.join(",");
          } else {
            //用户新增和修改时重复新增和删除角色时的问题解决
            if (this.userForm.id != undefined) {
              this.allChecked.push({
                menuId: val.id,
                actionIds: val.checked.join(","),
                moduleId: val.moduleId
              });
            } else {
              this.allChecked = [];
            }
          }
        }
      },
      //用户权限中勾选的相关操作
      findMenuID(id) {
        let arr = this.allChecked,
          flag = false,
          index = -1;
        for (let i = 0; i < arr.length; i++) {
          if (parseInt(arr[i].menuId) == parseInt(id)) {
            flag = true;
            index = i;
            break;
          }
        }
        return {
          flag: flag,
          index: index
        };
      },
      //基本信息公司选择
      selectEnterprise(val) {
        this.userForm.enterpriseId = val.id;
        this.userForm.enterpriseName = val.text;
        this.roleCheckID = [];
        this.roleList = [];
        this.userForm.roleIds = "";
      },
      //提交表单
      submitForm(formName) {
        //验证表单填写
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.userForm.roleModule = this.allChecked;
            if (this.userForm.accountType != 2) {
              this.userForm.fleetIds = '';
            } else {
              let fleet = this.fleetIds.split(",");
              fleet.splice(0, 1);
              this.userForm.fleetIds = fleet.join(",");
            }
            this.loading = true;
            if (this.userForm.id == undefined) {
              //新增
              this.userAction(
                this.$COMMON.baseUrl + "/user/insertUser",
                this.userForm
              );
            } else {
              //修改
              console.log(this.userForm)
              this.userAction(
                this.$COMMON.baseUrl + "/user/updateUserById",
                this.userForm
              );
              // console.log(this.userForm)
            }
          } else {
            this.tabs.activeName = "first";
            return false;
          }
        });
        //添加
      },
      //提交表单接口
      userAction(url, params) {
        this.$http({
            url: url,
            data: JSON.stringify(params)
          })
          .then(data => {
            if (!data.flag && !!data.errorCode)
              this.$message.error({
                message: this.$t("error." + data.errorCode)
              });
            else {
              //重新加载数据
              this.$emit("confirm", this.userForm.enterpriseId);
              this.options.flag = false;
              this.$message.success(this.$t("UserManage.actionSuccess"));
            }
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      },
      //根据ID获取用户
      getUserByID(id) {
        let loadingInstance = this.$loading({
          text: this.$t("role.type1"),
          target: document.querySelector(".el-dialog")
        });
        // this.open = "";
        this.$http({
            url: this.$COMMON.baseUrl + "/user/getUserById",
            params: {
              id: id
            }
          })
          .then(data => {
            loadingInstance.close();
            if (!data.flag && !!data.errorCode)
              this.$message.error({
                message: this.$t("error." + data.errorCode)
              });
            else {
              this.messageMatch(this.userForm, data.data);
              this.userForm.enterpriseId = data.data.enterpriseId;
              this.userForm.accountType = data.data.accountType + "";
              this.userForm.userType = data.data.userType + "";
              this.userForm.roleToUser = data.data.roleToUser + "";
              this.userForm.hasLockCar = parseInt(data.data.hasLockCar);
              if (!data.data.userExt.birthday == "") {
                this.userForm.userExt.birthday = new Date(
                  data.data.userExt.birthday + "T16:00:00.000Z"
                );
              }
              let roleids = this.userForm.roleIds;
              let roleCheck = [];
              if (roleids != null && roleids != "") {
                roleCheck = roleids.split(",");
                this.userForm.roleIds = roleCheck.join(",");
                this.roleCheckID = roleCheck;
              }
              setTimeout(
                this.getMenuByIds(
                  this.userForm.enterpriseId,
                  this.userForm.roleIds,
                  this.userForm.id
                ),
                1000
              );
            }
          })
          .catch(() => {
            loadingInstance.close();
          });
      },
      //信息匹配的方法
      messageMatch(setMatch, getMatch) {
        for (var k in setMatch) {
          for (var j in getMatch) {
            if (j == k) {
              setMatch[k] = getMatch[j];
            }
          }
        }
      },
      //获取公司下所有角色
      getRoleByenterpriseId(enterpriseId) {
        this.$http({
          url: this.$COMMON.baseUrl + "/role/findAllRole",
          method: "get",
          params: {
            enterpriseId: enterpriseId
          }
        }).then(data => {
          if (!data.flag && !!data.errorCode)
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
          else {
            data.data.forEach(data => {
              this.roleList.push({
                id: data.id.toString(),
                roleName: data.roleName
              });
              // this.roleList = data.data
            });
            // this.roleList = data.data;
          }
        });
      },
      //重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.options.flag = false;
      },
      //过滤节点
      filterNode(data) {
        if (data.length > 0) {
          let arry = [];
          data.forEach(element => {
            arry.push(element.id);
          });
          this.fleetIds = arry.join(",");
        } else {
          this.fleetIds = "";
        }
      },
      //角色选择触发事件
      selectRole(val) {
        this.roleCheckID = val;
      },
      //根据公司号获取车组树
      getFleetsByEnterpriseId(id) {
        this.$http({
          url: this.$COMMON.baseUrl + "/fleet/findFleetInfoList",
          params: {
            enterpriseId: id
          }
        }).then(data => {
          if (!data.flag && !!data.errorCode) {
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
          } else {
            this.fleetTree = [];
            this.fleetTree = data.data;
            if (this.userForm.accountType == 2) {
              this.getUserFleetsByid(
                this.userForm.id,
                this.userForm.enterpriseId
              );
            }
          }
        });
      },
      //根据用户获取车组权限
      getUserFleetsByid(userid, enterpriseid) {
        this.$http({
          url: this.$COMMON.baseUrl + "/user/findFleetUserBySysUser",
          params: {
            userId: userid,
            enterpriseId: enterpriseid
          }
        }).then(data => {
          if (!data.flag && !!data.errorCode) {
            this.$message.error({
              message: this.$t("error." + data.errorCode)
            });
          } else {
            data.data.length != 0 && this.$refs.searchtree.checkNodeById(data.data);
            this.userForm.accountType != 2 && this.$refs['searchtree'].disabledAllNodes();
          }
        });
      },
      //根据公司号,角色来获取选中菜单的权限
      getMenuByIds(enterpriseId, roleIds, id) {
        for (let i = 0; i < arguments.length; i++) {}
        let params = {
          enterpriseId: enterpriseId,
          roleIds: roleIds,
          id: id
        };
        this.$store
          .dispatch("getMenuByenterpriseIdAndroleIds", params)
          .then(data => {
            if (!data.flag && !!data.errorCode) {
              this.allModules = [];
            } else {
              this.allModules = [];
              this.allModules = data.data;
            }
            setTimeout(_ => {
              this.panelLoading = false;
            }, 500)
            //多选角色时需要每次去合并每个角色返回的权限并合并 此处不能简单的赋值而是数组去重合并
          });
      },
      //用户车辆限制权限
      getValue(data) {
        this.userForm.hasLockCar = data;
      }
    },
    watch: {
      "options.flag" (newval) {
        if (!newval) {
          this.options.name = "";
          this.options.isShow = false;
          this.options.modifyData = {};
        }
      },
      //选择角色时获取到该角色下的权限
      roleCheckID(newval) {
        //此处需要进行判断 如果没有选择角色的时候 应该调用一个接口只是返回之前 手动勾选的权限
        //如果选择了角色应该返回角色的权限
        //选择角色时就变成禁选项
        //添加用户的时候不添加角色的时候 这个时候应该返回所有的模块
        if (newval.length == 0) {
          if (this.options.modifyData.id == "") {
            this.getMenuByIds(this.userForm.enterpriseId);
          } else {
            //点击修改更
            this.getMenuByIds(
              this.userForm.enterpriseId,
              "",
              this.options.modifyData.id
            );
          }
          //清空勾选的角色id
          // this.userForm.roleIds = '';
        } else {
          this.userForm.roleIds = newval.join(",");
          if (this.userForm.id != undefined) {
            this.getMenuByIds(
              this.userForm.enterpriseId,
              this.userForm.roleIds,
              this.userForm.id
            );
          } else {
            this.getMenuByIds(this.userForm.enterpriseId, this.userForm.roleIds);
          }
        }
        newval.length > 0 ?
          (this.options.isShow = true) :
          (this.options.isShow = false);
      },
      //用户车辆限制相关
      // open(newVal) {
      //   newVal == "1" ? (this.btn = false) : (this.btn = true);
      // },
      //监听选择公司的变化 如果只选了公司没有选择角色 就要返回之前添加时手动选择的权限
      "userForm.enterpriseId" (newval, oldval) {
        if (newval != "" && this.userForm.enterpriseName != '') {
          this.getRoleByenterpriseId(this.userForm.enterpriseId);
          this.getFleetsByEnterpriseId(this.userForm.enterpriseId);
          if (this.userForm.id == undefined) {
            this.getMenuByIds(this.userForm.enterpriseId);
          } else {
            this.getMenuByIds(this.userForm.enterpriseId, this.userForm.id);
          }
        } else {
          this.fleetTree = [];
        }
      },
      //车组权限节点过滤
      filterText(val) {
        this.$refs.searchtree.filter(val);
      }
    },
    mounted() {
      //userForm.id来判断是添加还是修改，添加的话 id= underfindd
      this.userForm.id = this.options.modifyData.id;
      //修改
      if (this.userForm.id != undefined) {
        this.getUserByID(this.userForm.id);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .dialog-search {
    margin-top: 24px;
  }
  .el-input {
    width: 300px;
  }
  .el-select {
    width: 120px;
  }
  .vlimit {
    margin-right: 10px;
    margin-bottom: 22px;
    vertical-align: top;
    height: 30px; // background:pink;
    .vLlabel {
      text-align: right;
      vertical-align: middle;
      font-size: 14px;
      color: red;
      line-height: 1;
      padding: 11px 12px 11px 0;
      box-sizing: border-box;
    }
  }
</style>
