import * as types from './../../../common/constants';
import * as ServiceAPI from './../model/ServiceAPI';

const map_api_endpint = {};
map_api_endpint[types.API_ENDPOINT_ServiceAPI] = ServiceAPI;

export const EndPointMap = async (api_endpint, methodName,  params)=> {
    if (map_api_endpint[api_endpint] && map_api_endpint[api_endpint][methodName] && typeof map_api_endpint[api_endpint][methodName] == "function") {
        let result = await map_api_endpint[api_endpint][methodName](params);
        return result;
    } else {
        const error = `指定的方法${methodName}或入口模块${api_endpint}未定义`;
        throw error;
    }
};
//'tms result from(http://test.tmonkey.cn:8001/tms-api/get_order):  {"order_no":"D161111MF2HJE","referrer":"f7fc1cfb14574b5398e7f929041f0146","with_overhead":1,"size":50}'
//'tms result from(http://test.tmonkey.cn:8001/tms-api/get_order):  {"order_no":"D161111MF2HJE","referrer":"686358eac965405c9721f7ba387e037c","with_overhead":1,"size":50}'
