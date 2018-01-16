
(function (win) {
    var array = Array.prototype.slice;
    var toString = Object.prototype.toString;
    var hasOwn = Object.prototype.hasOwnProperty;

    // 浅拷贝
    var extend = function (c, p) {
        for (var i in p) { c[i] = p[i]; }
        c.parent = p;
        return c;
    }
    //定义一些常量
    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    /*
     * name: 地图私有方法
     */
    var _selfMap, _openDrawingManager, _self,_listenerObj,
        _rectangledrawendListener, _polygondrawendListener, _circledrawendListener, _linedrawendListener;
    var _map = {
        utils: {
            isArray: function (obj) {
                return toString.call(obj) === '[object Array]'
            },
            isFunction: function (obj) {
                return toString.call(obj) === '[object Function]'
            },
            out_of_china: function(lng, lat){
                return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
            },
            transformlat: function(lng, lat){
                var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
                ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
                ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
                return ret
            },
            transformlng: function(lng, lat){
                var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
                ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
                ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
                return ret
            }
        }
    }

    var MapApi = function (map) {
        this.map = map;
        _selfMap = map;
        _self = this;
        this.map.plugin(['AMap.MarkerClusterer'], () => {
            this.MarkerClusterer = new AMap.MarkerClusterer(this.map, [], {
                maxZoom: 15
            });
        });
        this.map.plugin(['AMap.MouseTool'], () => {
            this.MouseTool = new AMap.MouseTool(this.map); 
        })
    };

    /*
     * name: 地图暴露出去的方法
     */
    MapApi.prototype = {
        // 原始----》高德
        transformPoints(lng, lat){
            if(_map.utils.out_of_china(lng, lat)){
                return {lng: lng, lat: lat};
            }else{
                var dlat = _map.utils.transformlat(lng - 105.0, lat - 35.0);
                var dlng = _map.utils.transformlng(lng - 105.0, lat - 35.0);
                var radlat = lat / 180.0 * PI;
                var magic = Math.sin(radlat);
                magic = 1 - ee * magic * magic;
                var sqrtmagic = Math.sqrt(magic);
                dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
                dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
                var mglat = lat + dlat;
                var mglng = lng + dlng;
                return {lng: mglng, lat: mglat};
            }
        },
        setCity: function(string){
            return _self.map.setCity(string);
        },
        // 获得点的地图对象 -- 格式: {longitude: 116.404, latitude: 39.915}
        point: function (point) {
            return new AMap.LngLat(point.longitude || point.lng || 0, point.latitude || point.lat || 0);
        },
        // 设置地图点的图标
        setIcon: function (url, width, height) {
            return new AMap.Icon({
                image: url,
                size: new AMap.Size(width, height)
            })
        },
        // 获得几个点的最佳视野 [marker, marker ...]
        getBestView: function (views) {
            if (toString.call(views) === '[object Array]' && views.length!=0) {
                this.map.setFitView(views[0].point ? views : []);
            } else {
                this.map.setFitView();
            }
        },
        // 获得地图的覆盖类(overlay) ----  args[0](图标地址) args[1](图标大小)
        mapAddpoint: function (points, ...args) {         
            var size, img, marker, point = this.point(points);
            if (args.length !== 0) {
                args[1] = undefined ? size = { width: 24, height: 24 } : size = args[1];
                marker = new AMap.Marker({
                    map: _self.map,
                    offset:new AMap.Pixel(-16,-16),
                    position: point,
                    topWhenClick: true,
                    icon: args[0]
                });
                marker.point = point;
                return marker;
            }
        },
        // 单个点居中
        moveToCenter: function (point, zoom) {
            var minSize = this.map.getZoom(), size,_point;
            point[0] ? _point=point[0] : _point=point;
            if (arguments.length === 2) {
                size = Math.max(minSize, zoom);
                this.map.setZoomAndCenter(size, _point);
            } else {
                this.map.setZoomAndCenter(minSize, _point);
            }
        },
        //本地搜索区域
        Geocoder: function (location) { 
            AMap.service(["AMap.PlaceSearch"], function() {
                var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                    map: _selfMap
                });
                placeSearch.search(location,function(state,result){
                    _self.clearOverlays();
                });
            });
        },
        // 地图中心点平移至指定点位置
        mapPanTo: function (point) {
            this.map.panTo(point);
        },
        // 从地图添加点(将marker添加到地图)
        addOverlay: function (overlay) {
            var array = [];
            array.push(overlay);
            _self.map.add(array);
        },
        // 从地图上移除覆盖物(overlayers:Array)
        removeOverlay: function (overlay) {
            if(overlay){
                var array = [];
                array.push(overlay);
                this.map.remove(array);
            }
        },
        // 清除地图所有点
        clearOverlays: function () {
            this.map.clearMap();
        },
        // 添加文字标注
        addLabel: function (marker, text, options = {}) {
            marker.setLabel({
                offset: new AMap.Pixel(20, 20),
                content: `<div style=padding:2px;>${text}</div>`
            })
            return {
                setStyle(opts){
                    marker.setLabel({
                        offset: new AMap.Pixel(20, 20),
                        content: `<div style=padding:2px;background:${opts.backgroundColor};color:${opts.color}>${text}</div>`
                    })
                }
            }
            
        },
        //显示圆形 -- 自带显示最佳视野
        mapAddcircle: function (point, radius, options) {
            var pt = this.point(point),
                options = options || {};
            var mapOptions = {
                map: _self.map,
                center: pt,
                radius: parseFloat(radius),
                strokeColor: '#20a0ff',
                fillColor: '#fff',
                fillOpacity: 0.5,
                strokeWeight: 2,
                strokeOpacity: 0.5
            };
            var marker = new AMap.Circle(extend(mapOptions, options));
            // _self.map.setZoomAndCenter(10, marker.getCenter());
            _self.getBestView();
            return marker;
        },
        //显示矩形 -- {minLng: "", minLat: "", maxLng: "", maxLat: ""}
        mapAddrectangle: function (rectangle, options) {
            for (var i in rectangle) {
                if (i == 'minLng' || i == 'minLat' || i == 'maxLng' || i == 'maxLat') {
                    //...
                } else {
                    throw new Error('correct format: {minLng: "", minLat: "", maxLng: "", maxLat: ""}')
                }
            }       
            var leftBottom = this.point({lng: rectangle.minLng, lat: rectangle.maxLat}),
                rightTop = this.point({lng: rectangle.maxLng, lat:rectangle.minLat}),
                bounds = new AMap.Bounds(leftBottom, rightTop);
            var defs = {
                map: _self.map,
                bounds: bounds,
                fillColor: '#fff',
                fillOpacity: 0.5,
                strokeColor: '#20a0ff',
                strokeWeight: 2,
                strokeOpacity: 1
            };
            var marker = new AMap.Rectangle(extend(defs, options));  
            _self.getBestView();         
            // _self.map.setZoomAndCenter(12, marker.getBounds().getCenter());
            return marker;
        },
        //显示多边形
        mapAddpolygon: function (point, options) {
            var points = [];
            if (_map.utils.isArray(point)) {
                for (var i = 0, len = point.length; i < len; i++) {
                    points.push(this.point(point[i]))
                }
                var defs = {
                    map: _self.map,
                    path: points,
                    fillColor: '#fff',
                    fillOpacity: 0.5,
                    strokeColor: "blue",
                    strokeWeight: 2,
                    strokeOpacity: 0.5
                };
                var marker = new AMap.Polygon(extend(defs, options));
                _self.getBestView();
                // _self.map.setZoomAndCenter(12, marker.getBounds().getCenter());
                return marker;
            }
        },
        //显示路线--折现
        mapAddline: function (point, options) {
            var points = [];
            if (_map.utils.isArray(point)) {
                for (var i = 0, len = point.length; i < len; i++) {
                    points.push(this.point(point[i]))
                }
                var defs = {
                    map: _self.map,
                    path: points,
                    // fillColor: '#92bbed',
                    // fillOpacity: 0.5,
                    strokeColor: "#5298ff",
                    strokeWeight: 6,
                    strokeOpacity: 1
                };
                var marker = new AMap.Polyline(extend(defs, options));
                _self.getBestView();
                // _self.map.setCenter(marker.getBounds().getCenter());
                return marker;
            }
        },
        //画圆
        onclickCircle: function (callback) {
            _self.addEventListener(_self.MouseTool, 'draw', fn)
            function fn(e){
                _self.MouseTool.close(false);
                var obj = e.obj;
                var options = {
                    point: obj.getBounds(),
                    overlay: obj,
                    center: obj.getCenter(),
                    radius: obj.getRadius()
                }
                if (_map.utils.isFunction(callback)) {
                    callback(options);
                }
                _self.removeEventListener(_self.MouseTool,'draw',fn);
            }
            _self.MouseTool.circle({
                map: _self.map
            })
        },
        // 画折线
        onclickLine: function (callback) {
            _self.addEventListener(_self.MouseTool, 'draw',fn )
            function fn(e){
                _self.MouseTool.close(false);
                var obj = e.obj;
                var options = {
                    point: obj.getBounds(),
                    overlay: obj
                }
                if (_map.utils.isFunction(callback)) {
                    callback(options);
                }
                _self.removeEventListener(_self.MouseTool,'draw',fn);
            }
            _self.MouseTool.polyline({
                map: _self.map
            })
        },
        // 画多边形
        onclickPolygon: function (callback) {
            _self.addEventListener(_self.MouseTool, 'draw', fn);
            function fn(e){
                _self.MouseTool.close(false);
                var obj = e.obj;
                var options = {
                    point: obj.getBounds(),
                    overlay: obj
                }
                if (_map.utils.isFunction(callback)) {
                    callback(options);
                }
                _self.removeEventListener(_self.MouseTool,'draw',fn);
            }
            _self.MouseTool.polygon({
                map: _self.map
            });
        },
        // 画矩形
        onclickRectangle: function (callback) {
            _selfMap.setDefaultCursor("crosshair");
            _self.addEventListener(_self.MouseTool, 'draw',fn);
            function fn(e){
                _self.MouseTool.close(false);
                var obj = e.obj;
                var bounds = obj.getBounds();
                var options = {
                    point: bounds,
                    overlay: obj,
                    params: {
                        minLng: bounds.southwest.lng,
                        minLat: bounds.southwest.lat,
                        maxLng: bounds.northeast.lng,
                        maxLat: bounds.northeast.lat
                    }
                }
                if (_map.utils.isFunction(callback)) {
                    callback(options);
                }
                _self.removeEventListener(_self.MouseTool,'draw',fn);
                _selfMap.setDefaultCursor("pointer");
            }
            _self.MouseTool.rectangle({
                map: _self.map
            })
        },
        // 创建信息窗口对象 
        infoWindow: function (content, options,clb) {
            var defs = {
                isCustom: clb ? true : false, 
                autoMove: true,
                content:clb ? _self.createInfoWindow(content,clb) : content
            };
            clb && (defs.offset=new AMap.Pixel(10, -20));
            return new AMap.InfoWindow(extend(defs, options));
        },
        createInfoWindow:function(content,clb){
            var info = document.createElement("div");
            info.className = "info";
            var top = document.createElement("div");
            var titleD = document.createElement("div");
            var closeX = document.createElement("img");
            top.className = "info-top";
            closeX.src = "http://webapi.amap.com/images/close2.gif";
            closeX.onclick =clb;
            top.appendChild(titleD);
            top.appendChild(closeX);
            info.appendChild(top);
            // 定义中部内容
            var middle = document.createElement("div");
            middle.className = "info-middle";
            middle.style.backgroundColor = 'white';
            middle.innerHTML = content;
            info.appendChild(middle);
            // 定义底部内容
            var bottom = document.createElement("div");
            bottom.className = "info-bottom";
            bottom.style.position = 'relative';
            bottom.style.top = '0px';
            bottom.style.margin = '0 auto';
            var sharp = document.createElement("img");
            sharp.src = "http://webapi.amap.com/images/sharp.png";
            bottom.appendChild(sharp);
            info.appendChild(bottom);
            return info;
        },
        // 打开信息窗口
        openInfoWindow: function (content, options, point) {
            var infoWindow = _self.infoWindow(content, options);
            infoWindow.open(_self.map, point);
            return infoWindow;
        },
        cvOpenInfoWindow: function (infoWindow, point) {
            infoWindow.open(_self.map, point);
        },
        closeInfoWindow: function (infoWindow) {
            _self.map.clearInfoWindow();
        },
        //点击覆盖物打开弹窗
        overlayClickOpenInfoWindow(overlay, point, content, callback, options) {
            _self.addEventListener(overlay, 'click', function(){
                var infoWindow = _self.openInfoWindow(content, options, point);
                if (_map.utils.isFunction(callback)) {
                    callback(infoWindow);
                }
            })
        },
        // 路书功能
        lushu: function (points, content, speed, icon, landmarkPois, num) {
            let img = this.setIcon(icon, 32, 32);
            if (arguments.length == 6) {
                return new BMapLib.LuShu(_self.map, points, {
                    defaultContent: content,
                    speed: speed,
                    autoView: true,
                    icon: img,
                    enableRotation: true,
                    landmarkPois: landmarkPois
                }, num)
            } else {
                throw new Error('map,content,speed,icon,landmarkPois must be')
            }
        },
        //是否开启编辑
        overlayEdit: function (overlay, flag) {
            var nameArray = overlay.CLASS_NAME.split('.'),
                name = nameArray[nameArray.length - 1];
            if(name == 'Circle'){
                 name += 'Editor';
            }else{
                name = 'PolyEditor'
            }
            _self.map.plugin(["AMap."+name], function(){
                var edit = new AMap[name](_self.map, overlay);
                flag ? edit.open() : edit.close();
            })
        },
        // 改变图标
        setPointIcon: function(marker, icon){
            marker.setIcon(icon);
            return marker;
        },
        //marker点移动
        setPosition: function (marker, pointObj) {
            marker.setPosition(pointObj);
            return marker;
        },
        // 点改变方向
        setRotation: function (marker, direction) {
            marker.setAngle(direction);
            return marker;
        },
        //获取圆形的数据
        getCircleOptions(overlay) {
            var options = {
                points: overlay.getBounds(),
                overlay: overlay,
                center: overlay.getCenter(),
                radius: overlay.getRadius()
            };
            return options;
        },
        //获取多边形数据
        getPolygonOptions(overlay) {
            var options = {
                points: overlay.getPath(),
                overlay: overlay
            };
            return options;
        },
        getLineOptions(overlay) {
            var options = {
                points: overlay.getPath(),
                overlay: overlay
            };
            return options;
        },
        // 拉框放大
        rectangleZoom(options){
            _self.addEventListener(_self.map, 'zoomchange', function(e){
                _self.MouseTool.close(false);
            })
            _self.MouseTool.rectZoomIn();
            return {
                open(){
                    return null;
                }
            }
        },
        // 测距工具
        distanceTool(options={}){
            var ruler1;
            _self.map.plugin(["AMap.RangingTool"], function(){
                ruler1 = new AMap.RangingTool(_self.map, {
                    startMarkerOptions: {icon: options.secIcon}, 
                    endMarkerOptions: {icon: options.secIcon}
                });
                AMap.event.addListener(ruler1, "end", function(e) {
                    ruler1.turnOff();
                });
            });
            return {
                open(){
                    ruler1.turnOn();
                }
            }
        },
        /**
         * 聚合方法 添加， 删除
         * @params {Array} markers: 多个或单个覆盖物数组
         */
        markerClustererAddMarkers: function(markers){
            return _self.MarkerClusterer.addMarkers(markers);
        },
        markerClustererremoveMarkers: function(markers){
            return _self.MarkerClusterer.removeMarker(markers);
        },
        markerClustererClearAll: function(){
            return _self.MarkerClusterer.clearMarkers();
        },
        /**
         * 各种事件的封装
         */
        addEventListener: function(target, eventName, handler){
            // 兼容百度的， 百度有clickclose ，高德没有(只有close)
            if(eventName == 'clickclose'){
                eventName = 'close'
            }
            target.on(eventName, handler);
        },
        removeEventListener: function(target, eventName, handler){
            if(eventName == 'clickclose'){
                eventName = 'close'
            }
            target.off(eventName, handler);
        },
        /**
         * WGS84 -> GCJ02
         * @params {init} wgLat: 纬度 wgLon: 经度
         */
        transform: function(wgLat, wgLon){
            var a = 6378245.0;
            var ee = 0.00669342162296594323;

            if (outOfChina(wgLat, wgLon)) {
                return {lat: wglat, lng: wgLon};
            }
            var dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
            var dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
            var radLat = wgLat / 180.0 * Math.PI;
            var magic = Math.sin(radLat);
            var magic = 1 - ee * magic * magic;
            var sqrtMagic = Math.sqrt(magic);
            dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
            dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
            var mgLat = wgLat + dLat;
            var mgLon = wgLon + dLon;

            return {lat: mgLat, lng: mgLon};
            // 是否在国内
            function outOfChina(lat, lon){
                if (lon < 72.004 || lon > 137.8347)
                    return true;
                if (lat < 0.8293 || lat > 55.8271)
                    return true;
                return false;
            }
            function transformLat(x, y){
                var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
                ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
                ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;

                return ret;
            }
            function transformLon(x, y){
                var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
                ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
                ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;

                return ret;
            }
        }
    }
    module.exports = MapApi;
})(window)