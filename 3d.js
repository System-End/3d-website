import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Orbit controls for interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lights
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(5, 5, 5);
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x4fc3f7, 0.3);
fillLight.position.set(-5, 0, -5);
scene.add(fillLight);

const protogen = new THREE.Group();

// Materials
const bodyMaterial = new THREE.MeshStandardMaterial({
  color: 0x2d2d2d,
  metalness: 0.7,
  roughness: 0.3,
});

const accentMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  metalness: 0.8,
  roughness: 0.2,
});

const glowMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  emissive: 0x00ffff,
  emissiveIntensity: 0.8,
  metalness: 0.3,
  roughness: 0.4,
});

const visorMaterial = new THREE.MeshStandardMaterial({
  color: 0x001a1a,
  emissive: 0x003333,
  emissiveIntensity: 0.3,
  metalness: 0.9,
  roughness: 0.1,
  transparent: true,
  opacity: 0.9,
});

// HEAD
const headGeometry = new THREE.BoxGeometry(2, 1.8, 2);
const head = new THREE.Mesh(headGeometry, bodyMaterial);
head.position.y = 0;
protogen.add(head);

const snoutGeometry = new THREE.BoxGeometry(1.4, 0.8, 1.2);
const snout = new THREE.Mesh(snoutGeometry, bodyMaterial);
snout.position.set(0, -0.3, 1.2);
protogen.add(snout);

// Snout tip
const snoutTipGeometry = new THREE.BoxGeometry(1.0, 0.5, 0.4);
const snoutTip = new THREE.Mesh(snoutTipGeometry, bodyMaterial);
snoutTip.position.set(0, -0.35, 1.9);
protogen.add(snoutTip);

// VISOR
const visorGeometry = new THREE.BoxGeometry(1.8, 1.2, 0.1);
const visor = new THREE.Mesh(visorGeometry, visorMaterial);
visor.position.set(0, 0.1, 1.05);
protogen.add(visor);

// Visor frame
const visorFrameShape = new THREE.Shape();
visorFrameShape.moveTo(-1, -0.7);
visorFrameShape.lineTo(1, -0.7);
visorFrameShape.lineTo(1, 0.7);
visorFrameShape.lineTo(-1, 0.7);
visorFrameShape.lineTo(-1, -0.7);

const visorHole = new THREE.Path();
visorHole.moveTo(-0.85, -0.55);
visorHole.lineTo(0.85, -0.55);
visorHole.lineTo(0.85, 0.55);
visorHole.lineTo(-0.85, 0.55);
visorHole.lineTo(-0.85, -0.55);
visorFrameShape.holes.push(visorHole);

const visorFrameGeometry = new THREE.ExtrudeGeometry(visorFrameShape, {
  depth: 0.15,
  bevelEnabled: false,
});
const visorFrame = new THREE.Mesh(visorFrameGeometry, accentMaterial);
visorFrame.position.set(0, 0.1, 1.0);
protogen.add(visorFrame);

// VISOR DISPLAY
const eyeGroup = new THREE.Group();

// Left eye
const leftEyeShape = new THREE.Shape();
leftEyeShape.moveTo(-0.5, 0);
leftEyeShape.lineTo(-0.2, 0.25);
leftEyeShape.lineTo(-0.2, 0.15);
leftEyeShape.lineTo(-0.35, 0);
leftEyeShape.lineTo(-0.2, -0.15);
leftEyeShape.lineTo(-0.2, -0.25);
leftEyeShape.lineTo(-0.5, 0);

const leftEyeGeometry = new THREE.ShapeGeometry(leftEyeShape);
const leftEye = new THREE.Mesh(leftEyeGeometry, glowMaterial);
leftEye.position.set(-0.25, 0.15, 1.12);
eyeGroup.add(leftEye);

// Right eye
const rightEyeShape = new THREE.Shape();
rightEyeShape.moveTo(0.5, 0);
rightEyeShape.lineTo(0.2, 0.25);
rightEyeShape.lineTo(0.2, 0.15);
rightEyeShape.lineTo(0.35, 0);
rightEyeShape.lineTo(0.2, -0.15);
rightEyeShape.lineTo(0.2, -0.25);
rightEyeShape.lineTo(0.5, 0);

const rightEyeGeometry = new THREE.ShapeGeometry(rightEyeShape);
const rightEye = new THREE.Mesh(rightEyeGeometry, glowMaterial);
rightEye.position.set(0.25, 0.15, 1.12);
eyeGroup.add(rightEye);

protogen.add(eyeGroup);

//  EARS
function createEar(isLeft) {
  const earGroup = new THREE.Group();

  // Main ear
  const earShape = new THREE.Shape();
  earShape.moveTo(0, 0);
  earShape.lineTo(0.4, 0);
  earShape.lineTo(0.2, 1.0);
  earShape.lineTo(0, 0);

  const earGeometry = new THREE.ExtrudeGeometry(earShape, {
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
  });

  const ear = new THREE.Mesh(earGeometry, bodyMaterial);
  earGroup.add(ear);

  // Inner ear glow
  const innerEarShape = new THREE.Shape();
  innerEarShape.moveTo(0.1, 0.15);
  innerEarShape.lineTo(0.3, 0.15);
  innerEarShape.lineTo(0.2, 0.7);
  innerEarShape.lineTo(0.1, 0.15);

  const innerEarGeometry = new THREE.ShapeGeometry(innerEarShape);
  const innerEar = new THREE.Mesh(innerEarGeometry, glowMaterial);
  innerEar.position.z = 0.31;
  earGroup.add(innerEar);

  const xPos = isLeft ? -0.9 : 0.5;
  earGroup.position.set(xPos, 0.7, -0.3);
  earGroup.rotation.x = -0.3;
  earGroup.rotation.z = isLeft ? 0.2 : -0.2;

  return earGroup;
}

protogen.add(createEar(true));
protogen.add(createEar(false));

// NECK
const neckGeometry = new THREE.CylinderGeometry(0.6, 0.7, 0.8, 8);
const neck = new THREE.Mesh(neckGeometry, bodyMaterial);
neck.position.set(0, -1.2, 0);
protogen.add(neck);

for (let i = 0; i < 3; i++) {
  const ringGeometry = new THREE.TorusGeometry(0.65, 0.03, 8, 32);
  const ring = new THREE.Mesh(ringGeometry, glowMaterial);
  ring.position.set(0, -0.95 - i * 0.2, 0);
  ring.rotation.x = Math.PI / 2;
  protogen.add(ring);
}

// CHEEK ACCENTS
const cheekGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.6);
const leftCheek = new THREE.Mesh(cheekGeometry, glowMaterial);
leftCheek.position.set(-1.05, 0, 0.5);
protogen.add(leftCheek);

const rightCheek = new THREE.Mesh(cheekGeometry, glowMaterial);
rightCheek.position.set(1.05, 0, 0.5);
protogen.add(rightCheek);

scene.add(protogen);

camera.position.set(0, 0, 5);
controls.update();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.016;

  protogen.position.y = Math.sin(time * 0.5) * 0.1;
  protogen.rotation.y = Math.sin(time * 0.3) * 0.1;

  const pulse = 0.6 + Math.sin(time * 2) * 0.3;
  glowMaterial.emissiveIntensity = pulse;

  controls.update();
  renderer.render(scene, camera);
}

animate();

console.log("Protogen loaded! Drag to rotate, scroll to zoom.");
