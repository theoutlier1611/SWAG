import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0.1);
camera.position.set(0, 0, 20);
camera.lookAt(0, 0, 0);

// Enhanced Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(15, 15, 10);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight2.position.set(-15, -15, 10);
scene.add(directionalLight2);

const hoverLight = new THREE.PointLight(0xffd700, 0, 150);
scene.add(hoverLight);

// Enhanced Starfield
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 8000; i++) {
    const x = (Math.random() - 0.5) * 1500;
    const y = (Math.random() - 0.5) * 1500;
    const z = -Math.random() * 1500;
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ 
    color: 0xffffff, 
    size: 2, 
    transparent: true, 
    opacity: 0.9,
    sizeAttenuation: false
});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Larger Central Objects
const icosahedronGeometry = new THREE.IcosahedronGeometry(6, 1);
const wireframeMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00ffff, 
    wireframe: true,
    transparent: true,
    opacity: 0.8
});
const icosahedron = new THREE.Mesh(icosahedronGeometry, wireframeMaterial);
scene.add(icosahedron);

const crystalGeometry = new THREE.IcosahedronGeometry(3, 0);
const crystalMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff00ff, 
    transparent: true, 
    opacity: 0.6, 
    roughness: 0.1, 
    metalness: 0.9,
    emissive: 0x330033,
    emissiveIntensity: 0.2
});
const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
scene.add(crystal);

// Text Variables
let visionText, missionText, swagText;
const textMeshes = [];
const fontLoader = new FontLoader();

let orbitAngle = 0;
const orbitRadius = 12;
const orbitSpeed = 0.003;

// Enhanced Font Loading
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
    const textMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x87CEEB,
        transparent: true,
        opacity: 0.9
    });

    // Larger Vision Text
    const visionString = 'Vision:\nSparking curiosity.\nShaping the next\ngeneration of\ncreators and leaders.';
    const visionGeometry = new TextGeometry(visionString, { 
        font: font, 
        size: 0.9,
        height: 0.12,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.01
    });
    visionGeometry.computeBoundingBox();
    visionGeometry.center();
    
    visionText = new THREE.Mesh(visionGeometry, textMaterial.clone());
    visionText.position.set(orbitRadius, 3, 0);
    scene.add(visionText);
    textMeshes.push(visionText);

    // Larger Mission Text
    const missionString = 'Mission:\nLearn together,\nbuild together.\nTurning ideas into\nreal-world projects.';
    const missionGeometry = new TextGeometry(missionString, { 
        font: font, 
        size: 0.9,
        height: 0.12,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.01
    });
    missionGeometry.computeBoundingBox();
    missionGeometry.center();
    
    missionText = new THREE.Mesh(missionGeometry, textMaterial.clone());
    missionText.position.set(-orbitRadius, -3, 0);
    scene.add(missionText);
    textMeshes.push(missionText);

    // Larger SWAG Text
    const swagMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        emissive: 0xffd700, 
        emissiveIntensity: 0.4,
        metalness: 0.8,
        roughness: 0.2
    });
    const swagGeometry = new TextGeometry('SWAG', { 
        font: font, 
        size: 1.2,
        height: 0.18,
        curveSegments: 8,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.03
    });
    swagGeometry.computeBoundingBox();
    swagGeometry.center();
    
    swagText = new THREE.Mesh(swagGeometry, swagMaterial);
    swagText.position.set(0, 0, 0);
    scene.add(swagText);
    textMeshes.push(swagText);
    
    // Add entrance animation for text (delayed until after logo reveal)
    textMeshes.forEach((mesh, index) => {
        mesh.scale.set(0, 0, 0);
        setTimeout(() => {
            animateTextEntrance(mesh);
        }, 4000 + index * 300); // Start after logo reveal
    });
}

function animateTextEntrance(textMesh) {
    const startTime = Date.now();
    const duration = 1500;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        textMesh.scale.set(easeOut, easeOut, easeOut);
        textMesh.rotation.x = (1 - easeOut) * Math.PI;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    animate();
}

