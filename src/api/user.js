import {request} from "@/network/request";

export function login(params){
    return request({
        url:"/user/login",
        method:"post",
        data:params
    })
}