// in this exercise we learn about materials
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

/**
 * @description Debug UI - lil-ui
 */
const gui = new GUI({
  width: 340,
  title: "My Debugging",
  closeFolders: false,
});

gui.hide();

const debugObject = {
  color: "#90315f",
  subdivisions: 1,
  //
  // spin: () => {},
};

const sizes = {
  // width: 800,
  width: window.innerWidth,
  // height: 600,
  height: window.innerHeight,
};

const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");

if (canvas) {
  // -------------------------------------------------------

  const scene = new THREE.Scene();

  // textures --------------------------------------------------------
  const loadingManager = new THREE.LoadingManager();
  const textureLoader = new THREE.TextureLoader(loadingManager);

  loadingManager.onError = (message) => {
    console.log({ message });
  };

  const doorColorTexture = textureLoader.load("/textures/door/basecolor.jpg");
  const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
  const doorAmbientOcclusionTexture = textureLoader.load(
    "/textures/door/ambientOcclusion.jpg"
  );
  const doorHeightTexture = textureLoader.load("/textures/door/height.png");
  const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
  const doorMetalnessTexture = textureLoader.load(
    "/textures/door/metalness.jpg"
  );
  const doorRoughnessTexture = textureLoader.load(
    "/textures/door/roughness.jpg"
  );
  //

  const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
  const gradientTexture1 = textureLoader.load("/textures/gradients/grad1.jpg");
  // this hdr file can't be loaded like this
  // const environmentMapTexture = textureLoader.load(
  // "/textures/environmentMap/vignaioli_2k.hdr"
  // );
  //
  // map textures and matcap textures neeed `sRGB` encoding
  // so we need to set colorSpace like this
  doorColorTexture.colorSpace = THREE.SRGBColorSpace;
  matcapTexture.colorSpace = THREE.SRGBColorSpace;

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  const sphereGeo = new THREE.SphereGeometry(0.5, 16, 16);
  const planeGeo = new THREE.PlaneGeometry(1, 1);
  const torusGeo = new THREE.TorusGeometry(0.3, 0.2, 16, 32);

  //
  const meshBasicMat = new THREE.MeshBasicMaterial({
    // color: debugObject.color,
    // wireframe: true,
    // map: doorColorTexture,
  });
  meshBasicMat.map = doorColorTexture;
  // meshBasicMat.color = new THREE.Color("crimson"); // needs to be color instance if you wnt to set tit this way
  // meshBasicMat.wireframe = true;
  // we need transparent for opacity, or alphaMap
  // meshBasicMat.transparent = true;
  // meshBasicMat.opacity = 0.5;
  meshBasicMat.alphaMap = doorAlphaTexture;
  // meshBasicMat.side = THREE.FrontSide;
  // meshBasicMat.side = THREE.BackSide;
  meshBasicMat.side = THREE.DoubleSide; // avoid, it takes more processing power (longer to render)

  const sphereMesh = new THREE.Mesh(sphereGeo, meshBasicMat);

  const planeMesh = new THREE.Mesh(planeGeo, meshBasicMat);

  const torusMesh = new THREE.Mesh(torusGeo, meshBasicMat);

  sphereMesh.position.x = -1.5;
  torusMesh.position.x = 1.5;

  scene.add(sphereMesh, planeMesh, torusMesh);

  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  //------------------------------------------------------------------------

  /*  const cubeTweaks = gui.addFolder("My Cube");

  cubeTweaks
    .add(cube1.position, "y")
    .min(-3)
    .max(3)
    .step(0.001)
    .name("elevation");

  cubeTweaks
    // gui
    .add(cube1, "visible");
  cubeTweaks.add(cube1.material, "wireframe");

  cubeTweaks
    // gui
    .addColor(debugObject, "color")
    .onChange((colHex: string) => {
      mat.color.set(colHex);
    })
    .name("set color");
  // ------------------------
  // @ts-ignore spin
  debugObject.spin = () => {
    gsap.to(cube1.rotation, { y: cube1.rotation.y + Math.PI * 2 });
  };
  cubeTweaks
    // gui
    .add(debugObject, "spin");
  // --------------- for changing characteristics of geometry
  cubeTweaks
    // gui
    .add(debugObject, "subdivisions")
    .min(1)
    .max(20)
    .step(1)

    .onFinishChange((subdiv: number) => {
      cube1.geometry.dispose();

      cube1.geometry = new THREE.BoxGeometry(
        1,
        1,
        1,
        debugObject.subdivisions,
        debugObject.subdivisions,
        debugObject.subdivisions
      );
    }); */
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,

    0.1,
    100
  );

  camera.position.z = 3;
  camera.position.x = 1;
  camera.position.y = 1;
  scene.add(camera);

  const axHelp = new THREE.AxesHelper(4);
  axHelp.setColors("red", "green", "blue");
  scene.add(axHelp);

  const orbit_controls = new OrbitControls(camera, canvas);
  // orbit_controls.enabled = false
  orbit_controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  // handle pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // more than 2 is unnecessary

  renderer.setSize(sizes.width, sizes.height);

  renderer.render(scene, camera);

  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // toggle debug ui on key `h`
  window.addEventListener("keydown", (e) => {
    if (e.key === "h") {
      gui.show(gui._hidden);
    }
  });

  // ------------- Animation loop ------------------
  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    sphereMesh.rotation.y = 0.1 * elapsedTime;
    planeMesh.rotation.y = 0.1 * elapsedTime;
    torusMesh.rotation.y = 0.1 * elapsedTime;

    sphereMesh.rotation.x = -0.15 * elapsedTime;
    planeMesh.rotation.x = -0.15 * elapsedTime;
    torusMesh.rotation.x = -0.15 * elapsedTime;

    // for dumping to work
    orbit_controls.update();

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
