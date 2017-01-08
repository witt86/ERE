import express from 'express';
import {sleep} from './../../../utils/TScript';

export default (BusinessModel,options,callback_funParams) => {
    if (callback_funParams) {
        if (typeof callback_funParams != 'function') {
            throw 'callback_funParams必须是function类型的参数';
        }
    }
    const {denyMethods} = options;  //todo 方法黑名单，部分方法不让前端直接访问
    let _BusinessModel=  BusinessModel;
    let router = express.Router();
    router.get('*', async (req, res, next)=> {
        res.json({err: 'get请求方式未实现, 仅限Post方式', result: null});
    });
    router.all('*', async (req, res, next)=> {
        try {
            if (process.env.SLOW_NET == "1") {
                await sleep(2000);
            }
            let pathItems = req.path.split("/");
            let methodName = pathItems[1] ? pathItems[1] : null;
            if (!_BusinessModel[methodName]) {
                throw `api请求的地址(${req.originalUrl})中对应的类不存在${methodName}方法,请确认映射的类是否正确!`;
            }
            let {queryObj = {}} = req.body;
            let params = queryObj;
            let paramsMerged = null;
            let result = null;
            if (callback_funParams && typeof callback_funParams == 'function') {//如果有要对传入参数做验证，则在callback_funParams中处理
                paramsMerged = await callback_funParams(req, res, params);
            }
            //合并入req对象
            result = await _BusinessModel[methodName]({...(paramsMerged || params)});
            if (process.env.NODE_ENV != "production") {
                console.dir(`post result from(${req.originalUrl}) `);
            }
            res.json({err: null, result: result});
        }catch (err) {
            res.json({err: err, result: null});
        }
    });
    return router
};

