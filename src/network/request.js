import axios from "axios";
import {Message} from "element-ui";

//获取axios实例  用来发送请求
var instance = axios.create({
    baseURL:"api",
    timeout:"5000"
})

//封装response重复的逻辑
instance.interceptors.response.use(
    //处理拿到了服务器的响应数据
    function (response) {
        let status = response.status;
        if(status == 200){
            return response.data;
        }else if(status == 404){
            Message.error("请求的资源不存在")
        }else if(status == 500){
            Message.error("服务器异常")
        }
    },
    //处理没有正常的响应数据的请求  异常的将错误信息交给vue处理
    function (error) {
        this.promise().reject(error);
    })

//导出一个方法 供外部引入并使用：使用当前的axiox实例来向服务端发送请求
export function request(params) {
    return instance(params)
}