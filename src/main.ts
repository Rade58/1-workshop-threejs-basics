// First practice (reminder and dealing primary with position, roatation, scale)
// Also doing firt animations
import * as THREE from "three";
// alys install gsap@3.5.1
import gsap from "gsap";

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

  const group = new THREE.Group();

  scene.add(group);

  const cube1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), mat);
  const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, 0.2),
    new THREE.MeshBasicMaterial({ color: "purple" })
  );
  const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, 0.2),
    new THREE.MeshBasicMaterial({ color: "blanchedalmond" })
  );

  cube1.position.x = -1;
  cube2.position.y = 1;
  cube3.position.z = 0.5;

  group.add(cube1, cube2, cube3);

  group.rotation.y = (2 * Math.PI * 0.25) / 2;
  group.rotation.x = (2 * Math.PI * 0.25) / 2;

  group.position.y = -1;

  group.scale.y = 2;

  // const me = new THREE.Mesh(geo, mat);
  // position is Vector3 instance
  // me.position.x = 0.7;
  // me.position.x = -0.6;
  // me.position.z = 1;

  // scene.add(me);

  // console.log(me.position.length()); // distancee from the center of the scene
  // this will reduce length to be 1
  // not exactly 1 but, something more like 1.0000000000000002
  // me.position.normalize();
  // console.log(me.position.length()); // 1

  //
  /*   me.position.set(1, 1, 1);
  me.position.setScalar(-0.2);
  me.position.setX(1);
  me.position.setY(-1);
  //
  me.scale.x = 0.6;
  me.scale.setScalar(1);
  //
  me.rotation.reorder("YXZ");  */ // setting that rotations happen in order
  // WHY IS REORERING IMPORTANT IN SOME CASES
  // RMEMBER THAT WHEN YOU ROTATE AGAINST ONE AXIS OTHER AXIS ARE MOVING WITH A BODY
  // SO THE ORDER IS IMPORTANT BECAUSE IN SOME CASES WE WANT TO ROTATE AROUND X FIRST
  // AND THEN AROUND SOME OTHER AXIS
  //
  /* me.rotation.x = 2* Math.PI * 0.25;  // just to point out (2PI * 1radin is full circle)
  me.rotation.y = 2* Math.PI * 0.25; */ // 0.25 radians * 2PI is 90deg
  // `quaternion` is a bit complex (a lot) but I won't cover it
  // updating rotation updates quaternion and vice versa

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.set(0, 0, 3);
  scene.add(camera);

  // camera.lookAt(me.position);

  // distance between vector of mesh and the vector of camera
  // console.log(me.position.distanceTo(camera.position));
  //
  // console.log(me.position.distanceTo(new THREE.Vector3(1, 1, 1)));

  const axHelp = new THREE.AxesHelper(4);
  axHelp.setColors("red", "green", "blue");
  scene.add(axHelp);

  camera.position.x += -0.1;
  camera.position.y += -0.1;

  // console.log(cube2.position.y);
  // gsap under the hood is calling   window.requestAnimationFrame
  gsap.to(cube2.position, {
    y: -1,
    duration: 1,
    delay: 2,
  });

  gsap.to(cube2.position, {
    y: 1,
    duration: 1,
    delay: 4,
  });

  //

  const renderer = new THREE.WebGLRenderer({
    canvas,
  });

  renderer.setSize(sizes.width, sizes.height);

  renderer.render(scene, camera); // after this, it's not possible to move Object3D instances
  //                                you would need to call this again after you do omething on Object3D instances

  // -------- ANIMATIONS ---------
  // Doing animation with delta will ensure that you have same speed
  // on every computer

  let time = Date.now();
  // animation frame
  const myTick = () => {
    const currentTime = Date.now();
    const deltaTime = currentTime - time;
    time = currentTime;

    console.log("tick", { deltaTime });

    group.rotation.y += deltaTime * 0.001;

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  // myTick();

  // Another way is to use `THREE.Clock` instance
  // which is the best way I think
  const clock = new THREE.Clock();

  // don't ever use clock.getDelta()

  const tick = () => {
    // there is also clock.getDelta()
    // but it is not recommended to be used
    // since it is messing with internal logic of the Clock class
    // You will have strange reuslts, whichh I noriced when trying to use it
    // especially when using with getElapsedTime

    const elapsedTime = clock.getElapsedTime();

    // console.log("tick", elapsedTime);

    // cube1.position.x = elapsedTime * 0.1;
    cube1.position.x = Math.sin(Math.PI * elapsedTime);
    // cube2.rotation.y = 2 * Math.PI * elapsedTime;

    // making a circle while moving
    cube3.position.x = Math.sin(elapsedTime);
    cube3.position.z = Math.cos(elapsedTime);
    //

    // animating camera
    // camera.position.x = Math.sin(elapsedTime);
    // camera.position.y = Math.cos(elapsedTime);
    // but we look at cube2 while moving
    // camera.lookAt(cube2.position);

    //
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();
}
