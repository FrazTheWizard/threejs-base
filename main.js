import * as THREE from 'three';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const gui = new GUI();

const canvas = document.querySelector('#c');

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  // alpha: true,
});

const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const scene = new THREE.Scene();


const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

let mixer
const gltfLoader = new GLTFLoader();
gltfLoader.load('./animatedBox.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);
  mixer = new THREE.AnimationMixer(model)
  const clips = gltf.animations

  const clip = THREE.AnimationClip.findByName(clips, 'wiggle')
  const action = mixer.clipAction(clip)
  action.play()
});

const clock = new THREE.Clock()

function render(time) {
  time *= 0.001;  // convert time to seconds

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  if (mixer)
  mixer.update(clock.getDelta())
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

render()

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}