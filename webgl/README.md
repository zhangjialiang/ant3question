### 思路
根据简单的镜面反射的知识，镜子上显示的图像，可以看做观察者在镜子所在平面的镜像位置观察物体的画面。也就是摄像机以镜子平面做镜像位置计算，然后在该位置设置一个相机观察场景，观察到的场景就是镜面上该显示的内容。    
然后将该内容作为纹理绘制到镜子所在平面上，即能看到镜子效果。

### 伪代码
以下描述了实现的主要步骤。
1. 首先进行初始化    
```
let renderer = new THREE.WebGLRenderer();
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
camera.position.set( x,y,z );
document.getElementById( 'container' ).appendChild( renderer.domElement );
```
2. 绘制场景中的一些元素    
```
// 增加一个正方体
let geometry = new THREE.CubeGeometry(20, 20, 20, 10, 10, 10);
let material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x444444 } );
let cube = new THREE.Mesh( geometry, material );
scene.add(cube);

// 增加一面镜子
let mirror = new Mirror(render, camera);
let plane = new new THREE.PlaneGeometry( 100, 100 );
let mirrorMesh = new THREE.Mesh( plane, mirror.material );
scene.add(mirrorMesh);

// 设置灯光
var mainLight = new THREE.PointLight( 0xcccccc, 1.5, 250 );
mainLight.position.y = 60;
scene.add( mainLight );
```
3.渲染。渲染主要包含两步，第一步是将根据镜像位置观察的结果作为纹理渲染到镜子面上。第二部是渲染主场景。
```
mirror.render();
renderer.render(scene, camera);
```

下面描述下镜子对象的伪代码和其渲染的伪代码
```
Mirror = function(renderer, camera) {
    // 初始化镜子对象的一些变量
    this.mirrorPosition = [0,0,0];
    this.mirrorCameraPosition = [0,0,0];
    this.material = new ShaderMaterial(shader);
    // 将镜子相机观察的世界渲染到 renderTarget 上
    this.renderTarget = new WebGLRenderTarget();
    // 然后将镜子所属平面的材质纹理置为渲染结果。该处需要写个着色器绘制
    this.material.texture = this.renderTarget.texture;
}

Mirror.prototype.render = function () {
    // 获取世界相机位置
    updateMatrixWorld();
    // 然后获取镜子的位置和镜子中相机的位置
    getMirrorPositionFromWorldMatrix();
    getCameraPositionFromWorldMatrix();
    // 更新投影矩阵，这时就能渲染出正确的镜子相机观察结果。
    updateProjectionMatrix();
    // 通过镜子的camera，将观察到的主场景渲染到纹理
    this.renderer.render(scene, this.mirrorCamera, this.texture)
}
```