<template>
    <div class="cv-imgMap">
        <li class="cv-imgMap-item">
            <h2>图片</h2>
            <div class="cv-img-content">
                <img :src="url?url:img" />
            </div>
        </li>
        <li class="cv-imgMap-item">
            <h2>地图</h2>
            <component 
                class="cv-img-content" 
                :is="$store.getters.mapName" 
                :id="mapName"
                :point="point"></component>
        </li>
    </div>
</template>

<script>
export default {
    props: {
        url: {
            default: require('@/assets/img/admin.png')
        },
        mapName: {
            default: 'tiredDriving'
        },
        // mapLongitude mapLatitude
        point: {
            default(){return {} }
        }
    },
    data(){
        return {
            img: require('@/assets/img/admin.png')
        }
    }
}
</script>

<style lang="scss">
    .cv-imgMap{
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        .cv-imgMap-item{
            height: 50%;
            position: relative;
            h2{
                border-bottom: 1px solid rgb(191, 203, 217);
                text-indent: 10px;
            }
            .cv-img-content{
                width: 100%;
                position: absolute;
                top: 30px;
                bottom: 0;
                text-align: center;
            }
        }
    }
</style>


