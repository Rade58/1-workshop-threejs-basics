// in this practice we learn about full sccreen and resizing
// we will also handle pixel ratio
import * as THREE from "three";
// alys install gsap@3.5.1
// import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const sizes = {
  // width: 800,
  width: window.innerWidth,
  // height: 600,
  height: window.innerHeight,
};

/* const cursor = {
  x: 0,
  y: 0,
}; */

/**
 * @description getting coordintes of the cursor
 */
/* window.addEventListener("mousemove", (e: MouseEvent) => {
  // console.log("x -> ", e.x, " y -> ", e.y);
  // console.log("x -> ", e.clientX, " y -> ", e.clientY);
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
}); */

const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");

if (canvas) {
  const scene = new THREE.Scene();
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshBasicMaterial({
    color: "crimson",
  });

  const cube1 = new THREE.Mesh(geo, mat);

  scene.add(cube1);

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    // play with near and far to see what effect will produce
    0.1, // increase this it might cut the mesh camera is looking at
    100
  );

  camera.position.z = 3;
  scene.add(camera);

  camera.lookAt(cube1.position);

  const axHelp = new THREE.AxesHelper(4);
  axHelp.setColors("red", "green", "blue");
  scene.add(axHelp);

  const orbit_controls = new OrbitControls(camera, canvas);
  // orbit_controls.enabled = false;
  orbit_controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  // handle pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // more than 2 is unnecessary

  renderer.setSize(sizes.width, sizes.height);

  renderer.render(scene, camera);

  // ------------- Animation ------------------
  const clock = new THREE.Clock();
  const tick = () => {
    // for dumping to work
    orbit_controls.update();

    // never forget this at th end of the frame,
    // without this nothing would change
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();

  // ------------------------------------------------------
  // --------------- handle resize ------------------------
  window.addEventListener("resize", (e) => {
    console.log("resizing");
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // if you move screen to the
    //                                                                monitor with different pixel ratio
    //                                                                we ensure to have consistent value
    // renderer.render(scene, camera); // we don't need to do this here
  });

  // ------------------------------------------------------
  // ----------------- enter fulll screen with double click

  window.addEventListener("dblclick", () => {
    console.log("double click");

    // handling safari
    const fullscreenElement =
      // @ts-ignore webkit
      document.fullscreenElement || document.webkitFullScreenElement;
    //

    // if (!document.fullscreenElement) {
    if (!fullscreenElement) {
      if (canvas.requestFullscreen) {
        // go fullscreen
        canvas.requestFullscreen();

        // @ts-ignore webkit
      } else if (canvas.webkitRequestFullScreen) {
        // @ts-ignore webkit
        canvas.webkitRequestFullScreen();
      }
    } else {
      // leave fullscreen
      // document.exitFullscreen();
      // @ts-ignore
      if (document.exitFullscreen) {
        document.exitFullscreen();

        // @ts-ignore webkit
      } else if (document.webkitExitFullscreen) {
        // @ts-ignore webkit
        document.webkitExitFullscreen();
      }
    }
  });
}
