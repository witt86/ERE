export function callAPIMiddleware({ dispatch, getState }) {
    return next => action => {
        const {
            types,
            callAPI,
            invokeAPI,
            shouldCallAPI = () => true,
            payload = {}
        } = action;

        if (!types) {
            // Normal action: pass it on
            return next(action);
        }

        if (
            !Array.isArray(types) ||
            types.length !== 3 ||
            !types.every(type => typeof type === 'string')
        ) {
            throw new Error('Expected an array of three string types.');
        }

        if (typeof callAPI !== 'function' && typeof invokeAPI !== 'function') {
            throw new Error('Expected fetch to be a function.');
        }

        if (!shouldCallAPI(getState())) {
            return;
        }

        const [requestType, successType, failureType] = types;

        dispatch(Object.assign({}, payload, {
            type: requestType,
        }));

        if(typeof callAPI == 'function') {
            return callAPI().then(
                response => {
                    //这里进行了适应{err,result}数据结构的逻辑改造
                    const {err, result} = response;
                    if (err) {
                        dispatch(Object.assign({}, payload, {
                            error: err,
                            type: failureType,
                        }))
                    } else if (result) {
                        dispatch(Object.assign({}, payload, {
                            body: response.result,
                            lastFetched: Date.now(),
                            type: successType
                        }))
                    } else {
                        dispatch(Object.assign({}, payload, {
                            body: response,
                            lastFetched: Date.now(),
                            type: successType,
                        }))
                    }
                    return {err: err, result: result};
                },
                error => {
                    dispatch(Object.assign({}, payload, {
                        error,
                        type: failureType,
                    }))
                    return {err: error, result: null};
                }
            );
        }else {
            //invokeAPI
            return invokeAPI().then(
                result => {
                    dispatch(Object.assign({}, payload, {
                        body: result,
                        lastFetched: Date.now(),
                        type: successType
                    }));
                    return {err: null, result: result};
                },
                error => {
                    dispatch(Object.assign({}, payload, {
                        error,
                        type: failureType,
                    }))
                    return {err: error, result: null};
                }
            );
        }
    };
}
