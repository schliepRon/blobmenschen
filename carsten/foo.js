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
  constructor(x, y) {
    this.r = new Vec2(x, y)
    this.v = Vec2.fromPolar(0.1, Math.random() * 2 * Math.PI)

    this.state = "normal"
    this.distancing = Math.random() < 0.8
  }
/*
  step(dt) {
    this.v0 = Math.max(0, Math.min(1, this.v0 + 0.01 * (Math.random() - 0.5)))
    this.vphi = (2 * Math.PI + this.vphi + 0.5 * (Math.random() - 0.5)) % (2 * Math.PI)

    const vx = this.v0 * Math.cos(this.vphi)
    const vy = this.v0 * Math.sin(this.vphi)

    this.x = Math.min(500, Math.max(0, this.x + dt * vx))
    this.y = Math.min(500, Math.max(0, this.y + dt * vy))
  }
  */
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
          }
        }
      }

      if (this.state === "infected" && (this.infectedAt + 5000) < t) {
        if (Math.random() < 0.1) {
          this.state = "dead"
          this.v = new Vec2(0.0, 0.0)
        } else {
          this.state = "removed"
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
    }
  }



  draw(ctx) {
    ctx.fillStyle = this.state === "normal" ? "#0000aa" : (this.state === "infected" ? "#990000" : (this.state === "dead" ? "#000000" : "#009900"))
    ctx.beginPath()
    ctx.arc(blob.r.x, blob.r.y, 5, 0, 2 * Math.PI)
    ctx.fill()
  }
}


const render = (blobs) => {
  const canvas = byId("c")
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(-1, -1, WIDTH + 2, WIDTH + 2)

  for (blob of blobs) {
    blob.draw(ctx)
  }
}

let t0 = null

const step = (t) => {
  if (!t0) t0 = t

  const dt = 0.9 * (t - t0)
  if (dt <= 0) {
    window.requestAnimationFrame(step)
    return
  }
  t0 = t

  for (blob of blobs) {
    blob.step(t, 20, blobs)
  }

  render(blobs)

  window.requestAnimationFrame(step)
}

const blobs = []
for (let i = 0; i < 100; i++) {
  const b = new Blobmensch(Math.random() * (WIDTH - 100) + 50, Math.random() * (WIDTH - 100) + 50)
  blobs.push(b)
}

blobs[0].state = "infected"
blobs[0].infectedAt = (new Date()).getTime()

window.requestAnimationFrame(step)