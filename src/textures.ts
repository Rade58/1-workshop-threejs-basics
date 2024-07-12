// in this exercise we learn about textres
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
// We can place images in src folde and use url like this
// import doorBasecolorTextureSource from "./textures/door/Door_Wood_001_basecolor.jpg";
// console.log({ doorBasecolorTextureSource });
// but we are going to load them from static folder
// AT FIRST WE ARE NOT GOING TO USE TextureLoader

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
  // ------------------------------------------------------------
  // ------------------------------------------------------------
  // I'm also going to use Image class to load texture
  // AS YOU SEE WE DIDN'YT USE TextureLoader HERE
  // This is going to be used under the hood when we would use TextureLoader
  /* const doorBaseColorTextureImg = new Image();
  const doorBaseColorTexture = new THREE.Texture(doorBaseColorTextureImg);

  doorBaseColorTextureImg.onload = (e) => {
    console.log("image loaded");

    doorBaseColorTexture.needsUpdate = true;

    console.log({ doorBaseColorTexture });
  };
  // whwn this image loads, callback above gets executed
  doorBaseColorTextureImg.src = "/textures/door/Door_Wood_001_basecolor.jpg"; */
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // This next chunk of code eliminates upper boilerplate
  const loadingManager = new THREE.LoadingManager();

  /* loadingManager.onStart = () => {
    console.log("loading started");
  };
  loadingManager.onLoad = () => {
    console.log("loading finished");
  };
  loadingManager.onProgress = () => {
    console.log("loading progressed");
  };
  loadingManager.onError = (message) => {
    console.log("loading errored");
    console.log({ message });
  }; */

  // just to tell you that manger is optional, we would use manger if we would
  // have many many assets for loading
  const textureLoader = new THREE.TextureLoader(
    // optional
    loadingManager
  );

  const doorBaseColorTexture: THREE.Texture = textureLoader.load(
    "/textures/door/basecolor.jpg"
    // onLoad
    /* () => {
      //
      console.log("load");
    },
    // onProgress
    () => {
      //
      console.log("progress");
    },
    // onError
    () => {
      //
      console.log("error");
    } */
  );
  // I said if we would have many assets
  // we would even use THREE.LodingManager,to keep track of all assets loading

  // now let's load the rest of our textures
  const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
  const doorHeightTexture = textureLoader.load("/textures/door/height.png");
  const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
  const doorAmbientOcclusionTexture = textureLoader.load(
    "/textures/door/ambientOcclusion.jpg"
  );
  const doorMetalnessTexture = textureLoader.load(
    "/textures/door/metalness.jpg"
  );
  const doorRoughnessTexture = textureLoader.load(
    "/textures/door/roughness.jpg"
  );
  //

  // -------------------------------------------------------

  const scene = new THREE.Scene();
  // testing uv unwrapping (just seeing how texture looks stretche on some of geometries)
  const geo = new THREE.BoxGeometry(1, 1, 1);
  // const geo = new THREE.SphereGeometry(1, 32, 16);
  // const geo = new THREE.ConeGeometry(1, 1, 32);
  // const geo = new THREE.TorusGeometry(1, 0.35, 32, 100);
  // -------------------------------------------------------
  // LET'S SEE uv COORDINATES
  // console.log({ attributes: geo.attributes }); // it has `position` property, `normal` property and `uv` property
  console.log({ uv: geo.attributes.uv }); // look at the array and look at every two numbers
  // mentioned numbers are uv coordinat

  // testing repeat
  const myColorTexture = textureLoader.load("/textures/door/basecolor.jpg");

  // repeat i Vector2 instance
  // myColorTexture.repeat.x = 2;
  // myColorTexture.repeat.y = 2;
  //
  // myColorTexture.wrapS = THREE.RepeatWrapping;
  // myColorTexture.wrapT = THREE.RepeatWrapping;
  // myColorTexture.wrapS = THREE.MirroredRepeatWrapping;
  // myColorTexture.wrapT = THREE.MirroredRepeatWrapping;

  // myColorTexture.offset.x = 0.5;
  // myColorTexture.offset.y = 0.5;

  // myColorTexture.rotation = Math.PI / 3;
  // myColorTexture.center.x = 0.5;
  // myColorTexture.center.y = 0.5;

  myColorTexture.generateMipmaps = false;

  // myColorTexture.minFilter = THREE.NearestFilter;
  // myColorTexture.magFilter = THREE.NearestFilter;

  const mat = new THREE.MeshBasicMaterial({
    // color: "crimson",
    // color: new THREE.Color("#d7a180"),
    // color: new THREE.Color("#f44d4d"),
    // color: debugObject.color,
    // wireframe: true,
    // ----------------------------------
    // map: doorBaseColorTexture,
    // map: doorAlphaTexture,
    // map: doorHeightTexture,
    // map: doorNormalTexture,
    // map: doorAmbientOcclusionTexture,
    // map: doorMetalnessTexture,
    // map: doorRoughnessTexture,
    // ----------------------------------
    map: myColorTexture,
  });

  const cube1 = new THREE.Mesh(geo, mat);

  // -----------------------------------------------------------------------

  const cubeTweaks = gui.addFolder("My Cube");

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
    });
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  scene.add(cube1);

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

  camera.lookAt(cube1.position);

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

  // toggle debug ui on key `h`
  window.addEventListener("keydown", (e) => {
    if (e.key === "h") {
      gui.show(gui._hidden);
    }
  });

  // ------------- Animation loop ------------------
  const clock = new THREE.Clock();
  const tick = () => {
    // for dumping to work
    orbit_controls.update();

    const elapsedTime = clock.getElapsedTime();

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
