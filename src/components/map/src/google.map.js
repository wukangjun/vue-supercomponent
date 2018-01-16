;
(function(win) {
    var MapApi = function(map) {
        console.log(map);
        this.map = map;
        _selfMap = map;
        _self = this;
    };
    var array = Array.prototype.slice;
    var toString = Object.prototype.toString;
    var hasOwn = Object.prototype.hasOwnProperty;
    var extend = function(c, p) {
            for (var i in p) {
                c[i] = p[i];
            }
            c.parent = p;
            return c;
        }
        /*
         * name: 地图私有方法
         */
    var _selfMap, _openDrawingManager, _rectangledrawendListener, _polygondrawendListener, _circledrawendListener, _linedrawendListener;
    var _map = {
        label: function(point, str, options) {
            var text,
                temp = {
                    position: point, // 指定文本标注所在的地理位置
                    offset: new BMap.Size(-20, 36) //设置文本偏移量
                };
            text = new BMap.Label(str, temp); // 创建文本标注对象
            text.setStyle(extend({
                color: "#666",
                fontSize: "12px",
                height: "24px",
                lineHeight: "24px",
                minWidth: "66px",
                fontFamily: "宋体",
                backgroundColor: "#f8f8f8",
                borderColor: "#dddbd5",
                boxShadow: "2px",
                textAlign: "center"
            }, options));
            return text;
        },
        openDrawingManager: function(options) {
            var styleOptions = {
                fillColor: '#ffff00',
                fillOpacity: 1,
                strokeWeight: 5,
                clickable: false,
                editable: true,
                zIndex: 1
            };
            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: null,
                //drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: false,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
                },
                markerOptions: { icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png' },
                circleOptions: styleOptions
            });
            //console.log(_selfMap);
            drawingManager.setMap(_selfMap);

            return drawingManager;
        },
        utils: {
            // 将{lng: "", lat: ""} 格式统一转换 {longitude: 116.404, latitude: 39.915}
            transferPointFormat: function(points) {

            },
            isArray: function(obj) {
                return toString.call(obj) === '[object Array]'
            },
            isFunction: function(obj) {
                return toString.call(obj) === '[object Function]'
            }
        }



    }

    /*
     * name: 地图暴露出去的方法
     */
    MapApi.prototype = {
        point: function(point) {
            var lat = point.latitude || point.lat,
                lng = point.longitude || point.lng;
            return new google.maps.LatLng(lat, lng);
        },
        pointObject: function(point) {
            return { lat: point.latitude || point.lat, lng: point.longitude || point.lng };
        },
        // 获得地图的覆盖类(overlay) ----  args[0](图标地址) args[1](图标大小)

        mapAddpoint: function(points, ...args) {
            var size, img, marker, point = this.point(points)
            if (args.length !== 0) {
                args[1] = undefined ? size = { width: 24, height: 24 } : size = args[1];
                img = {
                    url: args[0],
                    size: size,
                }
                marker = new google.maps.Marker({
                    icon: img,
                    position: point
                });
                marker.point = point;
                return marker;
            }
        },

        // 单个点居中
        moveToCenter: function(point) {
            args = array.call(arguments, 1);
            this.map.setCenter(this.point(point));
            if (args.length > 0) {
                this.map.setZoom(args[0]);
            }
        },

        // 从地图添加点(将marker添加到地图)
        addOverlay: function(overlay) {
            overlay.setMap(this.map);
        },

        // 从地图上移除点
        removeOverlay: function(overlay) {
            overlay.setMap(null);
        },
        // 清除地图所有点
        clearOverlays: function() {
            this.map.clearOverlays();
        },
        // 添加文字标注
        addLabel: function(marker, text, options = {}) {
            var label = new google.maps.MarkerLabel(extend({
                color: '#666',
                text: text
            }, options));
            //var label = _map.label(marker.point, text);
            marker.setLabel(label);
            return label;
        },
        //设置Markericon
        setIcon: function(marker, url, size) {
            marker.setIcon(new google.maps.Icon({
                img: url,
                size: size == undefined ? { width: 24, height: 24 } : size
            }));
        },
        getBestView: function(bounds) {
            var mapBounds = this.map.getBounds();
            mapBounds.extend(bounds.getNorthEast());
            mapBounds.extend(bounds.getSouthWest());
            console.log(bounds);
            console.log(mapBounds);
            // mapBounds.extend(bounds);
            this.map.fitBounds(mapBounds);
        },
        closeInfoWindow(infoWindow) {
            infoWindow.setMap(null);
        },
        //显示圆形
        mapAddcircle: function(point, options) {
            var circleOptions = {
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                center: this.point(point),
                radius: 100
            };
            circleOptions = extend(circleOptions, options);
            var Circle = new google.maps.Circle(circleOptions);
            this.map.setZoom(14);
            Circle.setMap(this.map);
            this.map.panTo(this.point(point));
            this.getBestView(Circle.getBounds().getNorthEast(), Circle.getBounds().getSouthWest());
            return Circle;
        },
        //显示矩形
        mapAddrectangle: function(point, options) {

        },
        //显示多边形
        mapAddpolygon: function(point, options) {
            var points = [];
            if (_map.utils.isArray(point)) {
                for (var i = 0, len = point.length; i < len; i++) {
                    points.push(this.point(point[i]));
                }
            }
            console.log("pintsArr", points);
            var polygonOptions = extend({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                paths: points
            }, options);
            var polygons = new google.maps.Polygon(polygonOptions);
            this.map.setZoom(14);
            this.map.panTo(points[0]);
            polygons.setMap(this.map);
            return polygons;
        },
        //显示路线
        mapAddline: function(point, options) {
            var points = [];
            if (_map.utils.isArray(point)) {
                for (var i = 0, len = point.length; i < len; i++) {
                    points.push(this.point(point[i]));
                }
            }
            var lineOptions = {

                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 6,
                path: points
            };
            var line = new google.maps.Polyline(extend(lineOptions, options));
            //line.setPath = points;
            line.setMap(this.map);
            this.map.setZoom(14);
            this.map.panTo(points[0]);
            //this.getBestView(line);
            return line;
        },
        //画圆
        onclickCircle: function(callback) {

            _openDrawingManager = null;
            _openDrawingManager = _map.openDrawingManager();
            //console.log(_openDrawingManager);
            _openDrawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
            //console.log(_openDrawingManager);

            (_circledrawendListener = _openDrawingManager.addListener('overlaycomplete', onCircleDrawend));

            function onCircleDrawend(circleOverlay) {
                var center = circleOverlay.overlay.getCenter();
                var options = {
                    overlay: circleOverlay.overlay,
                    center: { lng: center.lng(), lat: center.lat() },
                    radius: circleOverlay.overlay.getRadius()
                };
                _openDrawingManager.setDrawingMode(null);
                if (_map.utils.isFunction(callback)) {
                    callback(options);
                }
            }
        },
        // 画折线
        onclickLine: function(callback) {
            _openDrawingManager = null;
            _openDrawingManager = _map.openDrawingManager();
            _openDrawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
            (_linedrawendListener == null) &&
            (_linedrawendListener = _openDrawingManager.addListener('overlaycomplete', onLineDrawend));

            function onLineDrawend(lineOverlay) {
                var paths = lineOverlay.overlay.getPath();
                var array = paths.getArray();
                var points = [];
                for (var i = 0; i < array.length; i++) {
                    points.push({ lng: array[i].lng(), lat: array[i].lat() });
                }
                var options = {
                    points: points,
                    overlay: lineOverlay.overlay
                };
                console.log(options);
                _openDrawingManager.setDrawingMode(null);
                if (_map.utils.isFunction(callback)) {
                    callback(options);
                }
            }
        },
        // 画多边形
        onclickPolygon: function(callback) {
            _openDrawingManager = null;
            _openDrawingManager = _map.openDrawingManager();
            _openDrawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
            (_polygondrawendListener == null) &&
            (_polygondrawendListener = _openDrawingManager.addListener('overlaycomplete', onPolygonDrawend));

            function onPolygonDrawend(polygonOverlay) {
                var paths = polygonOverlay.overlay.getPath();
                var array = paths.getArray();
                var potins = [];
                for (var i = 0; i < array.length; i++) {
                    potins.push({ lng: array[i].lng(), lat: array[i].lat() });
                }
                var options = {
                    overlay: polygonOverlay.overlay,
                    points: potins
                };
                console.log(options);
                _openDrawingManager.setDrawingMode(null);
                if (_map.utils.isFunction(callback)) {
                    callback(options);
                }
            }
        },
        // 画矩形
        onclickRectangle: function(callback) {
            _openDrawingManager = null;
            _openDrawingManager = _map.openDrawingManager();
            _openDrawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
            (_rectangledrawendListener == null) &&
            (_rectangledrawendListener = _openDrawingManager.addListener('overlaycomplete', onRectangleDrawend));

            function onRectangleDrawend(rectangleOverlay) {

                var bounds = rectangleOverlay.overlay.getBounds();
                var params = {
                    minLng: bounds.getSouthWest().lng(),
                    minLat: bounds.getSouthWest().lat(),
                    maxLng: bounds.getNorthEast().lng(),
                    maxLat: bounds.getNorthEast().lat()
                };
                var options = {
                    params: params,
                    overlay: rectangleOverlay.overlay
                };
                _openDrawingManager.setDrawingMode(null);
                if (_map.utils.isFunction(callback)) {
                    callback(options);
                }
            }
        },
        // 画点
        onclickPoint: function(callback) {
            _openDrawingManager = null;
            _openDrawingManager = _map.openDrawingManager();
            _openDrawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
            (_rectangledrawendListener == null) &&
            (_rectangledrawendListener = _openDrawingManager.addListener('overlaycomplete', onMarkerDrawend));

            function onMarkerDrawend(markerOverlay) {
                var options = {};
                var point = markerOverlay.overlay.getPosition()
                options.points = { lng: point.lng(), lat: point.lat() }
                console.log(options);
                _openDrawingManager.setDrawingMode(null);
                if (_map.utils.isFunction(callback)) {
                    callback(options);
                }
            }

        },
        //打开信息窗
        openInfoWindow(content, options, point) {
            console.log("信息窗", content, options, point);
            var infowindow = new google.maps.InfoWindow({
                content: content,
                position: point
            });
            infowindow.open(this.map);
            return infowindow;
        },
        //点击覆盖物打开弹窗
        overlayClickOpenInfoWindow(overlay, point, content, callback, options) {
            overlay.addListener('click', function() {
                var infoWindow = _self.openInfoWindow(content, options, point);
                callback(infoWindow);
            });
        },
        //是否开启编辑
        overlayEdit: function(overlay, flag) {
            overlay.setEditable(flag);
        },
        //获取圆形的数据
        getCircleOptions(overlay) {
            var center = overlay.getCenter();
            var options = {
                overlay: overlay,
                center: { lng: center.lng(), lat: center.lat() },
                radius: overlay.getRadius()
            };
            return options;
        },
        //获取多边形数据
        getPolygonOptions(overlay) {
            var paths = overlay.getPath();
            var array = paths.getArray();
            var potins = [];
            for (var i = 0; i < array.length; i++) {
                potins.push({ lng: array[i].lng(), lat: array[i].lat() });
            }
            var options = {
                overlay: overlay,
                points: potins
            };
            return options;
        },
        //获取折线的数据
        getLineOptions(overlay) {
            var paths = overlay.getPath();
            var array = paths.getArray();
            var points = [];
            for (var i = 0; i < array.length; i++) {
                points.push({ lng: array[i].lng(), lat: array[i].lat() });
            }
            var options = {
                points: points,
                overlay: overlay
            };
            return options;
        }
    }
    window.MapApi = MapApi;
    module.exports = MapApi;
})(window)