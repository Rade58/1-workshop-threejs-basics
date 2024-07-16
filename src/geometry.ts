// Geometry

// one vertex can have
// - position
// - uv coordinates
// - normal
// can also have what ever you wnt like `Color`, random values
// you can have info about `size of the particle` (we will do this but much later)

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
  // const geo = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
  const mat = new THREE.MeshBasicMaterial({
    color: "crimson",
    wireframe: true,
  });

  // const cube1 = new THREE.Mesh(geo, mat);

  // scene.add(cube1);

  // --------------------------------------------------------------
  // Playing around with `BufferGeometry`
  const positionsArray = new Float32Array(12); // length of 12
  /* const positionsArray = new Float32Array([  // or we can provide array in constructor
      0, 0, 0,
      0, 1, 0,
      1, 0, 0,
      1, 0 ,1
  ]); */

  // for verice 0
  positionsArray[0] = 1;
  positionsArray[1] = 0;
  positionsArray[2] = 0;

  // for verice 1
  positionsArray[3] = 0;
  positionsArray[4] = 1;
  positionsArray[5] = 0;

  // for verice 2
  positionsArray[6] = 0;
  positionsArray[7] = 0;
  positionsArray[8] = 0;

  // for verice 3
  positionsArray[6] = 0;
  positionsArray[7] = 0;
  positionsArray[8] = 1;

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // number 3, in our case represent number of coordintes that form
  // one vertex,
  // I guess it is saying that every 3 dots need to be computed
  const positionAttribute = new THREE.BufferAttribute(positionsArray, 3);

  //
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", positionAttribute);

  // faces
  const faces = new Uint16Array([
    // first face is build from verices: 0 , 1, 2
    0, 1, 2,
    //
    3, 1, 2,
    //
    0, 3, 2,
  ]);

  // not sure what 1 represent here, but it works
  // no matter what number I defne
  geometry.setIndex(new THREE.BufferAttribute(faces, 1));

  geometry.computeVertexNormals();

  const mesh1 = new THREE.Mesh(geometry, mat);

  // scene.add(mesh1);
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // ---------------- Rendering bunch of random triangles ---------------
  const buGeo = new THREE.BufferGeometry();

  // const count = 650;
  const count = 50;

  const posArray = new Float32Array(count * 3 * 3); // ensuring we will have value that is
  //                                                        devidable by 3
  //                                                  3 vertices * 3 dots

  for (let i = 0; i < count * 3 * 3; i++) {
    // making sure ve did 3 * 3
    posArray[i] = (Math.random() - 0.5) * 4;
  }

  const posAttr = new THREE.BufferAttribute(posArray, 3);
  buGeo.setAttribute("position", posAttr);

  const trianglesMesh = new THREE.Mesh(buGeo, mat);

  scene.add(trianglesMesh);

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    // play with near and far to see what effect will produce
    0.1, // increase this it might cut the mesh camera is looking at
    100
  );

  camera.position.z = 3;
  scene.add(camera);

  // camera.lookAt(cube1.position);

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

    if (!fullscreenElement) {
      if (canvas.requestFullscreen) {
        canvas.requestFullscreen();

        // @ts-ignore webkit
      } else if (canvas.webkitRequestFullScreen) {
        // @ts-ignore webkit
        canvas.webkitRequestFullScreen();
      }
    } else {
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
