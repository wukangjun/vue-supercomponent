/**
 * @fileoverview 鐧惧害鍦板浘鐨勬媺妗嗙缉鏀剧被锛屽澶栧紑鏀俱€�
 * 鍏佽鐢ㄦ埛鍦ㄥ湴鍥句笂鎵ц鎷夋鏀惧ぇ鎴栬€呯缉灏忔搷浣滐紝
 * 浣跨敤鑰呭彲浠ヨ嚜瀹氫箟缂╂斁鏃剁殑鍔ㄧ敾銆侀伄鐩栧眰鐨勬牱寮忕瓑鏁堟灉銆�
 * 涓诲叆鍙ｇ被鏄�<a href="symbols/BMapLib.RectangleZoom.html">RectangleZoom</a>锛�
 * 鍩轰簬Baidu Map API 1.2銆�
 *
 * @author Baidu Map Api Group 
 * @version 1.2
 */

/** 
 * @namespace BMap鐨勬墍鏈塴ibrary绫诲潎鏀惧湪BMapLib鍛藉悕绌洪棿涓�
 */
var BMapLib = window.BMapLib = BMapLib || {};

(function() {
    /**
     * BMAP_ZOOM_IN 鎷夋鍚庢墽琛屾斁澶ф搷浣�
     * @type {int}
     */
    var BMAP_ZOOM_IN  = 0;

    /**
     * BMAP_ZOOM_OUT 鎷夋鍚庢墽琛岀缉灏忔搷浣�
     * @type {int}
     */
    var BMAP_ZOOM_OUT = 1;

    /** 
     * @exports RectangleZoom as BMapLib.RectangleZoom 
     */
    var RectangleZoom =
        /**
         * RectangleZoom绫荤殑鏋勯€犲嚱鏁�
         * @class 鎷夋缂╂斁绫伙紝瀹炵幇鎷夋缂╂斁鏁堟灉鐨�<b>鍏ュ彛</b>銆�
         * 瀹炰緥鍖栬绫诲悗锛屽嵆鍙皟鐢ㄨ绫绘彁渚涚殑open
         * 鏂规硶寮€鍚媺妗嗙缉鏀剧姸鎬併€�
         * 
         * @constructor
         * @param {Map} map Baidu map鐨勫疄渚嬪璞�
         * @param {Json Object} opts 鍙€夌殑杈撳叆鍙傛暟锛岄潪蹇呭～椤广€傚彲杈撳叆閫夐」鍖呮嫭锛�<br />
         * {"<b>zoomType</b>" : {Number} 鎷夋鍚庢斁澶ц繕鏄缉灏忕殑璁剧疆,
         * <br />"<b>followText</b>" : {String} 寮€鍚媺妗嗙缉鏀剧姸鎬佸悗锛岄紶鏍囪窡闅忕殑鏂囧瓧,
         * <br />"<b>strokeWeight</b>" : {Number} 閬洊灞傚妗嗙殑绾垮,
         * <br />"<b>strokeColor</b>" : {String} 閬洊灞傚妗嗙殑棰滆壊,
         * <br />"<b>style</b>" : {String} 閬洊灞傚妗嗙殑鏍峰紡,
         * <br />"<b>opacity</b>" : {Number} 閬洊灞傜殑閫忔槑搴�,
         * <br />"<b>cursor</b>" : {String} 榧犳爣鏍峰紡,
         * <br />"<b>autoClose</b>" : {Boolean} 鏄惁鍦ㄦ瘡娆℃搷浣滃悗锛岃嚜鍔ㄥ叧闂媺妗嗙缉鏀剧姸鎬亇
         *
         * @example <b>鍙傝€冪ず渚嬶細</b><br />
         * var map = new BMap.Map("container");<br />map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);<br />var myRectangleZoomObject = new BMapLib.RectangleZoom(map, {strokeWeight : 2});
         */
        BMapLib.RectangleZoom = function(map, opts){
            if (!map) {
                return;
            }

            /**
             * map瀵硅薄
             * @private
             * @type {Map}
             */
            this._map = map;

            /**
             * 鍚勭鐘舵€佺殑榛樿鍙傛暟
             * @private
             * @param {Json Object} 
             */
            this._opts = {
                // 鎷夋鍚庢斁澶ц繕鏄缉灏忕殑璁剧疆
                zoomType : BMAP_ZOOM_IN,
                // 寮€鍚媺妗嗙缉鏀剧姸鎬佸悗锛岄紶鏍囪窡闅忕殑鏂囧瓧
                followText : "",
                // 閬洊灞傚妗嗙殑绾垮
                strokeWeight : 2,
                // 閬洊灞傚妗嗙殑棰滆壊
                strokeColor : "#111",
                // 閬洊灞傚妗嗙殑鏍峰紡
                style : "solid",
                // 閬洊灞傜殑濉厖鑹�
                fillColor : "#ccc",
                // 閬洊灞傜殑閫忔槑搴�
                opacity : 0.4,
                // 榧犳爣鏍峰紡
                cursor : "crosshair",
                // 鏄惁鍦ㄦ瘡娆℃搷浣滃悗锛岃嚜鍔ㄥ叧闂媺妗嗙缉鏀剧姸鎬�
                autoClose : false
            };
            
            // 閫氳繃浣跨敤鑰呰緭鍏ョ殑opts锛屼慨鏀硅繖浜涢粯璁ゅ弬鏁�
            this._setOptions(opts);

            // 楠岃瘉鍙傛暟姝ｇ‘鎬�
            this._opts.strokeWeight = 
                this._opts.strokeWeight <= 0 ? 
                    1 : 
                    this._opts.strokeWeight;

            this._opts.opacity = 
                this._opts.opacity < 0 ? 
                    0 : 
                    this._opts.opacity > 1 ? 
                        1 : 
                        this._opts.opacity;

            if (this._opts.zoomType < BMAP_ZOOM_IN || 
                this._opts.zoomType > BMAP_ZOOM_OUT) {
                    this._opts.zoomType = BMAP_ZOOM_IN;
            }

            /**
             * 褰撳墠鏄惁寮€鍚媺妗嗙缉鏀剧姸鎬侊紱榛樿涓篺alse锛岃〃绀烘病鏈夊紑鍚�
             * @private
             * @type {Boolean} 
             */
            this._isOpen = false;

            /**
             * 鎷夋鏃舵樉绀虹殑鐭╁舰閬洊灞�
             * @private
             * @type {HTMLElement}
             */
            this._fDiv = null;

            /**
             * 榧犳爣璺熼殢鐨勬枃瀛楁彁绀烘
             * @private
             * @type {BMap.Label}
             */
            this._followTitle = null;
        }

    /**
     * 鏍规嵁鐢ㄦ埛杈撳叆鐨刼pts锛屼慨鏀归粯璁ゅ弬鏁癬opts
     * @param {Json Object} opts 鐢ㄦ埛杈撳叆鐨勪慨鏀瑰弬鏁�
     * @return 鏃犺繑鍥炲€�
     */
    RectangleZoom.prototype._setOptions = function(opts) {
        if (!opts) {
            return;
        }
        for (var p in opts) {
            if (typeof(opts[p]) != "undefined") {
                this._opts[p] = opts[p];
            }
        }
    };

    /**
     * 璁剧疆绾块鑹�
     * @param {String} color 璁剧疆鐨勯伄鐩栧眰澶栨绾胯壊
     * @return 鏃犺繑鍥炲€�
     *
     * @example <b>鍙傝€冪ず渚嬶細</b><br />
     * myRectangleZoomObject.setStrokeColor("#fff");
     */
    RectangleZoom.prototype.setStrokeColor = function(color) {
        if (typeof color == "string") {
            this._opts.strokeColor = color;
            this._updateStyle();
        }
    };

    /**
     * 璁剧疆绾跨矖缁�
     * @param {Number} width 璁剧疆鐨勯伄鐩栧眰澶栨绾垮
     * @return 鏃犺繑鍥炲€�
     *
     * @example <b>鍙傝€冪ず渚嬶細</b><br />
     * myRectangleZoomObject.setLineStroke(3);
     */
    RectangleZoom.prototype.setLineStroke = function(width) {
        if (typeof width == "number" && Math.round(width) > 0) {
            this._opts.strokeWeight = Math.round(width);
            this._updateStyle();
        }
    };

    /**
     * 璁剧疆绾挎牱寮�
     * @param {String} style 璁剧疆鐨勯伄鐩栧眰澶栨鏍峰紡
     * @return 鏃犺繑鍥炲€�
     *
     * @example <b>鍙傝€冪ず渚嬶細</b><br />
     * myRectangleZoomObject.setLineStyle("dashed");
     */
    RectangleZoom.prototype.setLineStyle = function(style) {
        if (style == "solid" || style == "dashed") {
            this._opts.style = style;
            this._updateStyle();
        }
    };

    /**
     * 璁剧疆閫忔槑搴�
     * @param {Number} opacity 璁剧疆鐨勯伄鐩栧眰閫忔槑搴�
     * @return 鏃犺繑鍥炲€�
     *
     * @example <b>鍙傝€冪ず渚嬶細</b><br />
     * myRectangleZoomObject.setOpacity(0.5);
     */
    RectangleZoom.prototype.setOpacity = function(opacity) {
        if (typeof opacity == "number" && 
            opacity >= 0 && 
            opacity <= 1) {
                this._opts.opacity = opacity;
                this._updateStyle();
        }
    };

    /**
     * 璁剧疆濉厖鑹�
     * @param {String} color 璁剧疆鐨勯伄鐩栧眰濉厖鑹�
     * @return 鏃犺繑鍥炲€�
     *
     * @example <b>鍙傝€冪ず渚嬶細</b><br />
     * myRectangleZoomObject.setFillColor("#F0F");
     */
    RectangleZoom.prototype.setFillColor = function(color) {
        this._opts.fillColor = color;
        this._updateStyle();
    };

    /**
     * 璁剧疆榧犳爣鏍峰紡
     * @param {String} cursor 璁剧疆鐨勯紶鏍囨牱寮�
     * @return 鏃犺繑鍥炲€�
     *
     * @example <b>鍙傝€冪ず渚嬶細</b><br />
     * myRectangleZoomObject.setCursor("crosshair");
     */
    RectangleZoom.prototype.setCursor = function(cursor) {
        this._opts.cursor = cursor;
        // 璁剧疆榧犳爣鏍峰紡
        OperationMask.setCursor(this._opts.cursor);
    };

    /**
     * 鏍规嵁閰嶇疆淇℃伅鏇存柊鏍峰紡
     * @return 鏃犺繑鍥炲€�
     */
    RectangleZoom.prototype._updateStyle = function() {
        if (this._fDiv){
            this._fDiv.style.border = 
                [this._opts.strokeWeight, 
                "px ", 
                this._opts.style, 
                " ", 
                this._opts.color].join("");

            // 璁剧疆涓嶅悓鐜涓嬬殑閫忔槑搴�
            var st = this._fDiv.style,
                  op = this._opts.opacity;
            st.opacity = op; 
            st.MozOpacity = op;
            st.KhtmlOpacity = op;
            st.filter = "alpha(opacity=" + (op * 100) + ")";
        }
    };

    /**
     * 鑾峰彇榧犳爣鏍峰紡
     * @return 榧犳爣鏍峰紡
     *
     * @example <b>鍙傝€冪ず渚嬶細</b><br />
     * myRectangleZoomObject.getCursor();
     */
    RectangleZoom.prototype.getCursor = function() {
        return this._opts.cursor;
    };

    /**
     * 鎺т欢椤圭殑浜嬩欢缁戝畾
     * @return 鏃犺繑鍥炲€�
     */
    RectangleZoom.prototype._bind = function(){
        // 璁剧疆榧犳爣鏍峰紡
        this.setCursor(this._opts.cursor);
        var me = this;
        // 鍦ㄨ杞藉湴鍥剧殑椤甸潰鍏冪礌涓婏紝缁戝畾榧犳爣绉诲姩浜嬩欢
        addEvent(this._map.getContainer(), "mousemove", function(e){
            if (!me._isOpen) {
                return;
            }
            if (!me._followTitle) {
                return;
            }
            e = window.event || e;
            var t = e.target || e.srcElement;
            // 濡傛灉瑙﹀彂璇ヤ簨浠剁殑椤甸潰鍏冪礌涓嶆槸閬洊鏁堟灉灞傦紝鍒欒繑鍥烇紝鏃犳搷浣�
            if (t != OperationMask.getDom(me._map)) {
                me._followTitle.hide();
                return;
            }
            if (!me._mapMoving) {
                me._followTitle.show();
            }
            // 璁剧疆榧犳爣绉诲姩杩囩▼涓紝璺熼殢鐨勬枃瀛楁彁绀烘鐨勪綅缃�
            var pt = OperationMask.getDrawPoint(e, true);
            me._followTitle.setPosition(pt);
        });
        // 鍒涘缓榧犳爣璺熼殢鐨勬枃瀛楁彁绀烘
        if (this._opts.followText) {
            var t = this._followTitle = new BMap.Label(this._opts.followText, {offset : new BMap.Size(14, 16)});
            this._followTitle.setStyles({color : "#333", borderColor : "#ff0103"});
        }
    };

    /**
     * 寮€鍚媺妗嗙缉鏀剧姸鎬併€�
     * 鍦ㄧ缉鏀炬晥鏋滅粨鏉熺殑鏃跺€欙紝浼氳皟鐢ˋnimation搴�(瑙佹簮鏂囦欢锛岄棴鍖咃紝涓嶅澶栧紑鏀�)
     * 鏉ュ疄鐜颁竴浜涘皬鍔ㄧ敾
     * @return 鎴愬姛寮€鍚媺妗嗙缉鏀剧姸鎬佹椂锛岃繑鍥瀟rue锛涘惁鍒欐棤杩斿洖鍊�
     *
     * @example <b>鍙傝€冪ず渚嬶細</b><br />
     * myRectangleZoomObject.open();
     */
    RectangleZoom.prototype.open = function() {
        // 鍒ゆ柇鎷夋缂╂斁鐘舵€佹槸鍚﹀凡缁忓紑鍚�
        if (this._isOpen == true) {
            return true;
        }
        // 宸叉湁鍏朵粬鍦板浘涓婄殑榧犳爣鎿嶄綔宸ュ叿寮€鍚�
        if (!!BMapLib._toolInUse) {
            return;
        }
        this._isOpen = true;
        BMapLib._toolInUse = true;

        // 澧炲姞榧犳爣鍦ㄥ湴鍥惧尯鍩熺Щ鍔ㄧ殑浜嬩欢
        // 閫氳繃binded鍙傛暟锛岄伩鍏嶅娆＄粦瀹�
        if (!this.binded) {
            this._bind();
            this.binded = true;
        }

        // 灏嗘枃瀛楁彁绀烘浣滀负BMap.Label鍏冪礌锛屾彁浜ょ粰Map Api杩涜绠＄悊
        if (this._followTitle) {
            this._map.addOverlay(this._followTitle);
            this._followTitle.hide();
        }

        var me = this;
        var map = this._map;
        // 杩斿洖IE鐗堟湰鍙�
        var ieVersion = 0;
        if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
            ieVersion = document.documentMode || + RegExp['\x241']
        }

        // 寮€鍚媺妗嗙缉鏀剧姸鎬佸悗锛岄紶鏍囧湪鍦板浘涓婃寜涓嬫椂鐨勬搷浣�
        var beginDrawRect = function(e) {        
            // 鐢变簬鍦↖E鍜岄潪IE娴忚鍣ㄤ笅锛宔瀵硅薄瀵归紶鏍囨寜涓嬮敭鐨勮繑鍥炲€间笉涓€鏍�
            // 鎵€浠ラ渶瑕佸垎涓ょ鎯呭喌鍒ゆ柇锛屽綋涓嶆槸榧犳爣宸﹂敭鏃讹紝杩斿洖鏃犳搷浣�
            e = window.event || e;
            if (e.button != 0 && 
                !ieVersion ||
                ieVersion && 
                e.button != 1) {
                    return;
            }

            // 澧炲姞IE娴忚鍣ㄤ笅瀵逛簨浠剁殑鎹曡幏
            if (!!ieVersion && OperationMask.getDom(map).setCapture) {
                OperationMask.getDom(map).setCapture();
            }

            if (!me._isOpen) {
                return;
            }
            me._bind.isZooming = true;

            // 娣诲姞鎷栨嫿榧犳爣鐢绘鏃讹紝榧犳爣绉诲姩浜嬩欢锛屽拰榧犳爣寮硅捣浜嬩欢
            addEvent(document, "mousemove", drawingRect);
            addEvent(document, "mouseup", endDrawRect);

            // 璁板綍姝ゆ椂榧犳爣鐩稿叧浣嶇疆
            me._bind.mx = e.layerX || e.offsetX || 0;
            me._bind.my = e.layerY || e.offsetY || 0;
            me._bind.ix = e.pageX || e.clientX || 0;
            me._bind.iy = e.pageY || e.clientY || 0;

            // 鍒涘缓鐭╁舰鍗婇€忔槑鏁堟灉妗�
            insertHTML(OperationMask.getDom(map), "beforeBegin", me._generateHTML());
            me._fDiv = OperationMask.getDom(map).previousSibling;

            me._fDiv.style.width = "0";
            me._fDiv.style.height = "0";
            me._fDiv.style.left = me._bind.mx + "px";
            me._fDiv.style.top = me._bind.my + "px";

            // 鍋滄浜嬩欢鍐掓场浼犳挱鍜岄粯璁や簨浠�
            stopBubble(e);
            return preventDefault(e);
        };

        // 寮€鍚媺妗嗙缉鏀剧姸鎬佸悗锛岄紶鏍囧湪鍦板浘涓婃寜涓嬨€佸苟鎷栨嫿鏃剁殑鎿嶄綔
        var drawingRect = function(e) {
            if (me._isOpen == true && me._bind.isZooming == true) {
                // 閫氳繃榧犳爣褰撳墠鎵€鍦ㄤ綅缃紝璁＄畻鐭╁舰鍗婇€忔槑鏁堟灉妗嗙殑楂樺
                var e = window.event || e;
                var curX = e.pageX || e.clientX || 0;
                var curY = e.pageY || e.clientY || 0;
                var dx = me._bind.dx = curX - me._bind.ix;
                var dy = me._bind.dy = curY - me._bind.iy;   
                var tw = Math.abs(dx) - me._opts.strokeWeight;
                var th = Math.abs(dy) - me._opts.strokeWeight;
                me._fDiv.style.width = (tw < 0 ? 0 : tw) + "px";
                me._fDiv.style.height = (th < 0 ? 0 : th) + "px";

                // 璁＄畻鐭╁舰鍗婇€忔槑鏁堟灉妗嗘墍鍦ㄤ綅缃�
                var mapSize = [map.getSize().width, map.getSize().height];
                // 褰揹x灏忎簬0鐨勬椂鍊欙紝涔熷氨鏄粯鍒朵腑鐨勭偣浣嶇疆锛屽湪姘村钩鏂瑰悜涓婏紝姣旇捣濮嬬偣鏇撮潬宸�
                // 璇存槑锛屾鏃剁敤鎴峰湪浠庡彸寰€宸︾粯鍒剁煩褰㈡
                // 闇€瑕佸鐭╁舰鐨勫彸杈硅窛杩涜璁＄畻锛屼笌鏅€氱姸鍐典笅鐨勮绠楀乏杈硅窛锛屾湁鎵€涓嶅悓
                if (dx >= 0) {
                    me._fDiv.style.right = "auto";
                    me._fDiv.style.left = me._bind.mx + "px";
                    if (me._bind.mx + dx >= mapSize[0] - 2 * me._opts.strokeWeight) {
                        me._fDiv.style.width = mapSize[0] - me._bind.mx - 2 * me._opts.strokeWeight + "px";
                        me._followTitle && me._followTitle.hide();
                    }
                } else {
                    me._fDiv.style.left = "auto";
                    me._fDiv.style.right = mapSize[0] - me._bind.mx + "px";
                    if (me._bind.mx + dx <= 2 * me._opts.strokeWeight) {
                        me._fDiv.style.width = me._bind.mx - 2 * me._opts.strokeWeight + "px";
                        me._followTitle && me._followTitle.hide();
                    }
                }
                // 褰揹y灏忎簬0鐨勬椂鍊欙紝涔熷氨鏄粯鍒朵腑鐨勭偣浣嶇疆锛屽湪鍨傜洿鏂瑰悜涓婏紝姣旇捣濮嬬偣鏇撮潬涓�
                // 璇存槑锛屾鏃剁敤鎴峰湪浠庝笅寰€涓婄粯鍒剁煩褰㈡
                // 闇€瑕佸鐭╁舰鐨勪笅杈硅窛杩涜璁＄畻锛屼笌鏅€氱姸鍐典笅鐨勮绠椾笂杈硅窛锛屾湁鎵€涓嶅悓
                if (dy >= 0) {
                    me._fDiv.style.bottom = "auto";
                    me._fDiv.style.top = me._bind.my + "px";
                    if (me._bind.my + dy >= mapSize[1] - 2 * me._opts.strokeWeight) {
                        me._fDiv.style.height = mapSize[1] - me._bind.my - 2 * me._opts.strokeWeight + "px";
                        me._followTitle && me._followTitle.hide();
                    }
                } else {
                    me._fDiv.style.top = "auto";
                    me._fDiv.style.bottom = mapSize[1] - me._bind.my + "px";
                    if (me._bind.my + dy <= 2 * me._opts.strokeWeight) {
                        me._fDiv.style.height = me._bind.my - 2 * me._opts.strokeWeight + "px";
                        me._followTitle && me._followTitle.hide();
                    }
                }

                // 鍋滄浜嬩欢鍐掓场浼犳挱鍜岄粯璁や簨浠�
                stopBubble(e);
                return preventDefault(e);
            }
        };

        // 寮€鍚媺妗嗙缉鏀剧姸鎬佸悗锛岄紶鏍囧湪鍦板浘涓婃嫋鎷芥椂銆佸脊璧风殑鎿嶄綔
        var endDrawRect = function(e) {
            if (me._isOpen == true) {
                // 鍒犻櫎鎷栨嫿榧犳爣鐢绘鏃讹紝榧犳爣绉诲姩浜嬩欢锛屽拰榧犳爣寮硅捣浜嬩欢
                removeEvent(document, "mousemove", drawingRect);
                removeEvent(document, "mouseup", endDrawRect);

                // 閲婃斁IE娴忚鍣ㄤ笅瀵逛簨浠剁殑鎹曡幏
                if (!!ieVersion && OperationMask.getDom(map).releaseCapture){
                    OperationMask.getDom(map).releaseCapture();
                }

                // 璁＄畻褰撳墠鐭╁舰鍗婇€忔槑鏁堟灉妗嗙殑涓績鐐�
                var centerX = parseInt(me._fDiv.style.left) + parseInt(me._fDiv.style.width) / 2;
                var centerY = parseInt(me._fDiv.style.top) + parseInt(me._fDiv.style.height) / 2;
                var mapSize = [map.getSize().width, map.getSize().height];
                if (isNaN(centerX)) {
                    centerX = mapSize[0] - parseInt(me._fDiv.style.right) - parseInt(me._fDiv.style.width) / 2;
                }
                if (isNaN(centerY)) {
                    centerY = mapSize[1] - parseInt(me._fDiv.style.bottom) - parseInt(me._fDiv.style.height) / 2;
                }

                // 閫氳繃瀵规瘮鐭╁舰鍜屽湴鍥惧尯鍩熺殑楂樺锛岃绠楅渶瑕佺殑缂╂斁姣斾緥
                var ratio = Math.min(mapSize[0] / Math.abs(me._bind.dx), mapSize[1] / Math.abs(me._bind.dy));
                ratio = Math.floor(ratio);

                // 閫氳繃灞忓箷涓婄殑鍍忕礌鍧愭爣鐨勮浆鍖栵紝璁＄畻鐭╁舰鍗婇€忔槑鏁堟灉妗嗙殑Bound鍖哄煙
                var px1 = new BMap.Pixel(centerX - parseInt(me._fDiv.style.width) / 2, centerY - parseInt(me._fDiv.style.height) / 2);
                var px2 = new BMap.Pixel(centerX + parseInt(me._fDiv.style.width) / 2, centerY + parseInt(me._fDiv.style.height) / 2);
                var pt1 = map.pixelToPoint(px1);
                var pt2 = map.pixelToPoint(px2);
                var bds = new BMap.Bounds(pt1, pt2);

                delete me._bind.dx;
                delete me._bind.dy;
                delete me._bind.ix;
                delete me._bind.iy;

                // 璁＄畻缂╂斁鍚庡簲璇ユ墍鍦ㄧ殑鍦板浘灞傜骇
                // 褰撶煩褰㈡晥鏋滄鍜屽湴鍥惧尯鍩熺殑楂樺姣旀湁娓呮櫚缁撴灉鏃�(鍗硆atio鏈夎绠楃粨鏋�)锛岄€氳繃楂樺姣旀潵璁＄畻
                // 鐢变簬姣忓眰绾у湴鍥鹃棿鐨勭缉鏀炬瘮1:2锛屾墍浠ヤ娇鐢ㄤ笅闈㈢殑璁＄畻鍏紡
                // 褰搑atio鏃犺绠楃粨鏋滄椂锛屽彧杩涜鏅€氱殑1涓骇鍒殑缂╂斁鏀瑰彉
                if (!isNaN(ratio)) {
                    if (me._opts.zoomType == BMAP_ZOOM_IN){
                        // 鎷夋鏀惧ぇ鐨勬儏鍐�
                        targetZoomLv = Math.round(map.getZoom() + (Math.log(ratio) / Math.log(2)));
                        if (targetZoomLv < map.getZoom()){
                            targetZoomLv = map.getZoom();
                        }
                    } else{
                        // 鎷夋缂╁皬鐨勬儏鍐�
                        targetZoomLv = Math.round(map.getZoom() + (Math.log(1 / ratio) / Math.log(2)));
                        if (targetZoomLv > map.getZoom()){
                            targetZoomLv = map.getZoom();
                        }
                    }
                } else{
                    targetZoomLv = map.getZoom() + (me._opts.zoomType == BMAP_ZOOM_IN ? 1 : -1);
                }
                
                // 杩涜灞傜骇缂╂斁锛屽苟瀹氫綅鏂颁腑蹇冪偣
                var targetCenterPt = map.pixelToPoint({x : centerX, y : centerY}, map.getZoom());
                map.centerAndZoom(targetCenterPt, targetZoomLv);

                // 璁剧疆榧犳爣绉诲姩杩囩▼涓紝璺熼殢鐨勬枃瀛楁彁绀烘鐨勪綅缃�
                var pt = OperationMask.getDrawPoint(e);
                if (me._followTitle) {
                    me._followTitle.setPosition(pt);
                    me._followTitle.show();
                }
                me._bind.isZooming = false;
                
                // 缂╂斁鎿嶄綔缁撴潫锛屽垹闄ょ煩褰㈠崐閫忔槑妗�
                me._fDiv.parentNode.removeChild(me._fDiv);
                me._fDiv = null;
            }

            // 鍒涘缓鐭╁舰瑕嗙洊鐗╋紝鐢ㄤ互缂╂斁缁撴潫鍚庣殑鍔ㄧ敾鏁堟灉
            // 濡傛灉涓嶉渶瑕佸姩鐢绘晥鏋滐紝浠庢澶勫埌new Animation()鐨勮繃绋嬨€佷互鍙夾nimation鐨勫０鏄庯紝鍧囧彲鍒犻櫎
            var southWestPoint = bds.getSouthWest(),
                  northEastPoint = bds.getNorthEast(),
                  southEastPoint = new BMap.Point(northEastPoint.lng, southWestPoint.lat),
                  northWestPoint = new BMap.Point(southWestPoint.lng, northEastPoint.lat),
                  rect = new BMap.Polygon([
                        southWestPoint,
                        northWestPoint,
                        northEastPoint,
                        southEastPoint
                  ]);
            rect.setStrokeWeight(2);
            rect.setStrokeOpacity(0.3);
            rect.setStrokeColor("#111");
            rect.setFillColor("");
            map.addOverlay(rect);

            // 娓愰殣钘忓姩鐢绘晥鏋�
            new Animation({
                    duration : 240, 
                    fps : 20,
                    delay : 500, 
                    render : function(t) {
                        var opacity = 0.3 * (1 - t);
                        rect.setStrokeOpacity(opacity);
                    },
                    finish : function() {
                        map.removeOverlay(rect);
                        //rect.dispose();
                        rect = null;
                    }
            });

            // 璁剧疆涓鸿嚜鍔ㄥ叧闂缉鏀剧姸鎬佹椂锛屼慨鏀圭浉鍏崇姸鎬佸€�
            if (me._opts.autoClose) {
                setTimeout(function() {
                    if (me._isOpen == true) {
                        me.close();
                    }
                }, 70);
            }      

            // 鍋滄浜嬩欢鍐掓场浼犳挱鍜岄粯璁や簨浠�
            stopBubble(e);
            return preventDefault(e);
        };

        OperationMask.show(this._map);
        this.setCursor(this._opts.cursor);

        // 澧炲姞榧犳爣鎸変笅鏃讹紝寮€濮嬬粯鍒剁煩褰㈡鐨勪簨浠�
        // 閫氳繃鍒ゆ柇鍙粦瀹氫竴娆★紝骞朵笉鍐嶅垹闄�
        if (!this._isBeginDrawBinded) {
            addEvent(OperationMask.getDom(this._map), "mousedown", beginDrawRect);
            this._isBeginDrawBinded = true;
        }

        return true;
    };

    /**
     * 缁撴潫鎷夋鏀惧ぇ鐘舵€�
     * @return 鏃犺繑鍥炲€�
     *
     * @example <b>鍙傝€冪ず渚嬶細</b><br />
     * myRectangleZoomObject.close();
     */
    RectangleZoom.prototype.close = function() {
        if (!this._isOpen) {
            return;
        }
        this._isOpen = false;
        BMapLib._toolInUse = false;
        this._followTitle && this._followTitle.hide();
        OperationMask.hide();
    };

    /**
     * 鐢熸垚閫忔槑鏁堟灉灞�
     * @return 閫忔槑灞傜殑html瀛楃涓�
     */
    RectangleZoom.prototype._generateHTML = function() {
        return ["<div style='position:absolute;z-index:300;border:",
                    this._opts.strokeWeight,
                    "px ",
                    this._opts.style,
                    " ",
                    this._opts.strokeColor,
                    "; opacity:",
                    this._opts.opacity,
                    "; background: ",
                    this._opts.fillColor,
                    "; filter:alpha(opacity=",
                    Math.round(this._opts.opacity * 100),
                    "); width:0; height:0; font-size:0'></div>"].join("");
    };


    /**
     * 鍦ㄧ洰鏍囧厓绱犵殑鎸囧畾浣嶇疆鎻掑叆HTML浠ｇ爜锛�
     * 闂寘锛屽澶栦笉鏆撮湶
     *
     * @param {HTMLElement|string} element 鐩爣鍏冪礌鎴栫洰鏍囧厓绱犵殑id
     * @param {String} position 鎻掑叆html鐨勪綅缃俊鎭�
     *     鍙栧€间负beforeBegin銆乤fterBegin銆乥eforeEnd鎴朼fterEnd锛屽ぇ灏忓啓涓嶆晱鎰�
     * @param {String} html 瑕佹彃鍏ョ殑html    
     * @return {HTMLElement} 鐩爣鍏冪礌
     */
    function insertHTML(element, position, html) {
        var range,begin;
        if (element.insertAdjacentHTML) {
            element.insertAdjacentHTML(position, html);
        } else {
            range = element.ownerDocument.createRange();
            // FF涓媟ange鐨勪綅缃缃敊璇彲鑳藉鑷村垱寤哄嚭鏉ョ殑fragment鍦ㄦ彃鍏om鏍戜箣鍚巋tml缁撴瀯涔辨帀
            // 鏀圭敤range.insertNode鏉ユ彃鍏tml
            position = position.toUpperCase();
            if (position == 'AFTERBEGIN' || position == 'BEFOREEND') {
                range.selectNodeContents(element);
                range.collapse(position == 'AFTERBEGIN');
            } else {
                begin = position == 'BEFOREBEGIN';
                range[begin ? 'setStartBefore' : 'setEndAfter'](element);
                range.collapse(begin);
            }
            range.insertNode(range.createContextualFragment(html));
        }
        return element;
    }

    /**
     * 鎻掑叆鍒癉om鍏冪礌鍐咃紝鏈€鍚庨潰涓€娈礖TML;骞惰繑鍥濪om瀵硅薄锛�
     * 闂寘锛屽澶栦笉鏆撮湶
     *
     * @param {Object} parent 鐖跺鍣�
     * @param {Object} chlidHTML	鎻掑叆鐨凥TML
     * @return Dom鍏冪礌
     */
    function beforeEndHTML(parent, chlidHTML) {
        insertHTML(parent, "beforeEnd", chlidHTML);
        return parent.lastChild;
    }

    /**
     * 鍋滄浜嬩欢鍐掓场浼犳挱锛�
     * 闂寘锛屽澶栦笉鏆撮湶
     *
     * @type {Event} e e瀵硅薄
     */
    function stopBubble(e){
        var e = window.event || e;
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }

    /**
     * 闃绘榛樿浜嬩欢澶勭悊锛�
     * 闂寘锛屽澶栦笉鏆撮湶
     *
     * @type {Event} e e瀵硅薄
     */
    function preventDefault(e) {
        var e = window.event || e;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        return false;
    }

    /**
     * 缁欐煇椤甸潰鍏冪礌娣诲姞浜嬩欢锛�
     * 闂寘锛屽澶栦笉鏆撮湶
     *
     * @type {Dom} element 闇€瑕佹坊鍔犱簨浠剁殑dom瀵硅薄
     * @type {String} type 闇€瑕佹坊鍔犵殑浜嬩欢鍚�
     * @type {Function} listener 闇€瑕佽Е鍙戠殑鎿嶄綔
     */
    function addEvent(element, type, listener) {
        if (!element) {
            return;
        }
        type = type.replace(/^on/i, '').toLowerCase();
        if (element.addEventListener) {
            element.addEventListener(type, listener, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, listener);
        }
    };

    /**
     * 缁欐煇椤甸潰鍏冪礌鍒犻櫎浜嬩欢锛�
     * 闂寘锛屽澶栦笉鏆撮湶
     *
     * @type {Dom} element 闇€瑕佸垹闄や簨浠剁殑dom瀵硅薄
     * @type {String} type 闇€瑕佸垹闄ょ殑浜嬩欢鍚�
     * @type {Function} listener 闇€瑕佽Е鍙戠殑鎿嶄綔
     */
    function removeEvent(element, type, listener) {
        if (!element) {
            return;
        }
        type = type.replace(/^on/i, '').toLowerCase();
        if (element.removeEventListener) {
            element.removeEventListener(type, listener, false);
        } else if (element.detachEvent) {
            element.detachEvent('on' + type, listener);
        }
    };


    /**
     * OperationMask锛岄€忔槑瑕嗙洊灞傦紝鍦ㄥ湴鍥句笂杩涜榧犳爣缁樺埗鎿嶄綔鏃朵娇鐢紝
     * 闂寘锛屽澶栦笉鏆撮湶
     */
    var OperationMask = {
        /**
         * map瀵硅薄
         * @type {Map}
         */
        _map : null,

        /**
         * HTML瀛楃涓�
         * @type {String}
         */
        _html : "<div style='background:transparent url(http://api.map.baidu.com/images/blank.gif);position:absolute;left:0;top:0;width:100%;height:100%;z-index:1000' unselectable='on'></div>",

        /**
         * html鍏冪礌
         * @type {HTMLElement}
         */
        _maskElement : null,

        /**
         * 榧犳爣鎸囬拡
         * @type {String}
         */
        _cursor: 'default',

        /**
         * 鎿嶄綔灞傛槸鍚﹀湪浣跨敤涓�
         * @type {Boolean}
         */
        _inUse: false,

        /**
         * 閫忔槑瑕嗙洊灞傜殑鏄剧ず
         *
         * @param {Map} map map瀵硅薄
         * @return 鏃犺繑鍥炲€�
         */
        show : function(map) {
            if (!this._map) {
                this._map = map;
            }
            this._inUse = true;
            if (!this._maskElement) {
                this._createMask(map);
            }
            this._maskElement.style.display = 'block';
        },

        /**
         * 鍒涘缓瑕嗙洊灞�
         *
         * @param {Map} map map瀵硅薄
         * @return 鏃犺繑鍥炲€�
         */
        _createMask : function(map) {
            this._map = map;
            if (!this._map) {
                return;
            }
            var elem = this._maskElement = beforeEndHTML(this._map.getContainer(), this._html);

            var stopAndPrevent = function(e) {
                stopBubble(e);
                return preventDefault(e);
            }
            addEvent(elem, 'mouseup', function(e) {
                if (e.button == 2) {
                    stopAndPrevent(e);
                }
            });
            addEvent(elem, 'contextmenu', stopAndPrevent);
            elem.style.display = 'none';
        },

        /**
         * 鑾峰彇褰撳墠缁樺埗鐐圭殑鍦扮悊鍧愭爣
         *
         * @param {Event} e e瀵硅薄
         * @param {Boolean} n 鏄惁鍚戜笂鏌ュ埌鐩稿浜庡湴鍥綾ontainer鍏冪礌鐨勫潗鏍囦綅缃�
         * @return Point瀵硅薄鐨勪綅缃俊鎭�
         */
        getDrawPoint : function(e, n) {
            e = window.event || e;
            var x = e.layerX || e.offsetX || 0;
            var y = e.layerY || e.offsetY || 0;
            var t = e.target || e.srcElement;
            if (t != OperationMask.getDom(this._map) && n == true) {
                while (t && t != this._map.getContainer()) {
                    if (!(t.clientWidth == 0 && 
                         t.clientHeight == 0 && 
                         t.offsetParent && 
                         t.offsetParent.nodeName.toLowerCase() == 'td')) {
                            x += t.offsetLeft;
                            y += t.offsetTop;
                    }
                    t = t.offsetParent;
                }
            }

            if (t != OperationMask.getDom(this._map) && 
                t != this._map.getContainer()) {
                    return;
            }
            if (typeof x === 'undefined' || 
                typeof y === 'undefined') {
                    return;
            }
            if (isNaN(x) || isNaN(y)) {
                return;
            }
            return this._map.pixelToPoint(new BMap.Pixel(x, y));
        },

        /**
         * 閫忔槑瑕嗙洊灞傜殑闅愯棌
         *
         * @return 鏃犺繑鍥炲€�
         */
        hide : function() {
            if (!this._map) {
                return;
            }
            this._inUse = false;
            if (this._maskElement) {
                this._maskElement.style.display = 'none';
            }
        },

        /**
         * 鑾峰彇HTML瀹瑰櫒
         *
         * @param {Map} map map瀵硅薄
         * @return HTML瀹瑰櫒鍏冪礌
         */
        getDom : function(map) {
            if (!this._maskElement) {
                this._createMask(map);
            }
            return this._maskElement;
        },

        /**
         * 璁剧疆榧犳爣鏍峰紡
         *
         * @type {String} cursor 榧犳爣鏍峰紡
         * @return 鏃犺繑鍥炲€�
         */
        setCursor : function(cursor) {
            this._cursor = cursor || 'default';
            if (this._maskElement) {
                this._maskElement.style.cursor = this._cursor;
            }
        }
    };


    /**
     * Animation锛屽姩鐢绘晥鏋滅被锛�
     * 閫氳繃璇ョ被锛屽彲浠ュ疄鐜颁竴浜涘欢鏃躲€佽寰嬬殑鍔ㄧ敾鏁堟灉锛�
     * 闂寘鍦ㄦ枃浠跺唴锛屽澶栦笉鏆撮湶
     * 
     * @constructor
     * @param {Json Object} opts 鍙€夌殑杈撳叆鍙傛暟锛岄潪蹇呭～椤广€傚彲杈撳叆閫夐」鍖呮嫭锛�
     * {"duration" : {Number} 鍔ㄧ敾鏃堕暱, 鍗曚綅姣,
     *  "fps" : {Number} 姣忕甯ф暟,
     *  "delay" : {Number} 寤惰繜鎵ц鏃堕棿锛屽崟浣嶆绉�,
     *  "transition" : {Object} 鍙樻崲鏁堟灉鐨勬洸绾�,
     *  "finish" : {Function} 鍔ㄧ敾缁撴潫鐨勫洖璋冨嚱鏁�,
     *  "render" : {Function} 姣忎竴甯ф墽琛岀殑鍥炶皟鍑芥暟}
     */
    function Animation(opts) {
        var defaultOptions = {
            // 鍔ㄧ敾鏃堕暱, 鍗曚綅姣
            duration: 1000,
            // 姣忕甯ф暟
            fps: 30,
            // 寤惰繜鎵ц鏃堕棿锛屽崟浣嶆绉�
            delay: 0,
            // 鍙樻崲鏁堟灉鐨勬洸绾�
            transition: Transitions.linear,
            // 璋冪敤stop鍋滄鏃剁殑鍥炶皟鍑芥暟
            onStop: function(){} 
        };

       // 淇敼榛樿鍙傛暟
        if (opts) {
            for (var i in opts) {
                defaultOptions[i] = opts[i];
            }
        }
        this._opts = defaultOptions;

        if (defaultOptions.delay) {
            var me = this;
            setTimeout(function() {
                me._beginTime = new Date().getTime();
                me._endTime = me._beginTime + me._opts.duration;
                me._launch();
            }, defaultOptions.delay);
        } else {
            this._beginTime = new Date().getTime();
            this._endTime = this._beginTime + this._opts.duration;
            this._launch();
        }
    }

    /**
     * 鍔ㄧ敾鎵ц杩囩▼涓殑鎿嶄綔
     * @return 鏃犺繑鍥炲€�
     */
    Animation.prototype._launch = function() {
        var me = this;
        var now = new Date().getTime();

        if (now >= me._endTime) {
            if (typeof me._opts.render == 'function') {
                me._opts.render(me._opts.transition(1));
            }
            // finish()鎺ュ彛锛屾椂闂寸嚎缁撴潫鏃跺搴旂殑鎿嶄綔
            if (typeof me._opts.finish == 'function') {
                me._opts.finish();
            }
            return;
        }
        me.schedule = me._opts.transition((now - me._beginTime) / me._opts.duration);

        // render()鎺ュ彛锛岀敤鏉ュ疄鐜版瘡涓剦鍐叉墍瑕佸疄鐜扮殑鏁堟灉
        // schedule 鏃堕棿绾跨殑杩涘害
        if (typeof me._opts.render == 'function') {
            me._opts.render(me.schedule);
        }
        // 鎵ц涓嬩竴涓姩浣�
        if (!me.terminative) {
            me._timer = setTimeout(function() {
                me._launch()
            }, 1000 / me._opts.fps);
        }
    };  

    /**
     * 鍙樻崲鏁堟灉鍑芥暟搴�
     */
    var Transitions = {
        linear : function(t) {
            return t;
        },
        reverse : function(t) {
            return 1 - t;
        },
        easeInQuad : function(t) {
            return t * t;
        },
        easeInCubic : function(t) {
            return Math.pow(t, 3);
        },
        easeOutQuad : function(t) {
            return - (t * (t - 2));
        },
        easeOutCubic : function(t) {
            return Math.pow((t - 1), 3) + 1;
        },
        easeInOutQuad : function(t) {
            if (t < 0.5) {
                return t * t * 2;
            } else {
                return - 2 * (t - 2) * t - 1;
            }
            return;
        },
        easeInOutCubic : function(t) {
            if (t < 0.5) {
                return Math.pow(t, 3) * 4;
            } else {
                return Math.pow(t - 1, 3) * 4 + 1;
            }
        },
        easeInOutSine : function(t) {
            return (1 - Math.cos(Math.PI * t)) / 2;
        }
    };
})();

module.exports = BMapLib.RectangleZoom;