import xml2js from 'xml2js';
import moment from 'moment';
import http from './HttpClient';
import {keys,indexOf} from 'lodash';

export const buildXML = (json)=>{
    const builder = new xml2js.Builder();
    return builder.buildObject(json);
};

export const parseXML = (xml, fn)=>{
    const parser = new xml2js.Parser({ trim:true, explicitArray:false, explicitRoot:false });
    parser.parseString(xml, fn||function(err, result){});
};
export const parseRaw = ()=>{
    return (req, res, next)=>{
        let buffer = [];
        req.on('data', function(trunk){
            buffer.push(trunk);
        });
        req.on('end', function(){
            req.rawbody = Buffer.concat(buffer).toString('utf8');
            next();
        });
        req.on('error', function(err){
            next(err);
        });
    }
};

export const pipe = (stream, fn)=>{
    var buffers = [];
    stream.on('data', function (trunk) {
        buffers.push(trunk);
    });
    stream.on('end', function () {
        fn(null, Buffer.concat(buffers));
    });
    stream.once('error', fn);
};

export const mix = ()=>{
    var root = arguments[0];
    if (arguments.length==1) { return root; }
    for (var i=1; i<arguments.length; i++) {
        for(var k in arguments[i]) {
            root[k] = arguments[i][k];
        }
    }
    return root;
};

