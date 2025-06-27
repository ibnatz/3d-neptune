import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import neptuneTexture from '../img/neptune.jpg';
import neptuneringsTexture from '../img/neptunerings.png';
import starsTexture from '../img/stars.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90, 140, 140);
orbit.update();

const cubeTextureLoader = new THREE.CubeTextureLoader();
const backgroundTexture = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
]);
scene.background = backgroundTexture;

const textureLoader = new THREE.TextureLoader();


const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(-50, 50, 50);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);


const pointLight = new THREE.PointLight(0xffffff, 0.8, 500);
pointLight.position.set(100, 100, 100);
scene.add(pointLight);

function createPlanete(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 64, 64);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture),
        
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);

    if(ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            64);
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        
        ringMesh.position.set(0, 0, 0);
        ringMesh.rotation.x = -0.5 * Math.PI;
    }

    scene.add(obj);
    obj.position.x = position;
    return {mesh, obj}
}

const neptuneWithRings = createPlanete(16, neptuneTexture, 138, {
    innerRadius: 18,
    outerRadius: 28,
    texture: neptuneringsTexture
});

const neptuneOrbit = new THREE.Object3D();

neptuneOrbit.add(neptuneWithRings.obj);
scene.add(neptuneOrbit);

function animate() {
    neptuneOrbit.rotateY(0.002);
    neptuneWithRings.obj.rotateY(0.004);
    renderer.render(scene, camera); 
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});