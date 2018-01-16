例子: <baidu-map id="map"></baidu-map>
mapApi = this.$map[mapObj]
1. 获取地图对象
    var mapApi = this.$map[mapObj] ===> mapObj代表每个地图的唯一标识（例如例子中的id）
2. 获得地图marker覆盖对象
    var marker = mapApi.mapAddpoint(points, img);
    参数描述:
        -- points: {longitude: 116.404, latitude: 39.915}
        -- img: 地图点的图片
3. 将单个点居中
    mapApi.moveToCenter(point, args)
    参数描述: 
        -- point: {longitude: 116.404, latitude: 39.915}
        -- args （int）: 设置地图的缩放大小默认大小为: 16
4. 获得地图点对象--point
    mapApi.point(point)
    参数描述:
        -- point: {longitude: 116.404, latitude: 39.915}