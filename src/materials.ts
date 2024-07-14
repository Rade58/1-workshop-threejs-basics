// in this exercise we learn about materials
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
// for environment map
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * @description Debug UI - lil-ui
 */
const gui = new GUI({
  width: 340,
  title: "My Debugging",
  closeFolders: false,
});

// gui.hide();

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

  const matcapTexture = textureLoader.load("/textures/matcaps/7.png");
  const gradientTexture = textureLoader.load("/textures/gradients/grad2.jpg");
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
  // made this changes because of heightMap for mesh standard material
  // (I added more details (segments))
  // by adding this much of subdivisions, this much of verices, is very bad for performance, just for you to know
  // const sphereGeo = new THREE.SphereGeometry(0.5, 16, 16);
  const sphereGeo = new THREE.SphereGeometry(0.5, 64, 64);
  // const planeGeo = new THREE.PlaneGeometry(1, 1);
  const planeGeo = new THREE.PlaneGeometry(1, 1, 100, 100);
  // const torusGeo = new THREE.TorusGeometry(0.3, 0.2, 16, 32);
  const torusGeo = new THREE.TorusGeometry(0.3, 0.2, 64, 128);

  // ------- MESH BASIC MATERIAL
  const meshBasicMat = new THREE.MeshBasicMaterial({
    // color: debugObject.color,
    // wireframe: true,
    // map: doorColorTexture,
  });
  // meshBasicMat.map = doorColorTexture;
  // meshBasicMat.color = new THREE.Color("crimson"); // needs to be color instance if you wnt to set tit this way
  // meshBasicMat.wireframe = true;
  // we need transparent for opacity, or alphaMap
  // meshBasicMat.transparent = true;
  // meshBasicMat.opacity = 0.5;
  // meshBasicMat.alphaMap = doorAlphaTexture;
  // meshBasicMat.side = THREE.FrontSide;
  // meshBasicMat.side = THREE.BackSide;
  // meshBasicMat.side = THREE.DoubleSide; // avoid, it takes more processing power (longer to render)

  // ------- MESH NORMAL MATERIAL
  const meshNormalMaterial = new THREE.MeshNormalMaterial();

  // these we already saw on basic material
  // meshNormalMaterial.wireframe = true;
  meshNormalMaterial.side = THREE.DoubleSide;
  // meshNormalMaterial.transparent = true;
  // meshNormalMaterial.opacity = 0.4;
  // --------------------------------------
  // these one characteristic for normal material, good for debugging of normls
  meshNormalMaterial.flatShading = true;

  // ------- MESH MATCAP MATERIAL (workshop author uses this one for his game/portfoliot (with car) website)
  const meshMatcapMaterial = new THREE.MeshMatcapMaterial();
  meshMatcapMaterial.matcap = matcapTexture;

  // ------ MESH DEPTH MATERIAL
  const meshDepthMaterial = new THREE.MeshDepthMaterial();

  /// ////   MATERIALS THAT REQUIRE LIGHT-------------------------------------------------
  /// ////   MATERIALS THAT REQUIRE LIGHT-------------------------------------------------
  // so we need to add few lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  // scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 30);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 4;

  // scene.add(pointLight);

  // -------- loading ENVIRONMENT MAP texture
  // -----------------------------------------
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load("/textures/environmentMap/vignaioli_2k.hdr", (envMap) => {
    // console.log({ envMap });
    envMap.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = envMap; // adding map
    scene.environment = envMap; // to see reflections on `mesh normal material`, `mesh lambert material`, `mesh phong material`
    // play with metalness of mesh normal material and see reflections
    // if you lower the roughness and increase metalness
    // you can get rid of the lighting in this case
  });

  //-------------------------------------
  //-------------------------------------

  const pointLightHelper = new THREE.PointLightHelper(
    pointLight,
    0.1,
    "crimson"
  );
  scene.add(pointLightHelper);

  // ------ MESH LAMBERT MATERIAL
  const meshLambertMaterial = new THREE.MeshLambertMaterial(); // most performart material that uses light

  // ------ MESH PHONG MATERIAL
  const meshPhongMaterial = new THREE.MeshPhongMaterial(); // less performant but better looking than lambert
  meshPhongMaterial.shininess = 100;
  meshPhongMaterial.specular = new THREE.Color(0x1188ff);

  // ----- MESH TOON MATERIAL
  // for small texture to work we do this
  gradientTexture.minFilter = THREE.NearestFilter;
  gradientTexture.magFilter = THREE.NearestFilter;
  gradientTexture.generateMipmaps = false;

  const meshToonMaterial = new THREE.MeshToonMaterial();
  meshToonMaterial.gradientMap = gradientTexture;

  // ----- MESH STANDARD MATERIAL
  // IT IS STANDARD BECAUSE PBR HAS BECOME STANDRD IN MANY SOFTWARE, ENGINES, LIBRARIES
  // SIMILAR OUTPUT REGARDLESS OF TECHNOLOGY YOU ARE USING
  const meshStandardMaterial = new THREE.MeshStandardMaterial();

  // meshStandardMaterial.metalness = 0.45;
  // meshStandardMaterial.metalness = 0.7; // looks good with environment map
  meshStandardMaterial.metalness = 1; // looks good after adding metalness map texture for mesh standard material (value will work as a multiplier)
  // meshStandardMaterial.roughness = 0.65;
  // meshStandardMaterial.roughness = 0.2; // looks good with environment map
  meshStandardMaterial.roughness = 1; // looks good with roughness map texture for mesh standard material (value will work as  multiplier)
  //
  meshStandardMaterial.map = doorColorTexture;
  meshStandardMaterial.aoMap = doorAmbientOcclusionTexture;
  meshStandardMaterial.aoMapIntensity = 1;
  meshStandardMaterial.displacementMap = doorHeightTexture;
  // for height texture to work
  meshStandardMaterial.displacementScale = 0.1;
  //
  meshStandardMaterial.metalnessMap = doorMetalnessTexture;
  meshStandardMaterial.roughnessMap = doorRoughnessTexture;
  //
  meshStandardMaterial.normalMap = doorNormalTexture;
  meshStandardMaterial.normalScale.set(0.5, 0.5);
  //
  meshStandardMaterial.transparent = true;
  meshStandardMaterial.alphaMap = doorAlphaTexture; //because of transparency only door will be visible
  //                                                  and the rest of mesh won't be visible

  /*  gui
    .add(meshStandardMaterial, "metalness")
    .min(0)
    .max(1)
    .step(0.0001)
    .name("stndard mat metalnss");
  gui
    .add(meshStandardMaterial, "roughness")
    .min(0)
    .max(1)
    .step(0.0001)
    .name("standard mat roughness"); */

  // ------------------------------------------------------------------------------------------------------------------------------
  // ------ MESH PHISICAL MATERIAL (MESH NORMAL WITH MORE PHISICAL CHARACTERISTICS LIKE clearcoat, sheen, iridescence, trnsmission)
  // worst material for performance
  const meshPhisMaterial = new THREE.MeshPhysicalMaterial();

  // meshPhisMaterial.metalness = 1;
  meshPhisMaterial.metalness = 0;
  // meshPhisMaterial.roughness = 1;
  meshPhisMaterial.roughness = 0;
  /* meshPhisMaterial.map = doorColorTexture;
  meshPhisMaterial.aoMap = doorAmbientOcclusionTexture;
  meshPhisMaterial.aoMapIntensity = 1;
  meshPhisMaterial.displacementMap = doorHeightTexture;
  meshPhisMaterial.displacementScale = 0.1;
  meshPhisMaterial.metalnessMap = doorMetalnessTexture;
  meshPhisMaterial.roughnessMap = doorRoughnessTexture;
  meshPhisMaterial.normalMap = doorNormalTexture;
  meshPhisMaterial.normalScale.set(0.5, 0.5);
  meshPhisMaterial.transparent = true;
  meshPhisMaterial.alphaMap = doorAlphaTexture; */

  gui
    .add(meshPhisMaterial, "metalness")
    .min(0)
    .max(1)
    .step(0.0001)
    .name("phisical mat metlness");
  gui
    .add(meshPhisMaterial, "roughness")
    .min(0)
    .max(1)
    .step(0.0001)
    .name("phisical mat roughness");

  //
  // additional stuff only characteristical for MeshPhisicalMaterial
  // but all of this is costly forperformance
  /* meshPhisMaterial.clearcoat = 1;
  meshPhisMaterial.clearcoatRoughness = 0;

  gui
    .add(meshPhisMaterial, "clearcoat")
    .min(0)
    .max(1)
    .step(0.0001)
    .name("phisical mat clercot");
  gui
    .add(meshPhisMaterial, "clearcoatRoughness")
    .min(0)
    .max(1)
    .step(0.0001)
    .name("phisical mat clearcoatRoughness"); */

  // sheen is for material that is fluffy like fabric, for example fabric on chair or couch or similar
  // material will look less plastic
  /* meshPhisMaterial.sheen = 1;
  meshPhisMaterial.sheenRoughness = 0.25;
  meshPhisMaterial.sheenColor.set(1, 1, 1);

  gui
    .add(meshPhisMaterial, "sheen")
    .min(0)
    .max(1)
    .step(0.0001)
    .name("phisical mat sheen");
  gui
    .add(meshPhisMaterial, "sheenRoughness")
    .min(0)
    .max(1)
    .step(0.0001)
    .name("phisical mat sheenRoughness");
  gui.addColor(meshPhisMaterial, "sheenColor"); */

  // for color efect of fuel or soap bubble, lazer discs, (you know, that "ranbow" effect)

  /* meshPhisMaterial.iridescence = 1;
  meshPhisMaterial.iridescenceIOR = 1;
  meshPhisMaterial.iridescenceThicknessRange = [100, 8800];

  gui
    .add(meshPhisMaterial, "iridescence")
    .min(0)
    .max(1)
    .step(0.0001)
    .name("phisical mat iridescence");
  gui
    .add(meshPhisMaterial, "iridescenceIOR")
    .min(0)
    .max(2.333)
    .step(0.0001)
    .name("phisical mat iridescenceIOR");
  gui
    .add(meshPhisMaterial.iridescenceThicknessRange, "0")
    .min(1)
    .max(1000)
    .step(1)
    .name("phisical mat iridescenceTicknessRange 0");
  gui
    .add(meshPhisMaterial.iridescenceThicknessRange, "1")
    .min(1)
    .max(1000)
    .step(1)
    .name("phisical mat iridescenceTicknessRange 1"); */

  // trnasmission      enables light to go through material (when you want to see what is behind mesh)
  // it's more than just transparency with opacity, because things behind mesh get deformed

  // try using these one only with defined rougness and metalnss of 0 (zero) (other things we set above you can comment)
  meshPhisMaterial.transmission = 1;
  meshPhisMaterial.ior = 1.5; // to simulate material --  diamod it is 2.417, water is 1.333,  air is   1.000293
  //                              check more here        https://en.wikipedia.org/wiki/List_of_refractive_indices
  meshPhisMaterial.thickness = 0.5;

  gui
    .add(meshPhisMaterial, "transmission")
    .min(0)
    .max(1)
    .step(0.0001)
    .name("phisical mat trnasmission");
  gui
    .add(meshPhisMaterial, "ior")
    .min(1)
    .max(10)
    .step(0.0001)
    .name("phisical mat ior");
  gui
    .add(meshPhisMaterial, "thickness")
    .min(0)
    .max(1)
    .step(0.0001)
    .name("phisical mat thickness");

  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // PointsMaterial that is used for particles we will cover latter
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------

  const sphereMesh = new THREE.Mesh(
    sphereGeo,
    // meshBasicMat
    // meshNormalMaterial
    // meshMatcapMaterial
    // meshDepthMaterial
    // meshLambertMaterial
    // meshPhongMaterial
    // meshToonMaterial
    // meshStandardMaterial
    meshPhisMaterial
  );

  const planeMesh = new THREE.Mesh(
    planeGeo,
    // meshBasicMat
    // meshNormalMaterial
    // meshMatcapMaterial
    // meshDepthMaterial
    // meshLambertMaterial
    // meshPhongMaterial
    // meshToonMaterial
    // meshStandardMaterial
    meshPhisMaterial
  );

  const torusMesh = new THREE.Mesh(
    torusGeo,
    // meshBasicMat
    // meshNormalMaterial
    // meshMatcapMaterial
    // meshDepthMaterial
    // meshLambertMaterial
    // meshPhongMaterial
    // meshToonMaterial
    // meshStandardMaterial
    meshPhisMaterial
  );

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
