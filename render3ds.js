import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRAColoader.js";

// var model_path = "assets/shiba/scene.gltf";
// var model_path2 = "assets/milk_delivery/scene.gltf";

const td_schema_container = document.getElementById("3d-schema-container");
// let render_width = 400;
// let render_height = 400;
let render_width = window.innerWidth / 1.2;
let render_height = window.innerHeight / 1.2;
var model;

const gui = new dat.GUI();
// Model Selector
var modelPaths = [
  "assets/shiba/scene.gltf",
  "assets/milk_delivery/scene.gltf",
  "assets/9-20385-Lower Mould Support Seamless.glb",
  "assets/9-20539-Lower Mould Seamless End -Ver.4.glb",
];
var selectedModelPath = modelPaths[0];
var modelFolder = gui.addFolder("Model");
var modelSelect = modelFolder.add(
  { model: selectedModelPath },
  "model",
  modelPaths
);
modelSelect.onChange(function (value) {
  selectedModelPath = value;
  loadModel(selectedModelPath);
});

// Color
var color_controls = {
  overrideColor: false,
  color: "#ff0000",
};

var material = new THREE.MeshStandardMaterial({
  color: color_controls.color, // red color
  metalness: 0.5, // metalness value
  roughness: 0.5, // roughness value
});

var ambientLight = new THREE.AmbientLight(0xffffff, 0);
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

var colorFolder = gui.addFolder("Color");
colorFolder
  .add(color_controls, "overrideColor")
  .name("Override Color")
  .onChange(function () {
    if (color_controls.overrideColor) {
      model.traverse(function (child) {
        if (child.isMesh) {
          child.material = material;
        }
      });
    } else {
      loadModel(selectedModelPath)
    }
  });
colorFolder.addColor(color_controls, "color").onChange(function (value) {
  material.color.set(value);
});

colorFolder.add(material, "metalness", 0, 3).name("Metalness");
colorFolder.add(material, "roughness", 0, 1).name("Roughness");
colorFolder
  .add(ambientLight, "intensity", 0, 10)
  .name("Ambient light intensity");
colorFolder
  .add(directionalLight, "intensity", 0, 10)
  .name("Directional light intensity");

// Rotations
var obj = {
  rotRst: function () {
    model.rotation.x = 0;
    model.rotation.y = 0;
    model.rotation.z = 0;
    console.log();
  },
};

const options = {
  Rotations: false,
};

var Rotation_folder = gui.addFolder("Rotation");
var Rotation_Speed = { x_speed: 0, y_speed: 0, z_speed: 0 };
Rotation_folder.add(options, "Rotations")
  .onChange(function () {
    console.log("Rotations state changed to " + options.Rotations);
  })
  .name("Rotations");
Rotation_folder.add(Rotation_Speed, "x_speed", 0, 100).name("X rotation speed");
Rotation_folder.add(Rotation_Speed, "y_speed", 0, 100).name("Y rotation speed");
Rotation_folder.add(Rotation_Speed, "z_speed", 0, 100).name("Z rotation speed");
Rotation_folder.add(obj, "rotRst").name("Reset Rotations");

// Initialize scene, camera and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7f8287);
const camera = new THREE.PerspectiveCamera(
  75,
  render_width / render_height,
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

// Loading the 3d model
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
loader.setDRACOLoader(dracoLoader);

function loadModel(path) {
  loader.load(
    path,
    function (gltf) {
      // Remove any existing models from the scene
      scene.remove(scene.getObjectByName("model"));

      model = gltf.scene;
      model.name = "model";

      // model.traverse(function (child) {
      //   if (child.isMesh) {
      //     child.material = material;
      //   }
      // });

      // Add the loaded model to the scene
      console.log(model);
      scene.add(model);
      scene.add(ambientLight);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      model.castShadow = true;
      model.receiveShadow = true;
    },
    function (xhr) {
      // Progress callback
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      // Error callback
      console.error("Error loading GLTF model", error);
    }
  );
}

loadModel(selectedModelPath);

// Axes
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  if (model != null && options.Rotations) {
    let spd_factor = 1000;
    model.rotation.y += Rotation_Speed.x_speed / spd_factor;
    model.rotation.x += Rotation_Speed.y_speed / spd_factor;
    model.rotation.z += Rotation_Speed.z_speed / spd_factor;
  }

  updateDirectionalLight();
  renderer.render(scene, camera);
}

function updateDirectionalLight() {
  // Get the user's position
  var position = new THREE.Vector3();
  camera.getWorldPosition(position);
  // Set the position of the directional light based on the user's position
  directionalLight.position.copy(position);
}

animate();
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  // Update camera aspect ratio and renderer size
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth / 1.2, window.innerHeight / 1.2);
}
