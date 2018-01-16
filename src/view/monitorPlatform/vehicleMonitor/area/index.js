
/**
 * author:张婵玉
 * time:2017/10
 */

export default {
    methods: {
        findAreaCar(params) {
            return this.$http({
                url: this.$COMMON.baseUrl + '/vehicle/queryFixTimeVehicle',
                params: params,
                // method:'GET',
            });
        },
     
    }
}