export const generateNonceString = (length)=>{
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = chars.length;
    var noceStr = "";
    for (var i = 0; i < (length || 32); i++) {
        noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return noceStr;
};

export const showDay =(datetime1)=> {
    var tar = moment(datetime1);
    if (tar > moment().startOf('day').add(2, 'days')) {
        return '后天';
    }else if (tar > moment().startOf('day').add(1, 'days')) {
        return '明天';
    }else if (tar > moment().startOf('day')) {
        return '今天';
    }else if (tar > moment().startOf('day').add(-1, 'days')) {
        return '昨天';
    } else if (tar > moment().startOf('day').add(-2, 'days')) {
        return '前天';
    } else {
        return tar.format("MM-DD");
    }
}

export const showDayAndTime = (datetime1)=> {
    return showDay(datetime1) + " " + moment(datetime1).format("HH:mm");
}

export const sleep = (ms)=>{
    return new Promise((resolve, reject) => {
        setTimeout(_ => resolve(ms), ms);
    });
}

export const getMeta = (name, defaultValue)=> {
    try {
        const ele = document.querySelector(`meta[name="${name}"]`);
        return ele ? ele.getAttribute('content') : defaultValue;
    } catch (err) {
        return defaultValue;
    }
}

const httpful = (pathname)=> {
    if (pathname.indexOf("http") != -1) {
        return pathname
    } else {
        return document.location.protocol + "//" + document.location.hostname + pathname
    }
}

export const getPageWXShareInfo = ()=> {
    if (typeof window == "object") {
        return {
            title: getMeta("wx_share_title", document.title||""),
            content: getMeta("wx_share_content", (document.description || (document.title||""))),
            link: httpful(getMeta("wx_share_link", document.location.href)),
            imgurl: httpful(getMeta("wx_share_imgurl", ( "http://" + document.location.host + "/images/icon_108_108.png")))
        };
    } else {
        return {
            title: "",
            content: "!",
            link: "",
            imgurl: ""
        };
    }
}

export const delayRun = (fun, ms, errerhandle)=> {
    setTimeout(async ()=> {
        try {
            await fun();
        } catch (err) {
            if (errerhandle)
                errerhandle(err);
            else {
                console.error("error in delayRun:");
                console.error(err);
            }
        }
    }, ms);
}

export const hashcode = (str) => {
    var hash = 0, i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export const setdocumenttitle = (str) => {
    if (typeof window == "object") {
        if (window.iOS && window.inWeixin) {
            try {
                document.title = str;
                document.getElementById("ifrm_titleset").innerHTML = "<iframe src='/images/bottom.png?a=" + Math.random() + "'></iframe>";
            } catch (err) {
                console.error(`设置微信浏览器窗口title出错，err：${err}`);
            }
        }
        document.getElementById("root1").style.display='none';
    }
}

export const ScrollToBottom = (elemID, callback)=> {
    //防止重复进入
    if (window["___ScrollToBottom_" + elemID])
        return;
    //防止互斥
    if (window["___ScrollToTop_" + elemID])
        clearTimeout(window["___ScrollToTop_" + elemID]);
    const _elemID = elemID;
    const elem = document.getElementById(_elemID);
    const _stb = ()=> {
        const oldValue = elem.scrollTop;
        elem.scrollTop += 10;
        if (elem.scrollTop != oldValue) {
            //设置生效,说明还有滚动的空间
            window["___ScrollToBottom_" + _elemID] =setTimeout(_stb, 10);
        } else {
            window["___ScrollToBottom_" + _elemID] = null;
            if(callback){
                callback();
            }
        }
    }
    _stb();
}

export const ScrollToTop = (elemID, callback)=> {
    //防止重复进入
    if (window["___ScrollToTop_" + elemID])
        return;
    //防止互斥
    if (window["___ScrollToBottom_" + elemID])
        clearTimeout(window["___ScrollToBottom_" + elemID]);
    const _elemID = elemID;
    const elem = document.getElementById(_elemID);
    const _stb = ()=> {
        elem.scrollTop = Math.max(0,elem.scrollTop-10);
        if (elem.scrollTop != 0) {
            //设置生效,说明还有滚动的空间
            window["___ScrollToTop_" + _elemID] = setTimeout(_stb, 10);
        } else {
            window["___ScrollToTop_" + _elemID] = null;
            if (callback) {
                callback();
            }
        }
    }
    _stb();
}


const  replaceAll=(Ori, find, replace)=>{
    while (Ori.indexOf(find) != -1) {
        Ori = Ori.replace(find, replace);
    }
    return Ori;
}

export const RenderJSONTemplate=(jsonData, Data)=>{
    try {
        let StringData = JSON.stringify(jsonData);
        keys(Data).forEach(function (key) {
            StringData = replaceAll(StringData, "{"+key+"}", Data[key]);
        });
        return JSON.parse(StringData);
    } catch (er) {
        console.error(er);
        return null;
    }
}

export const params = (key, defaultvalue) => {
    window._params = {};
    var url = document.location.href;
    if (document.location.href.indexOf("#") != -1) {
        url = document.location.href.split("#").shift();
    }
    var query = url.split("?");
    if (query.length > 1) {
        query = query[1];
        var paramItems = query.split("&");
        for (var i = 0; i < paramItems.length; i++) {
            var item = paramItems[i].split("=");
            window._params[item[0]] = item[1];
        }
    }
    if (key) {
        return window._params[key] || defaultvalue;
    } else {
        return window._params
    }
}

export const  utf16toEntities=(str)=>{
    return encodeURIComponent(str);
}

export const  entitiestoUtf16=(str)=>{
    return decodeURIComponent(str);
}

export const getFormValues=(formId)=> {
    if(typeof document =="object") {
        let form = document.getElementById(formId);
        let retValue = {};
        let tagElements = form.getElementsByTagName('input');
        for (let j = 0; j < tagElements.length; j++) {
            if (tagElements[j].checked) {
                let vals = retValue[tagElements[j].name || "_default"] || [];
                retValue[tagElements[j].name || "_default"] = [...vals, tagElements[j].value]
            }
        }
        return retValue;
    }
}

export const setFormValues=(formId, values)=> {
    if (typeof document == "object") {
        let form = document.getElementById(formId);
        let retValue = {};
        let tagElements = form.getElementsByTagName('input');
        for (let j = 0; j < tagElements.length; j++) {
            tagElements[j].checked = (indexOf(values, tagElements[j].value) > -1);
        }
    }
}

export const resetFormValues=(formId)=> {
    if(typeof document =="object") {
        let form = document.getElementById(formId);
        let retValue = {};
        let tagElements = form.getElementsByTagName('input');
        for (let j = 0; j < tagElements.length; j++) {
            tagElements[j].checked = false;
        }
    }
}

