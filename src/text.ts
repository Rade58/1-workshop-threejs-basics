// in this exercise we learn about materials
import * as THREE from "three";
import { FontLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import gsap from "gsap";
import GUI from "lil-gui";

// WE FIND FONT (AND MAKE SURE WE HAVE A LICENCE)
// WE THAN CONVER IT WITH https://gero3.github.io/facetype.js/ TO TYPEFACE

// BUT NOW WE WILL DO SOMETHING ELSE
// we can use typeface font like this (WE HVE CERTAIN FONTS AVAILBLE TO US IN three/examples/fonts)
// import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";

// or we go to node_modules and we copy font with LICENCE to our /static folder
// WE ARE JUST PRACTICING HOW WE WOULD USE FONT THAT WE HAVE LICENCE FOR
// AND HOW TO USE IT IN OUR PROJECT

/**
 * @description Debug UI - lil-ui
 */
const gui = new GUI({
  width: 340,
  title: "My Debugging",
  closeFolders: false,
});

gui.hide(); //

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

  // LOADING THE FONT --------------------------------------------------------

  const fontLoader = new FontLoader();

  fontLoader.load("/fonts/gentilis_regular.typeface.json", (myFont) => {
    console.log("font loaded");

    const textGeometry = new TextGeometry("Hello Rade.js", {
      font: myFont,
      size: 0.5,
      // height: 0.2,// deprecated, ude depth
      depth: 0.2,
      // curveSegments: 12,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      // bevelSegments: 5,
      bevelSegments: 4,
    });

    // for centering geometry to the middle of the scene
    textGeometry.computeBoundingBox(); // sphereBounding is used by default, but we want box bounding
    console.log(textGeometry.boundingBox); // invisible Box3 instance (just math (coordinates))
    if (textGeometry.boundingBox) {
      // this is the way but not the esiest
      // instead of moving mesh we will move geometry
      /*  textGeometry.translate(
        // translate is hee because TextGeometry is also BufferGeometry
        -(textGeometry.boundingBox.max.x - 0.03) * 0.5, // 0.5 is half, and other number is bevelThicknes
        -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
        -(textGeometry.boundingBox.max.z - 0.03) * 0.5
      ); */

      // this is easier way
      textGeometry.center(); // also a method of BufferGeometry
    }
    // --------------------------------------------------------------------------------------
    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
    const donutMatcapTexture = textureLoader.load("/textures/matcaps/5.png");
    //---------------------------------------------------------------------------------------

    const textMaterial = new THREE.MeshMatcapMaterial();
    textMaterial.matcap = matcapTexture;

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    scene.add(textMesh);

    // rendering bunch of toruses
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
    const donutMaterial = new THREE.MeshMatcapMaterial({
      matcap: donutMatcapTexture,
    });
    // mesuring the time to create bunch of donuts

    console.time("donuts");

    for (let i = 0; i < 200; i++) {
      const donutMesh = new THREE.Mesh(donutGeometry, donutMaterial);

      donutMesh.position.x = (Math.random() - 0.5) * 10;
      donutMesh.position.y = (Math.random() - 0.5) * 10;
      donutMesh.position.z = (Math.random() - 0.5) * 10;

      donutMesh.rotation.x = Math.random() * Math.PI;
      donutMesh.rotation.y = Math.random() * Math.PI;

      const scale = Math.random();

      donutMesh.scale.setScalar(scale);

      scene.add(donutMesh);
    }

    console.timeEnd("donuts");
  });

  // --------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  // scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 30);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 4;
  // scene.add(pointLight);

  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------

  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  //------------------------------------------------------------------------
  //------------------------------------------------------------------------

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
  // scene.add(axHelp);

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
