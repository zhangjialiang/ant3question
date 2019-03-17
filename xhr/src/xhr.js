/**
 * @file xhr
 * @author zhangjialiang
 * @date 2019-03-16 17:46:47
 */

(function (global) {
    const xhrCaches = {};
    const cacheItems = ['response', 'responseText', 'responseURL', 'responseTpe',
        'responseXML', 'status', 'statusText', 'readyState'];
    global.originXMLHttpRequest = global.XMLHttpRequest || window.XMLHttpRequest;
    class FakeXHR extends global.originXMLHttpRequest {
        open(...args) {
            this.method = args[0].toUpperCase();
            this.url = args[1];
            super.open(...args);
        }
        send(data) {
            function cloneValue(xhr, cache) {
                Object.keys(cache).forEach(key => {
                    Object.defineProperty(xhr, key, {
                        enumerable: false,
                        configurable: false,
                        writable: false,
                        value: cache[key]
                    });
                });
            }
            if (this.method === 'GET') {
                let me = this;
                if (xhrCaches[this.url]) {
                    if (xhrCaches[this.url].done) {
                        cloneValue(me, xhrCaches[this.url].res);
                        me.onreadystatechange();
                    } else {
                        xhrCaches[this.url].callbacks.push(() => {
                            cloneValue(me, xhrCaches[me.url].res);
                            me.onreadystatechange();
                        });
                    }
                } else {
                    let stateChangeHandler = this.onreadystatechange;
                    xhrCaches[this.url] = {callbacks: [], done: false, res: {}};
                    this.onreadystatechange = function () {
                        if (
                            me.readyState  === global.originXMLHttpRequest.DONE && me.status === 200
                        ) {
                            xhrCaches[me.url].done = true;
                            cacheItems.forEach(item => {
                                xhrCaches[me.url].res[item] = me[item];
                            });
                            xhrCaches[me.url].callbacks.forEach(callback => {
                                callback();
                            });
                        }
                        stateChangeHandler();
                    };
                    super.send(data);
                }
            } else {
                super.send(data);
            }
        }
    }
    global.XMLHttpRequest = FakeXHR;
})(window);
