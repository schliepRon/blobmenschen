import * as THREE from 'https://cdn.skypack.dev/three'


const byId = id => document.getElementById(id)
const WIDTH = 700

const eingrenzen = (min, max, x) => { 
  return Math.min(max, Math.max(min, x))
}

// generiert 2 normalverteile zufallszahlen
const box_muller = () => {
    const u1 = Math.random()
    const u2 = Math.random()

    const z1 = Math.sqrt(-2. * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    const z2 = Math.sqrt(-2. * Math.log(u1)) * Math.sin(2 * Math.PI * u2)

    return [z1, z2]
}

class Vec2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  static fromPolar(r, phi) {
    const x = r * Math.cos(phi)
    const y = r * Math.sin(phi)
    return new Vec2(x, y)
  }

  distance(that) {
    const dx = this.x - that.x
    const dy = this.y - that.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  smul(n) {
    return new Vec2(n * this.x, n * this.y)
  }

  dot(that) {
    return new Vec2(this.x * that.x, this.y * that.y)
  }

  sadd(n) {
    return new Vec2(this.x + n, this.y + n)
  }

  add(that) {
    return new Vec2(this.x + that.x, this.y + that.y)
  }

  zero() {
    return this.x == 0 && this.y == 0
  }

  limit(max) {
    const m = this.distance(new Vec2(0, 0))
    return this.smul(Math.min(1.0, max / m))
  }

  pointAwayFrom(that) {
    const dx = this.x - that.x
    const dy = this.y - that.y
    const r = Math.sqrt(dx * dx + dy * dy)
    return new Vec2(dx / r, dy / r)
  }

  abs() {
    const dx = this.x
    const dy = this.y
    const r = Math.sqrt(dx * dx + dy * dy)
    return r
  }
}

class Blobmensch {
  constructor(x, y, i) {
    this.idx = i
    this.r = new Vec2(x, y)
    this.v = Vec2.fromPolar(0.1, Math.random() * 2 * Math.PI)

    this.state = "normal"
    this.distancing = Math.random() < 0.8
  }
  step(t, dt, blobs) {
    if (this.state !== "dead") {

      // abstand zu rändern
      let Fx = 0.0
      let Fy = 0.0

      if (this.r.x < 20) {
        let d = this.r.x
        Fx += 1.0 / (d * d)
      }
      if (this.r.x > (WIDTH - 20)) {
        let d = WIDTH - this.r.x
        Fx += -1.0 / (d * d)
      }

      if (this.r.y < 20) {
        let d = this.r.y
        Fy += 1.0 / (d * d)
      }
      if (this.r.y > (WIDTH - 20)) {
        let d = WIDTH - this.r.y
        Fy += -1.0 / (d * d)
      }

      const otherBlobs = blobs.filter(b => b !== this && b.state !== "dead")

      // abstand zu anderen blobs
      for (let that of otherBlobs) {
        const d = this.r.distance(that.r)
        if (d < 70 && this.distancing) {
          const away = this.r.pointAwayFrom(that.r)
          Fx += away.x * 0.05 / (d * d)
          Fy += away.y * 0.05 / (d * d)
        }
        
        if (d < 20 && this.state === "normal" && that.state === "infected") {
          // infektion?
          if (Math.random() < 2.5 * (dt / 1000.0)) {
            this.state = "infected"
            this.infectedAt = t
            blobObjs[this.idx].material.color.set("#cc0000")
          }
        }
      }

      if (this.state === "infected" && (this.infectedAt + 5000) < t) {
        if (Math.random() < 0.1) {
          this.state = "dead"
          this.v = new Vec2(0.0, 0.0)
          blobObjs[this.idx].material.color.set("#000000")
        } else {
          this.state = "removed"
          blobObjs[this.idx].material.color.set("#009900")
        }
      } else {
        let a = (new Vec2(Fx, Fy)).limit(0.1)
        
        if (!a.zero()) {
          this.v = this.v.add(a.smul(dt)).limit(0.1)
        }
      }

      const x = eingrenzen(1, WIDTH - 1, this.r.x + dt * this.v.x)
      const y = eingrenzen(1, WIDTH - 1, this.r.y + dt * this.v.y)
      this.r = new Vec2(x, y)
      blobObjs[this.idx].position.set(-this.r.x, 3, -this.r.y)
    }
  }
}

let camera, scene, renderer;
let geometry, material, mesh;

const blobs = []
const blobObjs = []
for (let i = 0; i < 100; i++) {
  const b = new Blobmensch(Math.random() * (WIDTH - 100) + 50, Math.random() * (WIDTH - 100) + 50, i)
  blobs.push(b)
}

init();

function blobmanGeo() {
    const base = new THREE.CylinderGeometry(1.5, 1.5, 4)
    /*const circGeo = new THREE.SphereGeometry(1.5)
    const mesh1 = new THREE.Mesh(circGeo, new THREE.MeshNormalMaterial());
    mesh1.position.set(2, -2, 0)
    mesh1.updateMatrix()
    const mesh2 = new THREE.Mesh(circGeo, new THREE.MeshNormalMaterial());
    mesh2.position.set(0, -8, 0)
    mesh2.updateMatrix()
    base.merge(mesh1.geometry, mesh1.matrix)
    base.merge(mesh2.geometry, mesh2.matrix)*/
    return base
}

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("skyblue")

    const light = new THREE.DirectionalLight('white', 8);
    light.position.set(10, 10, 10);
    scene.add(light)

    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 2000 );
    camera.position.set(190, 360, 190)
    camera.rotation.set(-0.75, 0.6, 0.45)

    const planeGeo = new THREE.BoxBufferGeometry(702, 2, 702);
    const planeMat = new THREE.MeshStandardMaterial({ color: '#cccccc' })
    const plane = new THREE.Mesh(planeGeo, planeMat)
    plane.position.set(-349, -1, -349)
    scene.add(plane)


    // create a geometry
    const geometry = blobmanGeo() // new THREE.BoxBufferGeometry(3, 4, 3);
    for (let blob of blobs) {
        const material = new THREE.MeshStandardMaterial({ color: '#3333bb' });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(-blob.r.x, 2, -blob.r.y)
        blobObjs.push(cube)
        scene.add(cube)
    }
    blobs[0].state = "infected"
    blobs[0].infectedAt = (new Date()).getTime()
    blobObjs[0].material.color.set('#cc0000');

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.physicallyCorrectLights = true;
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setAnimationLoop( animation );
    document.body.appendChild( renderer.domElement );

    // renderer.render( scene, camera );
}

let t0 = null

function animation( t ) {
    if (!t0) t0 = t

    const dt = 0.9 * (t - t0)
    if (dt <= 0) {
        return
    }
    t0 = t

    for (let blob of blobs) {
        blob.step(t, 20, blobs)
    }

    renderer.render( scene, camera );

}