# 1. project

> TSP平台项目

## 1.1. Build Setupss

``` bash
# 安装依赖
npm install

# serve with hot reload at localhost:8090
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

#目录结构
|——tspmanage                项目目录  
|  |——build					打包发布目录  
|  |——config				配置  
|  |——node_modules			依赖包  
|  |——src					开发目录  
|  |  |——assets				静态资源  
|  |  |——components			公共组件  
|  |  |——router				路由  
|  |  |  |——child.js		二级功能路由  
|  |  |  |——index.js		一级功能路由  
|  |  |——store				vuex  
|  |  |——utils				公共函数  
|  |  |  |——mixins         
|  |  |——view				项目功能视图  
|  |  |  |——home			home功能模块  
|  |  |  |  |——home.vue  
|  |  |  |——index			index功能模块  
|  |  |  |  |——header.vue	头部组件  
|  |  |  |  |——index.js		JS文件  
|  |  |  |  |——index.vue		  
|  |  |  |  |——nav.vue      菜单组件  
|  |  |  |——login           登录模块  
|  |  |  |——moinitor        监控模块  
|  |  |——app.vue			入口  
|  |  |——main.js			入口JS  
|  |——static  
|  |——.babelrc  
|  |——.editorconfig  
|  |——.gitgnore  
|  |——.postcssrc.js  
|  |——.index.html  
|  |——package-lock.json  
|  |——package.json  
|  |——readme.md  

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
# sbdoc 接口地址：http://116.228.114.206:10000/html/web/projectinfo/projectinfo.html

# element-ui
所有带有el标签的组件,参考地址：http://element.eleme.io/#/zh-CN/component

# 下拉树---公司树
<cv-dropdown-tree 
:placeholder=""
:interface="$COMMON.baseUrl/aaaa.do"
v-model="company"
:is-default="true"
:readonly="false"
@label="label"></cv-dropdown-tree>
参数说明：
placehoder: 输入框的默认提示文字
interface: 该下拉树需要的后台接口
readonly: 只读模式(true)  默认为false
v-model: 显示的内容名称
is-default:  是否默认选中第一个节点   默认为false--不选中
@label----  触发事件方法（函数第一个参数为一些需要的信息）

# 搜索树
<search-tree
:interface="$COMMON.baseUrl/aaaa.do"
:enterprise-id="enterpriseId"
@label="searchFn"
:is-default="true"
:is-edit="true"
></search-tree>
参数说明:
interface: 该下拉树需要的后台接口
enterprise-id:   搜索树需要的参数（目前需要企业id）
@label----  触发事件方法（函数第一个参数为一些需要的信息）
is-default:  是否默认选中第一个节点   默认为false--不选中
is-edit:  是否打开编辑功能(添加，删除， 修改)
is-pagination:是否显示分页(默认为true，不需分页false)
#表格组件
<cv-grid :options="vehicleListGrid.options" :is-pagination='false'>
    <el-table border stripe :data="vehicleListGrid.table" v-loading="vehicleListGrid.loading">
        <el-table-column :label="$t('vgPower.plateCode')" prop="plateCode" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column :label="$t('vgPower.plateColor')" prop="plateColor" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column :label="$t('vgPower.vehicleUseStatus')" prop="useStatus" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column :label="$t('vgPower.terminalCode')" prop="terminalCode" :show-overflow-tooltip="true"></el-table-column>
    </el-table>
</cv-grid> 
参数说明:
options:  为必传对象 
{   current: 1,  -- 当前页数
    size: 10,   -- 当前页面的条数
    total: 0    -- 总条数
}

#图片选集组件
<photo-group @show-name="showIconName"></photo-group>
参数说明:
    @show-name: 一个方法第一个参数是获取的图片名字

#公共的工具条
<cv-tool
:data="$store.state['index'].power[$route.name]"
:is-modify="false"
:is-remove="false"
@add="add"
@search="search"></cv-tool>
参数说明:
    :data:   动态属性data---动态获取权限按钮
    :is-modify:  手动是否显示修改按钮
    :is-remove: 手动是否显示删除按钮
    :is-add:  手动是否显示添加按钮
    :is-search: 搜索按钮自动存在的. 手动是否显示搜索按钮
    @add:   添加按钮的事件
    @remove: ...上同

# 表格的工具条
<cv-table-tool 
:data="$store.state['index'].power[$route.name]"
@remove="remove(scope)"
@modify="modify(scope)"
:is-modify="false"
:is-remove="false"></cv-table-tool>
参数说明:
    :data:   动态属性data---动态获取权限按钮
    :is-modify:  手动是否显示修改按钮
    :is-remove: 手动是否显示删除按钮
    @remove, @modify  触发的事件

# span标签
<cv-span type="primary"></cv-span>
参数说明:
    type: primary.蓝色的span标签
    type: info
    type: danger
    type: warning

#sbDoc第三方接口库
老刘开车1212121