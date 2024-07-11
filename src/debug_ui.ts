// in this practice we learn about debug ui
// we are going to use package lil-gui
import * as THREE from "three";
// alys install gsap@3.5.1
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

// gui.hide();

// doing this because color problem
// where I need to print color in order to get it
const debugObject = {
  // color: "#8c5a72",
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
    // color: "crimson",
    // color: new THREE.Color("#d7a180"),
    // color: new THREE.Color("#f44d4d"),
    color: debugObject.color,
    wireframe: true,
  });

  const cube1 = new THREE.Mesh(geo, mat);

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // ------ We can use folder
  const cubeTweaks = gui.addFolder("My Cube");
  // close folder by default
  // cubeTweaks.close();
  // You can also nest folders (put folders inside the folders)

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // using debug ui
  // gui.add(cube1.position, "y", -3, 3, 0.01); // one way
  // better way with methods
  cubeTweaks
    // gui
    .add(cube1.position, "y")
    .min(-3)
    .max(3)
    .step(0.001)
    .name("elevation");
  // we can also tweak non ThreeJS things, like objects for example
  /* let myObject = {
    speed: 0.4,
  }; */
  // gui.add(myObject, "speed").min(0.0).max(0.9).step(0.01).name("speed");

  // this one is boolean

  cubeTweaks
    // gui
    .add(cube1, "visible");
  // .name("visible");

  // for material
  // gui.add(mat, "wireframe");
  // or //
  cubeTweaks
    // gui
    .add(cube1.material, "wireframe");

  // but we won't tweak color, we will tweak value outside of threejs
  // this approach is BAD (WE WON'T BE USING THIS EVER)
  // for colors
  /*
  gui
    .addColor(mat, "color") // you can change and copy colors
    // but since threejs does some optimizing of colors upon rendering
    // if you try to reuse mentioned obtained color, it won't look
    // be the ame color (KNOWN PROBLEM)
    // BUT WE CAN PRINT ACTUAL COLOR LIKE THIS
    .onChange((colInstance: THREE.Color) => {
      // we can use rgb from argument
      // const {r,g,b} = colInstance
      // console.log({r,,g,b}); // since argument

      // or we can access rgb like this
      // console.log(mat.color);
      // we can print hex like this
      console.log(`#${colInstance.getHexString()}`);

      debugObject.color = `#${colInstance.getHexString()}`;

      // but I made it too
    })
    .name("(don't use this)");
    */

  // BETTER APROACH WE RE GOING TO USE IN FUTURE DEVELOPMENT
  cubeTweaks
    // gui
    .addColor(debugObject, "color")
    .onChange((colHex: string) => {
      // like this
      // cube1.material.color = new THREE.Color(colHex);
      // or better like this
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
  // can't be done directly since we only can define widthSegments, heightSegments, depthSegments
  // when we instantiate geometry
  cubeTweaks
    // gui
    .add(debugObject, "subdivisions")
    .min(1)
    .max(20)
    .step(1)
    // this is bad because it requires a lot of processing
    // .onChange((subdiv: number) => {
    // console.log({ subdiv });
    // cube1.geometry = new THREE.BoxGeometry(1,1,subdiv, subdiv)
    // });
    // this method is better since it runs only when you relese the picker (slider)
    // it is better but also bad for performance and it can cause memory leaks
    // since old geometries will still be in memory
    .onFinishChange((subdiv: number) => {
      // console.log({ subdiv });
      // first to dispose old geometry, to prevent memory leaks
      cube1.geometry.dispose();
      // I don't know why we don't use it like this
      // cube1.geometry = new THREE.BoxGeometry(1, 1, subdiv, subdiv, subdiv);
      // instead of this
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
    // play with near and far to see what effect will produce
    0.1, // increase this it might cut the mesh camera is looking at
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
  // orbit_controls.enabled = false;
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

    // cube1.rotation.x = 2 * Math.PI * elapsedTime * myObject.speed;

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
