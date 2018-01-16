/*
* 管理平台的子路由配置
* name: wukangjun
* time: 2017.07.13
*/
const dataDictionary = (resolve) => require(['@view/managePlatform/operation/dataDictionary/dataDictionary'], resolve)
const menuManage = (resolve) => require(['@view/managePlatform/operation/menuManage/menuManage'], resolve)
const permissionCode = (resolve) => require(['@view/managePlatform/operation/permissionCode/permissionCode'], resolve)
const carBind = (resolve) => require(['@view/managePlatform/operation/carBind/carBind'], resolve)
const powerManage = (resolve) => require(['@view/managePlatform/operation/powerManage/powerManage'], resolve)
const companyManage = (resolve) => require(['@view/managePlatform/systemSet/companyManage/companyManage'], resolve)
const roleManage = (resolve) => require(['@view/managePlatform/systemSet/roleManage/roleManage'], resolve)
const userManage = (resolve) => require(['@view/managePlatform/systemSet/userManage/userManage'], resolve)
const vgEscrow = (resolve) => require(['@view/managePlatform/vehicleGroup/vgEscrow/vgEscrow'], resolve)
const vgPower = (resolve) => require(['@view/managePlatform/vehicleGroup/vgPower/vgPower'], resolve)
const carEscrow = (resolve) => require(['@view/managePlatform/vehicleManage/carEscrow/carEscrow'], resolve)
const carList = (resolve) => require(['@view/managePlatform/vehicleManage/carList/carList'], resolve)
const deviceManage = (resolve) => require(['@view/managePlatform/vehicleManage/deviceManage/deviceManage'], resolve)
const driverManage = (resolve) => require(['@view/managePlatform/vehicleManage/driverManage/driverManage'], resolve)
const protocolM = (resolve) => require(['@view/managePlatform/deviceManage/protocolM/protocolM'], resolve)
const terminalM = (resolve) => require(['@view/managePlatform/deviceManage/terminalM/terminalM'], resolve)
const terminalProM = (resolve) => require(['@view/managePlatform/deviceManage/terminalProM/terminalProM'], resolve)
const deviceTypeM = (resolve) => require(['@view/managePlatform/deviceManage/deviceTypeM/deviceTypeM'], resolve)
const vehicleMaster = (resolve) => require(['@view/managePlatform/vehicleManage/vehicleMaster/vehicleMaster'], resolve)
const specialBusiness = (resolve) => require(['@view/managePlatform/operation/specialBusiness/specialBusiness'], resolve)
const manageService = (resolve) => require(['@view/managePlatform/operation/manageService/manageService'], resolve)
const platform = (resolve) => require(['@view/managePlatform/vehicleManage/platform/platform'], resolve)
const superiorPlatformM = (resolve) => require(['@view/managePlatform/systemSet/superiorPlatformM/superiorPlatformM'], resolve)
export default [
  {
    name: 'menuManage',
    path: 'menuManage',
    component: menuManage
  },
  {
    name: 'superiorPlatformM',
    path: 'superiorPlatformM',
    component: superiorPlatformM
  },
  {
    name: 'permissionCode',
    path: 'permissionCode',
    component: permissionCode
  },
  {
    name: 'companyManage',
    path: 'companyManage',
    component: companyManage
  },
  {
    name: 'carBind',
    path: 'carBind',
    component: carBind
  },
  {
    name: 'powerManage',
    path: 'powerManage',
    component: powerManage
  },
  {
    name: 'roleManage',
    path: 'roleManage',
    component: roleManage
  },
  {
    name: 'userManage',
    path: 'userManage',
    component: userManage
  },
  {
    name: 'vgEscrow',
    path: 'vgEscrow',
    component: vgEscrow
  },
  {
    name: 'vgPower',
    path: 'vgPower',
    component: vgPower
  },
  {
    name: 'carEscrow',
    path: 'carEscrow',
    component: carEscrow
  },
  {
    name: 'carList',
    path: 'carList',
    component: carList
  },
  {
    name: 'deviceManage',
    path: 'deviceManage',
    component: deviceManage
  },
  {
    name: 'driverManage',
    path: 'driverManage',
    component: driverManage
  },
  {
    name: 'dataDictionary',
    path: 'dataDictionary',
    component: dataDictionary
  },
  {
    name: 'protocolM',
    path: 'protocolM',
    component: protocolM
  },
  {
    name: 'terminalM',
    path: 'terminalM',
    component: terminalM
  },
  {
    name: 'terminalProM',
    path: 'terminalProM',
    component: terminalProM
  },
  {
    name: 'deviceTypeM',
    path: 'deviceTypeM',
    component: deviceTypeM
  },
  {
    name: 'vehicleMaster',
    path: 'vehicleMaster',
    component: vehicleMaster
  },
  {
    name: 'specialBusiness',
    path: 'specialBusiness',
    component: specialBusiness
  },
  {
    name: 'platform',
    path: 'platform',
    component: platform
  },
  {
    name: 'manageService',
    path: 'manageService',
    component: manageService
  }
  

]