import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TWEEN } from "https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Sky } from "three/addons/objects/Sky.js";
import { Water } from "three/addons/objects/Water.js";

function App() {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("black");

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById("root").appendChild(renderer.domElement);
    camera.position.set(0, 5, 50);

    document.body.style.touchAction = "none";

    window.addEventListener("resize", onWindowResize);

    const control = new OrbitControls(camera, renderer.domElement);
    control.enableDamping = true;
    control.minDistance = 5;
    control.maxDistance = 100;
    control.enablePan = false;
    control.maxPolarAngle = Math.PI / 2 - 0.05;
    control.update();

    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    const sprite = new THREE.TextureLoader().load("/textures/disc.png");
    sprite.colorSpace = THREE.SRGBColorSpace;

    for (let i = 0; i < 100; i++) {
      const x = 200 * Math.random() - 100;
      const y = 7;
      const z = 200 * Math.random() - 100;

      vertices.push(x, y, z);
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const material = new THREE.PointsMaterial({
      size: 0.7,
      sizeAttenuation: true,
      map: sprite,
      alphaTest: 0.1,
      transparent: true,
    });
    material.color.setHSL(0.1667, 1.0, 0.5, THREE.SRGBColorSpace);

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const particles2 = particles.clone();
    scene.add(particles2);
    particles2.position.y = 70;
    particles2.scale.set(2, 2, 2);

    const loaddingManager = new THREE.LoadingManager();

    const progressBar = document.getElementById("progress-bar");
    loaddingManager.onProgress = function (url, loaded, total) {
      progressBar.value = (loaded / total) * 100;
    };

    const progressBarContainer = document.querySelector(
      ".progress-bar-container"
    );
    loaddingManager.onLoad = function () {
      progressBarContainer.style.display = "none";
    };

    const gltfLoader = new GLTFLoader(loaddingManager);
    let player;
    gltfLoader.load("/models/lotus_flower_yellow.glb", (gltf) => {
      const model = gltf.scene;
      player = model;
      model.traverse((obj) => {
        if (obj.isMesh) obj.castShadow = true;
      });
      scene.add(model);
      model.scale.set(100, 100, 100);
    });

    let mixer;
    gltfLoader.load("/models/bird.glb", (gltf) => {
      const model = gltf.scene;
      player = model;
      model.traverse((obj) => {
        if (obj.isMesh) obj.castShadow = true;
      });
      mixer = new THREE.AnimationMixer(model);
      const clips = gltf.animations;
      clips.forEach(function (clips) {
        const action = mixer.clipAction(clips);
        action.play();
      });
      scene.add(model);
      model.scale.set(10, 10, 10);
      model.position.z = -1500;
      model.position.x = -60;
    });

    let sen;
    let sen1;
    let sen2;
    let sen3;
    let sen4;
    let sen5;
    let sen6;
    let sen7;
    let sen8;
    let sen9;
    gltfLoader.load("/models/sen.glb", (gltf) => {
      const model = gltf.scene;

      sen = model.clone();
      sen1 = model.clone();
      sen2 = model.clone();
      sen3 = model.clone();
      sen4 = model.clone();
      sen5 = model.clone();
      sen6 = model.clone();
      sen7 = model.clone();
      sen8 = model.clone();
      sen9 = model.clone();

      scene.add(sen);
      scene.add(sen1);
      scene.add(sen2);
      scene.add(sen3);
      scene.add(sen4);
      scene.add(sen5);
      scene.add(sen6);
      scene.add(sen7);
      scene.add(sen8);
      scene.add(sen9);

      sen.scale.set(12, 10, 12);
      sen1.scale.set(14, 10, 14);
      sen2.scale.set(16, 10, 16);
      sen3.scale.set(18, 10, 18);
      sen4.scale.set(20, 10, 20);
      sen5.scale.set(22, 10, 22);
      sen6.scale.set(24, 10, 24);
      sen7.scale.set(26, 10, 26);
      sen8.scale.set(28, 10, 28);
      sen9.scale.set(30, 10, 30);

      sen.rotation.set(0, 10, 0);
      sen1.rotation.set(0, 1, 0);
      sen2.rotation.set(0, 5, 0);
      sen3.rotation.set(0, 45, 0);
      sen4.rotation.set(0, 95, 0);
      sen5.rotation.set(0, 82, 0);
      sen6.rotation.set(0, 13, 0);
      sen7.rotation.set(0, 91, 0);
      sen8.rotation.set(0, 69, 0);
      sen9.rotation.set(0, 96, 0);
    });

    //Sun
    const sun = new THREE.Vector3();
    // Water
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        "/textures/waternormals.jpg",
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: "#336600",
      distortionScale: 3.7,
    });

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 100, 0);
    scene.add(spotLight);

    water.rotation.x = -Math.PI / 2;
    // Skybox
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(water);
    scene.add(sky);

    const parameters = {
      elevation: -2,
      azimuth: 180,
      count: 2,
    };
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    let renderTarget;

    function updateSun({ elevation, azimuth, count }, isMoon = false) {
      const skyUniforms = sky.material.uniforms;
      skyUniforms["turbidity"].value = 10;
      skyUniforms["rayleigh"].value = count;
      skyUniforms["mieCoefficient"].value = 0.005;
      skyUniforms["mieDirectionalG"].value = 0.8;

      if (isMoon) {
        skyUniforms["rayleigh"].value = 0;
        skyUniforms["mieCoefficient"].value = 0.00001;
      }

      const phi = THREE.MathUtils.degToRad(90 - elevation);
      const theta = THREE.MathUtils.degToRad(azimuth);

      sun.setFromSphericalCoords(1, phi, theta);

      sky.material.uniforms["sunPosition"].value.copy(sun);
      water.material.uniforms["sunDirection"].value.copy(sun).normalize();

      if (renderTarget !== undefined) renderTarget.dispose();

      renderTarget = pmremGenerator.fromScene(sky);
      scene.environment = renderTarget.texture;
    }

    let timer, timer2;
    animationRotation();
    const clock = new THREE.Clock();

    // Animation loop
    animate();

    document.getElementById("switcher").addEventListener("click", toggleMode);
    function toggleMode() {
      if (document.getElementById("main").classList.contains("night")) {
        if (timer || timer2) {
          clearInterval(timer);
          clearInterval(timer2);

          // Vị trí mới của camera
          var endPosition1 = new THREE.Vector3(0, 100, 0);

          // Thời gian di chuyển (tính bằng giây)
          var duration1 = 3;

          // Tạo tween để di chuyển camera
          new TWEEN.Tween(spotLight.position)
            .to(endPosition1, duration1 * 1000) // Đặt vị trí mới và thời gian di chuyển
            .easing(TWEEN.Easing.Quadratic.InOut) // Áp dụng hàm easing để tạo hiệu ứng mượt mà
            .start(); // Bắt đầu tween
        }
        document.getElementById("main").classList.remove("night");
        animationRotation();
      } else {
        if (timer || timer2) {
          clearInterval(timer);
          clearInterval(timer2);

          // Vị trí mới của camera
          var endPosition = new THREE.Vector3(0, 28, 0);

          // Thời gian di chuyển (tính bằng giây)
          var duration = 3;

          // Tạo tween để di chuyển camera
          new TWEEN.Tween(spotLight.position)
            .to(endPosition, duration * 1000) // Đặt vị trí mới và thời gian di chuyển
            .easing(TWEEN.Easing.Quadratic.InOut) // Áp dụng hàm easing để tạo hiệu ứng mượt mà
            .start(); // Bắt đầu tween
        }
        document.getElementById("main").classList.add("night");

        animationRotation(true);
      }
    }

    function animationRotation(isRevert = false) {
      let vetor = new THREE.Vector3(0, 30, 100);
      if (isRevert) {
        particles.visible = true;
        particles2.visible = true;
        let isDone = false;
        vetor = new THREE.Vector3(100, 50, -100);
        timer = setInterval(() => {
          if (parameters.elevation <= -2) {
            isDone = true;
            clearInterval(timer);
            return;
          }

          parameters.elevation -= 0.1;
          parameters.count -= 0.01;
          updateSun(parameters);
        }, 50);

        timer2 = setInterval(() => {
          if (parameters.elevation > 7) {
            clearInterval(timer2);
            return;
          }

          if (isDone) {
            parameters.azimuth = -45;
            parameters.elevation += 0.1;
            updateSun(parameters, true);
          }
        }, 20);
      } else {
        particles.visible = false;
        particles2.visible = false;
        let isDone = false;
        timer2 = setInterval(() => {
          if (parameters.elevation < -2) {
            isDone = true;
            parameters.azimuth = 180;
            clearInterval(timer2);
            return;
          }

          parameters.elevation -= 0.1;
          updateSun(parameters, true);
        }, 20);

        timer = setInterval(() => {
          if (isDone) {
            if (parameters.elevation >= 2) {
              parameters.elevation = 2;
              updateSun(parameters);
              clearInterval(timer);
              return;
            }
            parameters.elevation += 0.1;
            parameters.count += 0.01;

            updateSun(parameters);
          }
        }, 50);
      }

      // Vị trí mới của camera
      var endPosition = vetor;

      // Thời gian di chuyển (tính bằng giây)
      var duration = 3;

      // Tạo tween để di chuyển camera
      new TWEEN.Tween(camera.position)
        .to(endPosition, duration * 1000) // Đặt vị trí mới và thời gian di chuyển
        .easing(TWEEN.Easing.Quadratic.InOut) // Áp dụng hàm easing để tạo hiệu ứng mượt mà
        .start(); // Bắt đầu tween
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize);
      cancelAnimationFrame(animate);
    };

    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      renderer.render(scene, camera);
      const time = performance.now() * 0.005;

      if (player && sen) {
        player.position.y = Math.sin(time) * 0.2 + 9.9;

        sen.position.y = Math.sin(time) * 0.2;
        sen1.position.y = Math.sin(time) * 0.2;
        sen2.position.y = Math.sin(time) * 0.2;
        sen3.position.y = Math.sin(time) * 0.2;
        sen4.position.y = Math.sin(time) * 0.2;
        sen5.position.y = Math.sin(time) * 0.2;
        sen6.position.y = Math.sin(time) * 0.2;
        sen7.position.y = Math.sin(time) * 0.2;
        sen8.position.y = Math.sin(time) * 0.2;
        sen9.position.y = Math.sin(time) * 0.2;

        player.rotation.y += 0.0005;
        particles.rotation.y += 0.001;
      }
      // player.rotation.x = time * 0.01;
      // player.rotation.z = time * 0.01;

      water.material.uniforms["time"].value += 1.0 / 60.0;

      TWEEN.update();

      control.update();
    }
  }, []);

  return (
    <>
      {<div ref={sceneRef}></div>}
      <main id="main">
        <div className="container">
          <div className="switcher-wrapper">
            <p className="mode light">Sun</p>
            <div id="switcher">
              <div className="star star1"></div>
              <div className="star star2"></div>
              <div className="star star3"></div>
              <div className="round-btn">
                <div className="moon-mode"></div>
              </div>
            </div>
            <p className="mode dark">Moon</p>
          </div>
        </div>
      </main>

      <div className="progress-bar-container">
        <progress id="progress-bar" value="0" max="100"></progress>
      </div>
    </>
  );
}

export default App;
