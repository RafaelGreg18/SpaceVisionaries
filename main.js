import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/EffectComposer';
import { SSAARenderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/SSAARenderPass.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/ShaderPass.js';
import { ColorCorrectionShader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/shaders/ColorCorrectionShader.js';
import {CSS2DRenderer, CSS2DObject} from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/renderers/CSS2DRenderer.js";

import { SolarSystem } from './solar_system.js';


const main = function () {

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	document.body.appendChild(renderer.domElement);

	const renderPass = new RenderPass(scene, camera);
	renderPass.clearAlpha = 0;

	const ssaaRenderPass = new SSAARenderPass(scene, camera);
	const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
	const composer = new EffectComposer(renderer);

	ssaaRenderPass.sampleLevel = 0;

	composer.addPass(renderPass);
	composer.addPass(colorCorrectionPass);
	composer.addPass(ssaaRenderPass);

	const cubeTextureLoader = new THREE.CubeTextureLoader();
	scene.background = cubeTextureLoader.load([
		"resources/textures/stars_skybox.jpg",
		"resources/textures/stars_skybox.jpg",
		"resources/textures/stars_skybox.jpg",
		"resources/textures/stars_skybox.jpg",
		"resources/textures/stars_skybox.jpg",
		"resources/textures/stars_skybox.jpg"
	]);

	const solarSystem = new SolarSystem(scene)
	solarSystem.drawOrbits(scene);

	const controls = new OrbitControls(camera, renderer.domElement);

	camera.position.z = 5;
	controls.update();

													const labelRenderer = new CSS2DRenderer();
													labelRenderer.setSize(window.innerWidth, window.innerHeight);
													labelRenderer.domElement.style.position = 'absolute';
													labelRenderer.domElement.style.top = '0px';
													labelRenderer.domElement.style.pointerEvents = 'none';
													labelRenderer.domElement.style.fontSize = 10000;
													document.body.appendChild(labelRenderer.domElement);


																const p = document.createElement('p');
																p.textContent = "helloo";
																const cPointLabel = new CSS2DObject(p);
																scene.add(cPointLabel);
																cPointLabel.position.set(-6, 0.8, 4);


	controls.keys = {
		LEFT: 'ArrowLeft', //left arrow
		UP: 'ArrowUp', // up arrow
		RIGHT: 'ArrowRight', // right arrow
		BOTTOM: 'ArrowDown' // down arrow
	}

	controls.listenToKeyEvents(window);
	controls.enableDamping = true;
	controls.dampingFactor = 0.1

	window.addEventListener('resize', onWindowResize);



	var then = 0;
	function animate(now) {
		requestAnimationFrame(animate);

		now *= 0.001;
		var deltaTime = now - then;
		if (!deltaTime) {
			deltaTime = 0
		}
		then = now;

		solarSystem.move();

		controls.update()

																							labelRenderer.render(scene, camera)

		composer.render()
		// renderer.render(scene, camera);

	};

	animate();


	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		composer.setSize(window.innerWidth, window.innerHeight);
		// labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight)

	}
}

main()