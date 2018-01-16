import ZtreeBase from '@/components/ztree/model/ztree.base'
import {service, http, COMMON} from '@/utils'
import car from './css/myStyle/img/car.png'
import unline from './css/myStyle/img/unline.png'
import vehilceGroup from './css/myStyle/img/group.png'
import company from './css/myStyle/img/company.png'
import shoucang from './css/myStyle/img/shoucang1.png'
// 默认配置参数
let _options = {
    // 是否显示多选框
    isCheck: true,
    // 树的后台请求地址
    url: ""
}

let _self = null,
    IDMark_Switch = "_switch",
    IDMark_Icon = "_ico",
    IDMark_Span = "_span",
    IDMark_Input = "_input",
    IDMark_Check = "_check",
    IDMark_Edit = "_edit",
    IDMark_Remove = "_remove",
    IDMark_Ul = "_ul",
    IDMark_A = "_a";

export default class ZtreeCar extends ZtreeBase{
    constructor(name, options){
        super(name);
        _self = this;
        // 树的名字
        this.data = [];
        // 树的数据存储
        this.allTreeData = [];
        // 树初始化标识
        this.ready = false;
        // 已存在车辆
        this.alreadyCar = [];
        // 事件标识别 -- expand和check
        this.eventName = null;
        this.poster = $('#' + this.name);
        // async的树节点
        this.asyncTreeNode = {};
        this.options = service.extend(_options, options);
        // 初始化
        //this.init();
        this.bindEvent();
    }
    // 树的初始化加载---走接口
    async init(){   
        const {data, flag} = await this.getTreeInitData();
        data.forEach(val => {
            val.open = true;
            _self.switchIcon(val);
        });
        flag && $.fn.zTree.init(this.poster, this.setting(this.options.isCheck), data);
        this.zTree = $.fn.zTree.getZTreeObj(this.name);
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
                showLine: false,
                addDiyDom: this.addDiyDom,
                fontCss: this.fontCss
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
                beforeAsync:this.beforeAsync,
                beforeExpand: this.beforeExpand,
                beforeCheck: this.beforeCheck,
                onAsyncSuccess: this.onAsyncSuccess,
                onCheck: this.onCheck,
                onClick: this.onClick
            } 
        } 
    }
    // 设置字体样式
    fontCss(treeId, treeNode){
        if(!!treeNode.highlight){
            return {color: 'red'}
        }else{
            return {color: '#333'}
        }
    }
    // 切换多选单选框
    switchCheck(flag){
        $.fn.zTree.init(_self.poster, _self.setting(flag), _self.getAllNodes());      
    }
    // 渲染树
    renderTree(nodes, flag = true){
        $.fn.zTree.init(_self.poster, _self.setting(flag), nodes);
        this.zTree = $.fn.zTree.getZTreeObj(this.name);
    }
    // 返回的节点数据处理-- 根据节点进行图标显示
    treeFilter(treeId, parentNode, {data, flag}){
        if(data && flag){
            data.forEach(val => {
                // 更改指定的图标
                if(val.id == _self.options.enterpriseId){
                   val.open = true;
                }
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
        //(data.sumCount >= this.options.limit) && (data.chkDisabled = true)
        switch(data.type){
            case 1: return data.icon = company;
            case 2: return data.icon = vehilceGroup;
            case 3: return data.online ? data.icon = car : data.icon = unline;
        }
    }
    // 添加历史轨迹按钮
    addDiyDom(treeId, treeNode){
        if(!treeNode) return;
        let container = $("#" + treeNode.tId);
        if(treeNode.type === 3){
            let data = {id: treeNode.id, plateCode: treeNode.text,alias:treeNode.alias,isAttention:treeNode.isAttention};
            let html='';
            treeNode.isAttention == 0 && (html = `<span class="shoucang bindEvents" id="icon_${treeNode.id}" data-options=${JSON.stringify(data)}></span>`);
            treeNode.isAttention == 1 && (html = `<span class="shoucang1 bindEvents" id="icon_${treeNode.id}" data-options=${JSON.stringify(data)}></span>`);
            container.append(html);
        }
    }
    bindEvent(){
        let shoucang = '.bindEvents';
        let _this=this;
        this.poster.on('click', shoucang, function(){
            let data = JSON.parse($(this).attr('data-options'));
            typeof _self.options.methods.shoucang === 'function' && _self.options.methods.shoucang(data);
        })
    }
    // 勾选取消相应的节点
    cancelNode(array){
        (array.length > 0) && array.forEach(id => {
            let treeNode = _self.zTree && _self.zTree.getNodeByParam('id', id);
            treeNode && _self.zTree.checkNode(treeNode, false);
        })
    }
    // 勾选对应的节点
    checkedNode(array){
        array && array.forEach(id => {
            let treeNode = _self.zTree && _self.zTree.getNodeByParam('id', id);
            treeNode && _self.zTree.checkNode(treeNode, true, true);
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
    // 更新车辆是否关注
    updateCheckedNodesIcon(node){
        let container = $("#" + node.vehicleId);
        let _data={
            id:node.vehicleId,
            plateCode:node.plateCode,
            isAttention:node.isAttention
        }
        if(node.isAttention=="0"){
            if($("#icon_" + node.vehicleId)[0]){
                $("#icon_" + node.vehicleId)[0].dataset.options=JSON.stringify(_data);
                $("#icon_" + node.vehicleId).removeClass('shoucang1');
                $("#icon_" + node.vehicleId).addClass('shoucang');
            }
        }else{
            if($("#icon_" + node.vehicleId)[0]){
                $("#icon_" + node.vehicleId)[0].dataset.options=JSON.stringify(_data);
                $("#icon_" + node.vehicleId).removeClass('shoucang');
                $("#icon_" + node.vehicleId).addClass('shoucang1');
            }
        }
    }
    beforeExpand(treeId, treeNode){
        this.eventName = 'expand';
    }
    expandOperation(treeNode){
        if(treeNode.isAjaxing === null){
            if(treeNode.checked){
                _self.zTree.expandNode(treeNode, false, false, false);
            }else{
                _self.zTree.expandNode(treeNode, true, false, false);
            }           
        }else{
            _self.zTree.expandNode(treeNode, true, true, false);
        }  
    }
    beforeAsync(treeId,treeNode){
        console.log(treeNode)
    }
    // 用于父节点勾选之前的事件回调
    beforeCheck(treeId, treeNode){
        this.eventName = 'check';
        _self.alreadyCar = _self.zTree.getCheckedNodes(true);
        if(treeNode.isAjaxing){           
            treeNode.checked = false;
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
        _self.expandOperation(treeNode);      
    }
    // 自动加载展开节点
    asyncNodes(nodes) {
        if(!nodes && service.isArray(nodes) && nodes.length > 0){
            return false;
        } else{
            nodes.forEach(node => {     
                if(!(node.isParent && node.zAsync)){
                    _self.expandOperation(node);        
                    _self.zTree.reAsyncChildNodes(node, 'refresh', true);
                }
            })
        }
       
    }
    // 异步返回成功回调
    onAsyncSuccess( event, treeId, treeNode, msg ){
        if(this.eventName === 'check' && treeNode){
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
        typeof _self.options.methods.nodeClick === 'function' 
        && _self.options.methods.nodeClick(treeNode);
    }
    // 返回异步加载的节点
    getVehicle(nodes){
        typeof this.options.methods.async === 'function' 
        && this.options.methods.async(nodes);
    }
    // 返回同步加载的节点
    getNodes(nodes, type){
        typeof this.options.methods.label === 'function' 
        && this.options.methods.label(nodes, type);
    }
    // 推送添加和删除车辆树上的数字更新
    addRemoveVehicleNum(opts, type){
        let treePids = opts.treePids.split(',');
        treePids.forEach(val => {
            let treeNode = _self.zTree && _self.zTree.getNodeByParam('id', val);
            if(treeNode){
                let text = treeNode.text.replace(/[(]\d+[)]/g, ""),
                    count = treeNode.sumCount + Number(type),
                    sumCount = (count < 0 ? 0 : count);
                treeNode.sumCount = sumCount;
                treeNode.text = text + '(' + sumCount + ')';
                _self.zTree.updateNode(treeNode);
            }
        })
    }
    // 推送添加公司或者车组
    addManageVehicleGroup(opts, type){
        let parentNode = _self.zTree && _self.zTree.getNodeByParam('id', opts.pid);
        if(parentNode && (parentNode.children || (typeof parentNode.children == 'undefined'))){
            _self.zTree.addNodes(parentNode, {
                children: [],
                pId: opts.pid,
                text: opts.name+'(0)',
                id: opts.id,
                type: type,
                icon: Number(type) === 1 ? company : vehilceGroup,
                sumCount: 0
            });
            // 添加重置数据
            $.fn.zTree.init(_self.poster, _self.setting(this.options.isCheck), _self.getAllNodes());
        }
    }
    // 推送删除公司或者车组
    removeManageVehicleGroup(opts){
        let currentNode = _self.zTree && _self.zTree.getNodeByParam('id', opts.id);
        currentNode && _self.zTree.removeNode(currentNode);
    }
    // 推送更新公司或者车组
    updateManageVehicleGroup(opts){
        let currentNode = _self.zTree && _self.zTree.getNodeByParam('id', opts.id); 
        if(currentNode){
            currentNode.text = opts.name;
            _self.zTree.updateNode(currentNode);
        }
    }
    // 添加或者删除车辆
    addRemoveVehicle(opts, type){
        switch(Number(type)){
            case 1: 
                // 添加车辆
                let parentNode = _self.zTree && _self.zTree.getNodeByParam('id', opts.fleetId);
                if(parentNode && parentNode.children){
                    _self.zTree.addNodes(parentNode, {
                        pId: opts.fleetId,
                        text: opts.plateCode,
                        id: opts.vehicleId,
                        type: 3,
                        icon: opts.online ? car : unline
                    }, false);
                }
            break;
            case -1: 
                // 删除车辆
                let removeNode = _self.zTree && _self.zTree.getNodeByParam('id', opts.vehicleId);
                removeNode && _self.zTree.removeNode(removeNode);
            break;
            case 0:
                // 更新
                let updateNode = _self.zTree && _self.zTree.getNodeByParam('id', opts.vehicleId);
                if(updateNode){
                    updateNode.text = opts.plateCode;
                    _self.zTree.updateNode(updateNode);
                }
            break;
        }
    }
}