Physijs.scripts.worker = 'libs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var scene, camera, renderer;

var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;

function init() {
    
    
    scene = new Physijs.Scene();
    this.scene.setGravity(new THREE.Vector3(0, -22, 0));
    
    initMesh();
    initCamera();    
    initLights();
    initRenderer();    
    //initCube();
    
    document.body.appendChild(renderer.domElement);
}

function initLights() {
    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
}


function initCamera() {
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 30);
    camera.position.set(0, 0, 15);
    camera.lookAt(scene.position);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
}

var mesh = null;
function initMesh() {
    var mtlLoader = new THREE.MTLLoader()
    mtlLoader.load("assets/blockCornerLarge.mtl", function(materials){
        console.log(materials)
        materials.preload()

        var objLoader = new THREE.OBJLoader()
        objLoader.setMaterials(materials)

        objLoader.load("assets/blockCornerLarge.obj", function(obj){
            console.log(obj)
            let temp = new Physijs.BoxMesh(obj)
            scene.add(temp)
            mesh = obj
        })
    })
}

var SPEED = 0.01;

function rotateMesh() {
    if (!mesh) {
        return;
    }

    mesh.rotation.x -= SPEED * 2;
    mesh.rotation.y -= SPEED;
    mesh.rotation.z -= SPEED * 3;
}

function initCube() {
    cube = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 2), new THREE.MeshNormalMaterial());
    scene.add(cube);
}

function rotateCube() {
    cube.rotation.x -= SPEED * 2;
    cube.rotation.y -= SPEED;
    cube.rotation.z -= SPEED * 3;
}

function render() {
    requestAnimationFrame(render);
    // rotateCube();
    // rotateMesh();
    renderer.render(scene, camera);
}


init();
render();
