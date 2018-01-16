/*
* name: 所有方法的集合可以按需求选择
* author: wukangjun
* time: 2017.07.05
*/
import ajax from './http.js'
import myService from './service.js'
import config from './config.js'
import myDomFn from './dom.js'
import myCookie from './mycookie.js'
import hash from './password'

export let http = ajax

export let service = myService

export let COMMON = config

export let myJq = myDomFn

export let password = hash

export let mycookie = myCookie


