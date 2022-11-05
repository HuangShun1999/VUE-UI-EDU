import {request} from "@/network/request";


export function findAllCourse(params){
    return request({
        url:"/course/findAllCourse",
        method:"post",
        data:params,
    })
}

export function saveOrUpdateCourse(params){
    return request({
        url:"/course/saveOrUpdateCourse",
        method:"post",
        data:params,
    })
}

export function updateCourseStatus(params){
    return request({
        url:"/course/updateCourseStatus",
        method:"get",
        params: params
    })
}