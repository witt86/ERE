if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);
import * as types from '../constants';
import http from './../../utils/HttpClient';
export const ModelApiCall = (methodName,queryParam,endpointRoot,typestr, shouldCallAPI=()=>true, oriParams={})=> {
    if (!methodName) {
        throw new Error('方法名不符合規範');
    }
    if (!queryParam) {
        queryParam = {};
    }
    if (typeof queryParam != 'object') {
        throw new Error('请传入JSON格式查询对象:' + queryParam + "," + JSON.stringify(methodName));
    }
    if (!typestr) {
        throw new Error('类型字符串不允许为空');
    }
    const {invokeEnterance,session} = oriParams;
    if (typeof window=='undefined' && typeof global == 'object' && typeof invokeEnterance == "function" && session ) {
        return {
            types: types.ProxyCall_Types_Creator(typestr).THREE,
            shouldCallAPI: shouldCallAPI,
            invokeAPI: ()=> {
                const query = {session, ...queryParam};
                const endpointRoot2 = endpointRoot;
                const methodName2 = methodName;
                return new Promise(async(resolve, reject) => {
                    try {
                        const result = await invokeEnterance(endpointRoot2, methodName2, query);
                        resolve(result);
                    } catch (err) {
                        console.error(`invokeEnterance error in ModelApiCall ...${endpointRoot2}.${methodName2}.${JSON.stringify(query)} ${err}`);
                        reject(err);
                    }
                });
            },
            payload: {...queryParam}
        }
    } else {
        var postData = {
            "queryObj": queryParam
        };
        return {
            types: types.ProxyCall_Types_Creator(typestr).THREE,
            shouldCallAPI: shouldCallAPI,
            callAPI: ()=> http.post(`${(typeof window == "object") ? window.API_endpoint : ""}/api/${endpointRoot}/` + methodName, postData),
            payload: {...queryParam}
        }
    }
}
