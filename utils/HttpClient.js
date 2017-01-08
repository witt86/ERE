import request from 'superagent';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

function getUrl(path) {
    if (path.startsWith('http') || canUseDOM) {
        return path;
    }

    return process.env.WEBSITE_HOSTNAME ?
        `http://${process.env.WEBSITE_HOSTNAME}${path}` :
        `http://127.0.0.1:${global.server.get('port')}${path}`;
}

const HttpClient = {
    get: path => new Promise((resolve, reject) => {
        request
            .get(getUrl(path))
            .accept('application/json')
            .withCredentials()
            .end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.body);
                }
            });
    }),
    put: (path, payload) => new Promise((resolve, reject) => {
        request
            .put(getUrl(path))
            .withCredentials()
            .send(payload)
            .end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.body);
                }
            });
    }),
    post: (path, payload) => new Promise((resolve, reject) => {
        const url = getUrl(path);
        const reqID = `${Math.random()}`;
        if(process.env.DEBUG)
            console.dir(`post info(${reqID}): ${url} \n ${JSON.stringify(payload)}`);
        if(url.indexOf("qiniu.com")==-1){
            request
                .post(url)
                .set('Accept', 'application/json')
                .type('application/json')
                .withCredentials()
                .send(payload)
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res.body);
                    }
                });
        }else {
            //七牛不需要配置跨域相关的withCredentials
            request
                .post(url)
                .send(payload)
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res.body);
                    }
                });
        }
    }),
    delete: (path) => new Promise((resolve, reject) => {
        request
            .del(getUrl(path))
            .withCredentials()
            .end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    }),

};

export default HttpClient;
