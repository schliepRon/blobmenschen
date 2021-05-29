import * as THREE from 'https://cdn.skypack.dev/three'
import {BufferGeometryUtils} from 'https://cdn.skypack.dev/three/examples/jsm/utils/BufferGeometryUtils.js'
import CameraControls from 'https://cdn.skypack.dev/camera-controls';
import { worldBounds } from './util.js';

CameraControls.install( { THREE: THREE } );

function blobmanGeo() {
  const base = new THREE.CylinderGeometry(0.2, 1.5, 4.5)
  const circ1Geo = new THREE.SphereGeometry(1.3)
  circ1Geo.translate(0, 1.9, 0)
  const combined = BufferGeometryUtils.mergeBufferGeometries([base, circ1Geo])
  // base.merge(circ2Geo)
  return combined 
}

const matColors = {
  "infected": "#cc0000",
  "dead": "#000000",
  "removed": "#009900",
  "normal": "#3333bb"
}

class ThreejsRenderer {
  constructor({colonies, width, height}) {
    this.colonies = colonies
    this.width = width
    this.height = height
    const bounds = worldBounds(colonies)


    // three.js init
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("skyblue")

    const light = new THREE.DirectionalLight('white', 8);
    light.position.set(10, 10, 10);
    this.scene.add(light)

    this.camera = new THREE.PerspectiveCamera( 35, this.width / this.height, 0.1, 2000 );
    this.camera.position.set(110, 360, 110)
    // camera.rotation.set(-0.7, 0.6, 0.45)

    const aspectRatio = this.width / this.height;
    this.camera2 = new THREE.OrthographicCamera(-400 * aspectRatio, 400 * aspectRatio, -400, 400)
    this.camera2.position.set(-350, 200, -350)
    this.camera2.lookAt(-350, 0, -350)

    for (const colony of colonies) {
      const planeMat = new THREE.MeshBasicMaterial( { color: colony.bgcolor, opacity: 0.5, transparent: true } )
      const planeGeo = new THREE.BoxBufferGeometry(colony.size, 2, colony.size);
      const plane = new THREE.Mesh(planeGeo, planeMat)
      plane.position.set(colony.x + 0.5 * colony.size, -1, colony.y + 0.5 * colony.size)
      this.scene.add(plane)
    }

    this.blobObjs = [];

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.physicallyCorrectLights = true;
    this.renderer.setSize( this.width, this.height );
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.domElement = this.renderer.domElement;

    this.controls = new CameraControls( this.camera, this.renderer.domElement );
    this.controls.moveTo(0, 150, 50)
    this.controls.rotateTo(0.6, 1.2)

    this.t0 = null
    this.view3d = false
  }

  init(blobs) {
    const geometry = blobmanGeo() // new THREE.BoxBufferGeometry(3, 4, 3);
    for (let blob of blobs) {
        const material = new THREE.MeshStandardMaterial({ color: '#3333bb' });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(-blob.r.x, 2.5, -blob.r.y)
        this.blobObjs.push(cube)
        this.scene.add(cube)
    }
  }

  toggleView() {
    this.view3d = !this.view3d
  }

  render(t, blobs) {
    if (!this.t0) this.t0 = t

    const dt = (t - this.t0)
    if (dt <= 0) {
        return
    }
    this.t0 = t

    for (const blob of blobs) {
      this.blobObjs[blob.idx].position.set(-blob.r.x, 3, -blob.r.y)
    }

    this.controls.update(dt)
    this.renderer.render( this.scene, this.view3d ? this.camera : this.camera2 );
  }

  onStateChange(blob) {
    this.blobObjs[blob.idx].material.color.set(matColors[blob.state])
  }

  gameLoop(t) {
    const blobsToDraw = this.step(t, this);
    this.render(t, blobsToDraw);
  }

  run(stepFn) {
    this.step = stepFn
    this.renderer.setAnimationLoop( (t) => this.gameLoop(t) );
  }

  stop() {
    this.renderer.setAnimationLoop( null );
  }

}

export default ThreejsRenderer
