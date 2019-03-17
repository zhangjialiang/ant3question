/**
 * @file xhrRequest
 * @author zhangjialiang
 * @date 2019-03-16 17:46:47
 */

let xhrRequest = (function () {
    let xhrCache = {};
    return {
        get: (url, callback) => {
            let promise = new Promise(resolve => {
                let done = data => {
                    callback(data);
                    resolve(data);
                };
                if (xhrCache[url] && xhrCache[url].done) {
                    done(xhrCache[url].res);
                } else if (xhrCache[url]) {
                    xhrCache[url].callbacks.push(() => {
                        done(xhrCache[url].res);
                    });
                } else {
                    xhrCache[url] = {done: false, callbacks: [], res: null};
                    let xhr = new XMLHttpRequest();
                    xhr.open('GET', url);
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                            xhrCache[url].res = xhr.responseText;
                            xhrCache[url].done = true;
                            done(xhrCache[url].res);
                            xhrCache[url].callbacks.forEach(item => {
                                item();
                            });
                        }
                    };
                    xhr.send();
                }
            });
            return promise;
        }
    };
})();
