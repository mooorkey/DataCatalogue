import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const td_schema_container = document.getElementById("3d-schema-container");
let render_width = window.innerWidth / 1.2;
let render_height = window.innerHeight / 1.2;

const gui = new dat.GUI();
var obj = {
  add: function () {
    console.log("clicked");
  },
};

gui.add(obj, "add");
const options = {
  showWireframe: false,
};
gui
  .add(options, "showWireframe")
  .onChange(function () {
    console.log("showWireframe state changed to " + options.showWireframe);
    if (options.showWireframe === true) {
      material.wireframe = true;
    } else {
      material.wireframe = false;
    }
  })
  .name("Show Wireframe");

// Initialize scene, camera and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7f8287);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(render_width, render_height);
let render_obj = renderer.domElement;
td_schema_container.appendChild(render_obj);

// Orbital Control
const orbitalController = new OrbitControls(camera, render_obj);
orbitalController.update();

// Create a  test box model
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", function () {
  // update the size of the renderer to match the new size of the window
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);

  // update the camera aspect ratio to match the new aspect ratio of the renderer
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
