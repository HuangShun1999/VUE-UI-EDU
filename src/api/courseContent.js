import {request} from "@/network/request";

export function findCourseByCourseId(params){
    return request({
        url:"/courseContent/findCourseByCourseId",
        method:"get",
        params:params
    })
}
export function findSectionAndLesson(params){
    return request({
        url:"/courseContent/findSectionAndLesson",
        method:"get",
        params:params
    })
}
export function saveOrUpdateSection(params){
    return request({
        url:"/courseContent/saveOrUpdateSection",
        method:"post",
        data:params
    })
}

export function updateSectionStatus(params){
    return request({
        url:"/courseContent/updateSectionStatus",
        method:"get",
        params:params
    })
}

