// Second practice (exploring camera)
import * as THREE from "three";
// alys install gsap@3.5.1
// import gsap from "gsap";

const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");

if (canvas) {
  const sizes = {
    width: 800,
    height: 600,
  };
  // canvas.style.width = `${sizes.width}px`;
  // canvas.style.height = `${sizes.height}px`;

  const scene = new THREE.Scene();
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshBasicMaterial({
    color: "crimson",
    // color: 0xff0000,
    // wireframe: true,
  });

  // const group = new THREE.Group();

  // scene.add(group);

  const cube1 = new THREE.Mesh(geo, mat);

  scene.add(cube1);

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.set(-1, 1, 3);
  scene.add(camera);

  camera.lookAt(cube1.position);

  // distance between vector of mesh and the vector of camera
  // console.log(me.position.distanceTo(camera.position));
  //
  // console.log(me.position.distanceTo(new THREE.Vector3(1, 1, 1)));

  const axHelp = new THREE.AxesHelper(4);
  axHelp.setColors("red", "green", "blue");
  scene.add(axHelp);

  // camera.position.x += -0.1;
  // camera.position.y += -0.1;

  const renderer = new THREE.WebGLRenderer({
    canvas,
  });

  renderer.setSize(sizes.width, sizes.height);

  renderer.render(scene, camera);

  // ------------- Animation ------------------
  const clock = new THREE.Clock();
  // clock.start();
  const tick = () => {
    // there is also clock.getDelta()
    // but it is not recommended to be used
    // since it is messing with internal logic of the Clock class
    // You will have strange reuslts, whichh I noriced when trying to use it
    // especially when using with getElapsedTime

    const elapsedTime = clock.getElapsedTime();

    cube1.rotation.y = elapsedTime;

    // console.log("tick", elapsedTime);

    // cube1.position.x = elapsedTime * 0.1;
    // cube1.position.x = Math.sin(Math.PI * elapsedTime);
    // cube2.rotation.y = 2 * Math.PI * elapsedTime;

    // making a circle while moving
    // cube3.position.x = Math.sin(elapsedTime);
    // cube3.position.z = Math.cos(elapsedTime);
    //

    // animating camera
    // camera.position.x = Math.sin(elapsedTime);
    // camera.position.y = Math.cos(elapsedTime);
    // but we look at cube2 while moving
    // camera.lookAt(cube2.position);

    // never forget this at th end of the frame,
    // without this nothing would change
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();
}