// Enhanced Interactivity
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Page transition and confetti effects
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced confetti sequence - timed with logo reveal
    setTimeout(() => {
        // Initial burst when logo assembles
        confetti({
            particleCount: 100,
            spread: 60,
            origin: { y: 0.4 },
            colors: ['#ffd700', '#00ffff', '#ff00ff']
        });
    }, 2500); // When logo bursts
    
    setTimeout(() => {
        // Side bursts
        confetti({
            particleCount: 80,
            angle: 60,
            spread: 60,
            origin: { x: 0, y: 0.6 },
            colors: ['#ffd700', '#ffed4e']
        });
        confetti({
            particleCount: 80,
            angle: 120,
            spread: 60,
            origin: { x: 1, y: 0.6 },
            colors: ['#00ffff', '#87ceeb']
        });
    }, 3000);
    
    setTimeout(() => {
        // Final celebration when text appears
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.4 },
            colors: ['#ffd700', '#00ffff', '#ff00ff', '#87ceeb']
        });
    }, 4500); // When welcome text starts appearing
    
    // Logo hover effects (after reveal completes)
    setTimeout(() => {
        const logo = document.getElementById('club-logo');
        if (logo) {
            logo.addEventListener('mouseenter', () => {
                confetti({
                    particleCount: 50,
                    spread: 50,
                    origin: { x: 0.5, y: 0.3 },
                    colors: ['#ffd700', '#ffed4e']
                });
            });
        }
    }, 4000);
});

// Enhanced Animation Loop
const clock = new THREE.Clock();
let swagRotationSpeed = 0.015;
const defaultSwagSpeed = 0.015;
const hoverSwagSpeed = 0.08;

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Enhanced object rotations
    icosahedron.rotation.y = elapsedTime * 0.08;
    icosahedron.rotation.x = elapsedTime * 0.04;
    crystal.rotation.y = -elapsedTime * 0.25;
    crystal.rotation.x = elapsedTime * 0.15;
    
    // Enhanced star movement
    stars.position.x = mouse.x * 3;
    stars.position.y = mouse.y * 3;
    stars.rotation.z = elapsedTime * 0.02;

    orbitAngle += orbitSpeed;

    if (visionText && missionText && swagText) {
        // Enhanced orbiting
        const visionOrbitX = Math.cos(orbitAngle) * orbitRadius;
        const visionOrbitZ = Math.sin(orbitAngle) * orbitRadius;
        visionText.position.set(visionOrbitX, 3 + Math.sin(elapsedTime * 1.5) * 0.3, visionOrbitZ);
        
        visionText.lookAt(0, 0, 0);
        visionText.rotateY(Math.PI);
        
        const missionOrbitX = Math.cos(orbitAngle + Math.PI) * orbitRadius;
        const missionOrbitZ = Math.sin(orbitAngle + Math.PI) * orbitRadius;
        missionText.position.set(missionOrbitX, -3 + Math.sin(elapsedTime * 1.3) * 0.3, missionOrbitZ);
        
        missionText.lookAt(0, 0, 0);
        missionText.rotateY(Math.PI);
        
        // Enhanced SWAG animation
        swagText.position.y = Math.sin(elapsedTime * 1.8) * 0.4;
        swagText.rotation.y += swagRotationSpeed;
        swagText.rotation.x = Math.sin(elapsedTime * 1.2) * 0.08;
        swagText.rotation.z = Math.cos(elapsedTime * 0.8) * 0.05;

        // Enhanced interactivity
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(textMeshes);
        hoverLight.intensity = 0;
        swagRotationSpeed += (defaultSwagSpeed - swagRotationSpeed) * 0.08;

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            if (intersectedObject === swagText) {
                swagRotationSpeed = hoverSwagSpeed;
                swagText.material.emissiveIntensity = 0.6;
                swagText.scale.set(1.05, 1.05, 1.05);
            } else {
                const intersectPoint = intersects[0].point;
                hoverLight.position.set(intersectPoint.x, intersectPoint.y, intersectPoint.z + 2);
                hoverLight.intensity = 5;
                
                intersectedObject.material.emissiveIntensity = 0.3;
                intersectedObject.scale.set(1.02, 1.02, 1.02);
            }
        } else {
            swagText.material.emissiveIntensity = 0.4;
            swagText.scale.set(1, 1, 1);
            textMeshes.forEach(mesh => {
                if (mesh !== swagText) {
                    mesh.material.emissiveIntensity = 0;
                    mesh.scale.set(1, 1, 1);
                }
            });
        }
    }

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', handleResize);

function handleResize() {
    // Update camera aspect ratio for 3D scene
    if (camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    
    // Update renderer size
    if (renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Adjust UI elements based on viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const aspectRatio = vw / vh;
    
    // Handle ultra-wide screens
    if (aspectRatio > 2.5) {
        document.body.classList.add('ultra-wide');
    } else {
        document.body.classList.remove('ultra-wide');
    }
    
    // Handle portrait orientation
    if (aspectRatio < 0.75) {
        document.body.classList.add('portrait');
    } else {
        document.body.classList.remove('portrait');
    }
}

// Call on load
document.addEventListener('DOMContentLoaded', handleResize);

animate();