import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7f8287);

// Load the GLTF file
const loader = new GLTFLoader();
loader.load(
  'path/to/model.gltf',
  function (gltf) {
    // Add the loaded model to the scene
    scene.add(gltf.scene);
  },
  function (xhr) {
    // Progress callback
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    // Error callback
    console.error('Error loading GLTF model', error);
  }
);

// Render the scene
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();