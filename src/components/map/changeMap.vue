<template>
    <div class="mapChange">
        <cv-span 
            :type="$store.getters.mapName=='baiduMap'?'danger':'primary'" 
            @click.native="$store.dispatch('setMapType', 1)">百度</cv-span>
        <cv-span 
            :type="$store.getters.mapName=='gaodeMap'?'danger':'primary'" 
            @click.native="$store.dispatch('setMapType', 3)">高德</cv-span>
    </div>
</template>
<script>
export default {


    
}
</script>

<style lang="scss">
    .mapChange{
        position:absolute;
        right:10px;
        top:60px;
        padding: 6px 10px;
        border-radius: 20px;
        background: #fff;
        border: 1px solid #ccc;
    }
</style>




