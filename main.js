import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 0, 25);
camera.lookAt(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 5);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight2.position.set(-10, -10, 5);
scene.add(directionalLight2);

const hoverLight = new THREE.PointLight(0xffd700, 0, 100);
scene.add(hoverLight);

const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 15000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = -Math.random() * 2000;
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1.5, transparent: true, opacity: 0.8 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const icosahedronGeometry = new THREE.IcosahedronGeometry(4, 1);
const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
const icosahedron = new THREE.Mesh(icosahedronGeometry, wireframeMaterial);
scene.add(icosahedron);

const crystalGeometry = new THREE.IcosahedronGeometry(2, 0);
const crystalMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff, transparent: true, opacity: 0.5, roughness: 0.1, metalness: 0.8 });
const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
scene.add(crystal);

let visionText, missionText, swagText;
const textMeshes = [];
const fontLoader = new FontLoader();

let orbitAngle = 0;
const orbitRadius = 8;
const orbitSpeed = 0.005;

fontLoader.load(
    'https://unpkg.com/three@0.157.0/examples/fonts/helvetiker_bold.typeface.json',
    (font) => {
        createTextMeshes(font);
    },
    undefined,
    (error) => {
        fontLoader.load(
            'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
            (font) => {
                createTextMeshes(font);
            }
        );
    }
);

function createTextMeshes(font) {
    const textMaterial = new THREE.MeshLambertMaterial({ color: 0x87CEEB });

    const visionString = 'Vision:\nSparking curiosity.\nShaping the next\ngeneration of\ncreators and leaders.';
    const visionGeometry = new TextGeometry(visionString, { 
        font: font, 
        size: 0.6,
        height: 0.08,
        curveSegments: 4,
        bevelEnabled: false
    });
    visionGeometry.computeBoundingBox();
    visionGeometry.center();
    
    visionText = new THREE.Mesh(visionGeometry, textMaterial.clone());
    visionText.position.set(orbitRadius, 2, 0);
    scene.add(visionText);
    textMeshes.push(visionText);

    const missionString = 'Mission:\nLearn together,\nbuild together.\nTurning ideas into\nreal-world projects.';
    const missionGeometry = new TextGeometry(missionString, { 
        font: font, 
        size: 0.6,
        height: 0.08,
        curveSegments: 4,
        bevelEnabled: false
    });
    missionGeometry.computeBoundingBox();
    missionGeometry.center();
    
    missionText = new THREE.Mesh(missionGeometry, textMaterial.clone());
    missionText.position.set(-orbitRadius, -2, 0);
    scene.add(missionText);
    textMeshes.push(missionText);

    const swagMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        emissive: 0xffd700, 
        emissiveIntensity: 0.3
    });
    const swagGeometry = new TextGeometry('SWAG', { 
        font: font, 
        size: 0.8,
        height: 0.12,
        curveSegments: 4,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.015
    });
    swagGeometry.computeBoundingBox();
    swagGeometry.center();
    
    swagText = new THREE.Mesh(swagGeometry, swagMaterial);
    swagText.position.set(0, 0, 0);
    scene.add(swagText);
    textMeshes.push(swagText);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const clock = new THREE.Clock();
let swagRotationSpeed = 0.02;
const defaultSwagSpeed = 0.02;
const hoverSwagSpeed = 0.1;

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    icosahedron.rotation.y = elapsedTime * 0.1;
    icosahedron.rotation.x = elapsedTime * 0.05;
    crystal.rotation.y = -elapsedTime * 0.3;
    crystal.rotation.x = elapsedTime * 0.2;
    
    stars.position.x = mouse.x * 2;
    stars.position.y = mouse.y * 2;

    orbitAngle += orbitSpeed;

    if (visionText && missionText && swagText) {
        const visionOrbitX = Math.cos(orbitAngle) * orbitRadius;
        const visionOrbitZ = Math.sin(orbitAngle) * orbitRadius;
        visionText.position.set(visionOrbitX, 2, visionOrbitZ);
        
        visionText.lookAt(0, 0, 0);
        visionText.rotateY(Math.PI);
        
        const missionOrbitX = Math.cos(orbitAngle + Math.PI) * orbitRadius;
        const missionOrbitZ = Math.sin(orbitAngle + Math.PI) * orbitRadius;
        missionText.position.set(missionOrbitX, -2, missionOrbitZ);
        
        missionText.lookAt(0, 0, 0);
        missionText.rotateY(Math.PI);
        
        swagText.position.y = Math.sin(elapsedTime * 2) * 0.3;
        swagText.rotation.y += swagRotationSpeed;
        swagText.rotation.x = Math.sin(elapsedTime * 1.5) * 0.1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(textMeshes);
        hoverLight.intensity = 0;
        swagRotationSpeed += (defaultSwagSpeed - swagRotationSpeed) * 0.1;

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            if (intersectedObject === swagText) {
                swagRotationSpeed = hoverSwagSpeed;
                swagText.material.emissiveIntensity = 0.5;
            } else {
                const intersectPoint = intersects[0].point;
                hoverLight.position.set(intersectPoint.x, intersectPoint.y, intersectPoint.z + 1);
                hoverLight.intensity = 3;
                
                intersectedObject.material.emissiveIntensity = 0.2;
            }
        } else {
            swagText.material.emissiveIntensity = 0.3;
            textMeshes.forEach(mesh => {
                if (mesh !== swagText && mesh.material.emissiveIntensity) {
                    mesh.material.emissiveIntensity = 0;
                }
            });
        }
    }

    renderer.render(scene, camera);
}

animate();