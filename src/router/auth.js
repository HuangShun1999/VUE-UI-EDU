import router from "@/router/index";

router.beforeEach((to,from,next)=>{
    if(to.meta.requireAuth){
        if(sessionStorage.getItem("userdata")){
            next()
        }else{
            next({
                path:"Login"
            })
        }
    }else {
        next()
    }
})