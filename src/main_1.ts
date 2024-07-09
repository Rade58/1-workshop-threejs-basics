// Second practice (exploring camera)
import * as THREE from "three";
// alys install gsap@3.5.1
import gsap from "gsap";

const sizes = {
  width: 800,
  height: 600,
};

const cursor = {
  x: 0,
  y: 0,
};

/**
 * @description getting coordintes of the cursor
 */
window.addEventListener("mousemove", (e: MouseEvent) => {
  // console.log("x -> ", e.x, " y -> ", e.y);
  // console.log("x -> ", e.clientX, " y -> ", e.clientY);
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
});

const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");

if (canvas) {
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

  // field of view is in degrees (vertical vision angle) (not horizontal)
  // good values of fov are between 45 and 75
  // second argument is aspect ratio
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    // play with near and far to see what effect will produce
    0.1, // increase this it might cut the mesh camera is looking at
    100
  );
  // camera good for 2D games
  // ortographic camera
  // we calculate aspect for this camera
  /* const aspectRatio = sizes.width / sizes.height;
  const camera = new THREE.OrthographicCamera(
    // using aspect ratio like this will ensure we don't have
    // elongated or squished scene
    -1 * aspectRatio,
    1 * aspectRatio,
    1,
    -1,
    0.1,
    100
  ); */

  // camera.position.set(-1, 2, 3);
  camera.position.z = 3;
  scene.add(camera);

  camera.lookAt(cube1.position);

  console.log("distance to look at vector -> ", camera.position.length());

  // we can also animate fov
  // messing with fow can make scene distorted, wich sometimes we want
  // when we want to create cool effect

  /* gsap.to(camera, {
    fov: 25,
    duration: 2,
    delay: 2,
    onUpdate: () => {
      // we must do this if we want animation to happen
      camera.updateProjectionMatrix();
    },
  }); */
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

    // const elapsedTime = clock.getElapsedTime();

    // cube1.rotation.y = elapsedTime;

    // cube1.position.x = cursor.x;
    // cube1.position.y = -cursor.y;

    // moving camera left right up down
    // number 5 in here can be refered as amplitude (try incresing it)
    // camera.position.x = cursor.x * 10;
    // camera.position.y = cursor.y * 10;
    // we are moving camera but we want to look at mesh
    // camera.lookAt(cube1.position);

    // movig camera aroound mesh
    camera.position.x = Math.sin(2 * Math.PI * cursor.x) * 2;
    camera.position.z = Math.cos(2 * Math.PI * cursor.x) * 2;
    // moving a little bit camera up down
    camera.position.y = cursor.y * 3;
    camera.lookAt(cube1.position);

    // But all above is bit complicted
    // so ThreeJS offers built in controls

    


    // never forget this at th end of the frame,
    // without this nothing would change
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();
}
