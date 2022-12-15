import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* # Creating the movie scene (STEP 1) 🎭
To actually be able to display anything with three.js, we need three things: scene, camera and renderer, so that we can render the scene with camera. */
const scene = new THREE.Scene();

/* # Instantiate a `SphereGeometry` instance (STEP 2) 📦
A `geometry` we provide is essentially just the shape. The geometry is created by sweeping and calculating vertexes around the Y axis (horizontal sweep) & Z axis (vertical sweep). Think of this as molding clay into a shape.
> https://threejs.org/docs/#api/en/geometries/SphereGeometry */
const geometry = new THREE.SphereGeometry(3, 64, 32);
// That excludes `material` like color, light, reflection etc...
const material = new THREE.MeshStandardMaterial({ color: "#00ff83" });
// Lastly, the combination of geometry and material is our `mesh`:
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/* # Light is required to see something on your scene (STEP 5) 🔦
`PointLight` a light that gets emitted from a single point in all  directions. A common use case for this is to replicate light emitted from a bare lightbulb.
This light can cast shadows - see PointLightShadow page for details. */
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10); // this is the x, y, z position of the light
scene.add(light);

/* # We setup the scene, but we need the camera (STEP 3) 🎥
A few different cameras in three.js but `PerspectiveCamera` is the most popular.
The first attribute is the field of view. "FOV" is the extent of the scene that is seen on the display at any given moment. The value is in degrees. Generally `45` degrees is a good value and anything above `50` does not look ideal. That leads to distortion on the sides of the visible scene, like fish eye view. The wider the camera focal length, that is usually more distortion.

The second one is the aspect ratio. You almost always want to use the width of the element divided by the height, or you'll get the same result as when you play old movies on a widescreen TV - the image looks squished. The next two attributes are the near and far clipping plane. What that means, is that objects further away from the camera than the value of far or closer than near won't be rendered. You don't have to worry about this now, but you may want to use other values in your apps to get better performance.
https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height, // 📐
  0.1,
  100
);
camera.position.z = 20; // distance from camera
scene.add(camera);

/* # Next up is the `renderer` (STEP 4) 🎬
This is where the magic happens. In addition to the WebGLRenderer we use here, three.js comes with a few others, often used as fallbacks for users with older browsers that don't have WebGL support. After creating the`renderer` instance, we also need to set the size at which we want it to render our app. It's a good idea to use the width and height of the area we want to fill with our app - in this case, the the browser window. For performance intensive apps, you can also give setSize smaller values `window.innerWidth/2` and `window.innerHeight/2`, which will make the app render at quarter size. */
const canvas = document.getElementById("webgl");
/* A canvas where the renderer draws its output. Corresponds to the domElement property below. If not passed in here, a new canvas element will be created.*/
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(4);
renderer.render(scene, camera);

/* `OrbitControls` 🕹️ (STEP 6)
Orbit controls allow the camera to orbit around a target. To use this, as with all files in the `/examples` directory, include file separately in your HTML. */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 2;

// TODO: here we resize any space according to window resize event changes and we also keep updating our controls with a recursive callback called `animate`.
window.addEventListener("resize", () => {
  // Update our sizes object:
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update camera position and aspect ratio:
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});
function animate() {
  /* The `requestAnimationFrame` method tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint. You should call this method whenever you're ready to update your animation onscreen. This will request that your animation function be called before the browser performs the next repaint. The callback method is passed a single argument. */
  window.requestAnimationFrame(animate);
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();
  renderer.render(scene, camera);
}
animate();

// GSAP: timeline next
