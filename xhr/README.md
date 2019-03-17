### 简介    
实现了基于 XMLHttpRequest 的缓存模块。分别通过原型改造 [src/xhr.js](./src/xhr.js) 和包装 [src/request.js](./src/request.js) 实现了两种方式。前者无需对原有的 xhr 请求做任何处理，就可以实现 get 请求的缓存；后者则要修改原有的 ajax 请求方式。 但是前者如果不讲 FakeXHR 放入到闭包中，就会修改全局的 XHR，如果页面上有其他人开发的模块，则可能会留坑。后者如果页面中的网络请求都是调用同一的模块，那么也只需修改一次。

### 方案    
1. FakeXHR    
重写 `open`，`send` 和 `onreadystatechange` 函数。在 `send` 的时候判断是否有缓存可以直接用，有的话则将缓存中 `reponse,reponseType...` 等与返回值有关的值取出，写到 xhr 实例上，由于 xhr 中 reponse 等值是只写的，因此需要使用 `defineProperty` 的当时写入；如果是已有相同请求在运行中，则将回调置入缓存中回调队列中；如果是第一次请求，则走正常的 XHR 请求方式，然后将返回的值写入缓存。

2. request    
新写一个 request 函数，内部会使用 xhr 的请求方式。调用时判断是否有缓存，逻辑与 fakeXHR 基本类似。