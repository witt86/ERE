import express, { Router } from 'express';
import ModelProxy from './lib/ModelProxy';
import * as ServiceAPI from './model/ServiceAPI';
import * as types from './../../common/constants';

const router = new Router();

router.use("/serviceapi",ModelProxy(ServiceAPI,{}, async (req,res,params)=> {
    const mysession =  req.session;
    //此处可根据具体业务，如用户session超时，向浏览器输出超时提示
    if (!mysession){
        throw types.SESSION_TIMEOUT_PLEASE_RELOGIN;
    }
    else {
        try {
            params.session = mysession;
            return params;
        } catch (e) {
            console.error(e);
            throw `网络通讯异常，请重试！`;
        }
    }
}));

//拦截未匹配到的其他方法
router.all("*",function(req,res) {
    res.json({error: "api方法未实现"});
});

export default router;
