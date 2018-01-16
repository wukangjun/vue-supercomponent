import './css/zTreeStyle/zTreeStyle.css'
import './css/myStyle/myStyle.css'
import './jquery.ztree.core.js'
import './jquery.ztree.excheck.js'
import './jquery.ztree.exedit.js'
import {service, http, COMMON} from '@/utils'
import car from './css/myStyle/img/car.png'
import unline from './css/myStyle/img/unline.png'
import vehilceGroup from './css/myStyle/img/group.png'
import company from './css/myStyle/img/company.png'
// 默认配置参数
let _options = {
    // 是否显示多选框
    isCheck: true,
    // 树的后台请求地址
    url: "",
    limit:200
}

let _self = null;

export default class PublicCar{
    constructor(name, options){
        _self = this;
        // 树的名字
        this.name = name;
        this.data = [];
        //
        this.alreadyCar = [];
        // 事件标识别 -- expand和check
        this.eventName = null;
        this.poster = $('#' + this.name);
        // async的树节点
        this.asyncTreeNode = {};
        this.options = service.extend(_options, options);
        // 初始化
        //this.init();
    }
    // 树的初始化加载
    async init(){   
        const {data, flag} = await this.getTreeInitData();
        data.forEach(val => {
            val.open = true;
            _self.switchIcon(val);
        });
        if(flag){
            $.fn.zTree.init(this.poster, this.setting(this.options.isCheck), data);
        }
        this.zTree = $.fn.zTree.getZTreeObj(this.name);
        return Promise.resolve(data);
    }
    // 获得初始化数据的接口
    getTreeInitData(params){
        return http({
            url: this.options.url,
            params: params
        })
    }
    // 树的基本设置
    setting(flag){    
        return {
            data: {
                key: {name: 'text'},
                simpleData: { enable: true }
            },
            check: {
                enable: flag,
                nocheckInherit: true,
                chkStyle: "checkbox",
                chkboxType: { "Y": "ps", "N": "ps" }
            },
            view: {
                selectedMulti: true,
                showLine: false
            },
            async: {
                enable: true,
                url: this.options.url,
                autoParam: ['id', "type=type"],
                otherParam: { 'token': localStorage.getItem('token') },
                dataFilter: this.treeFilter,
                type: "post"
            },
            callback: {
                beforeExpand: this.beforeExpand,
                beforeCheck: this.beforeCheck,
                onAsyncSuccess: this.onAsyncSuccess,
                onCheck: this.onCheck,
                onClick: this.onClick
            } 
        } 
    }
    // 切换多选单选框
    switchCheck(flag){
        let asyncNodes = _self.zTree && _self.zTree.getNodes();
        $.fn.zTree.init(_self.poster, _self.setting(flag), asyncNodes);      
    }
    // 返回的节点数据处理-- 根据节点进行图标显示
    treeFilter(treeId, parentNode, {data, flag}){
        if(data && flag){
            data.forEach(val => {
                // 更改指定的图标
                _self.switchIcon(val);
                if(_self.data.indexOf(val.id) !== -1){
                    setTimeout(_=>{
                        let treeNode = _self.zTree.getNodeByParam('id', val.id);
                        treeNode && _self.zTree.checkNode(treeNode, true, true);
                    }, 5);
                }
            });
        }
        return data;
    }
    // 根据返回的type类型过滤相应的图标(这部分属于页面逻辑，以后会抽出来) 1-公司 2-车组 3-车辆
    switchIcon(data){
        //(data.sumCount >= 200) && (data.chkDisabled = true)
        switch(data.type){
            case 1: return data.icon = company;
            case 2: return data.icon = vehilceGroup;
            case 3: return data.online ? data.icon = car : data.icon = unline;
        }
    }
    // 取消节点的选中状态
    cancelAllNodes(){
        _self.zTree && _self.zTree.checkAllNodes(false);
    }
    // 勾选取消相应的节点
    cancelNode(array){
        (array.length>0) && array.forEach(id => {
            let treeNode = _self.zTree.getNodeByParam('id', id);
            treeNode && _self.zTree.checkNode(treeNode, false);
        })
    }
    // 勾选对应的节点
    checkedNode(array){
        (array.length>0) && array.forEach(id => {
            let treeNode = _self.zTree.getNodeByParam('id', id);
            treeNode && _self.zTree.checkNode(treeNode, true, true);
        })
    }
    beforeExpand(treeId, treeNode){
        this.eventName = 'expand';
    }
    // 用于父节点勾选之前的事件回调
    beforeCheck(treeId, treeNode){
        this.eventName = 'check';
        _self.alreadyCar = _self.zTree.getCheckedNodes(true);
        if(treeNode.isAjaxing){           
            treeNode.chkDisabled = false;
            _self.zTree.updateNode(treeNode);
            return treeNode.doCheck = false;
        }else if(treeNode.checked == false && treeNode.sumCount > _self.options.limit){
            treeNode.checked = false;
            _self.zTree.updateNode(treeNode);
            typeof _self.options.methods.disabled === 'function' && _self.options.methods.disabled();
            return treeNode.doCheck = false;
        }else if(treeNode.isAjaxing === false){
            _self.asyncTreeNode[treeNode.id] = treeNode;
        }
        _self.zTree.expandNode(treeNode, true, true, false);
    }
    // 自动加载展开节点
    asyncNodes(nodes) {
        if (!nodes) return;
        nodes.forEach(node => {     
            if(!(node.isParent && node.zAsync)){
                _self.zTree.expandNode(node, true, true, false);        
                _self.zTree.reAsyncChildNodes(node, 'refresh', true);
            }
        })
    }
     // 更新勾选对应的节点信息
     updateCheckedNodes(node){
        let treeNode = (_self.zTree &&_self.zTree.getNodeByParam('id', node.vehicleId));
        if(treeNode){
            (node.messageText) == '上线' ? treeNode.icon = car : treeNode.icon = unline;
            _self.zTree.updateNode(treeNode);
        }
    }
    // 异步返回成功回调
    onAsyncSuccess( event, treeId, treeNode, msg ){
        if(this.eventName === 'check'){
            _self.getVehicle(treeNode.children);
            treeNode.children.forEach(node => {
                _self.zTree.checkNode(node, true, true,true);
                node.children==null && (node.children=[]);
                _self.asyncNodes(node.children);  
            })         
            _self.asyncNodes(treeNode.children);        
        }
    }
    // checkbox点击选择
    onCheck(event, treeId, treeNode){
        if(!treeNode.isAjaxing){
            let allNodes = _self.zTree.getCheckedNodes(true);
            let result = service.addRemoveUnique(allNodes, _self.alreadyCar, 'id');
            if(result.name == 'add'){
                _self.getNodes(result.data, 'add');
            }else if(result.name == 'remove'){
                _self.getNodes(result.data, 'remove');
            }
        }
        treeNode.children==null && (treeNode.children=[]);
        treeNode.checked && _self.asyncNodes(treeNode.children);            
    }
    // 节点点击事件
    onClick(event, treeId, treeNode){
        typeof _self.options.methods.nodeClick === 'function' && _self.options.methods.nodeClick(treeNode);
    }
    // 返回异步加载的节点
    getVehicle(nodes){
        typeof this.options.methods.async === 'function' && this.options.methods.async(nodes);
    }
    // 返回同步加载的节点
    getNodes(nodes, type){
        typeof this.options.methods.label === 'function' && this.options.methods.label(nodes, type);
    }
}