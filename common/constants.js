//远程通讯的命名空间
export const API_ENDPOINT_ServiceAPI = "serviceapi";

export const SESSION_TIMEOUT_PLEASE_RELOGIN = "闲置超时, 请刷新页面";


function Types_Creator_ProxyCall_request(aliasName) {
    return "SEQUE_"+aliasName.toUpperCase()+"_REQUEST";
}
function Types_Creator_ProxyCall_success(aliasName){
    return `SEQUE_${aliasName.toUpperCase()}_SUCCESS`;
}
function Types_Creator_ProxyCall_failure(aliasName) {
    return `SEQUE_${aliasName.toUpperCase()}_FAILURE`;
}
export function ProxyCall_Types_Creator(aliasName) {
    const types = [
        Types_Creator_ProxyCall_request(aliasName),
        Types_Creator_ProxyCall_success(aliasName),
        Types_Creator_ProxyCall_failure(aliasName)];
    return {
        REQUEST: types[0],
        SUCCESS: types[1],
        FAILURE: types[2],
        THREE: types
    }
};
