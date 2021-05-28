const byId = id => document.getElementById(id)

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

class Blobmensch {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.vx = 0
        this.vy = 0 // Math.random() * 2 * Math.PI
        this.z1 = 0
        this.z2 = 0
        this.normal = true;
        this.infected = false;
        this.removed = false;
        this.color = "#123456";
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
    step(dt, blobs) {
        const [z1, z2] = box_muller()

        if ((this.vy === 0 && this.vx === 0) || touched(this, blobs)) {
            this.z1 = z1;
            this.z2 = z2;
        }

        this.vx = 0.15 * this.z1 * dt
        this.vy = 0.15 * this.z2 * dt

        this.x = eingrenzen(0, 500, this.x + this.vx)
        this.y = eingrenzen(0, 500, this.y + this.vy)

    }
}

const distance_between = (x1, y1, x2, y2) => {
    var a = x1 - x2;
    var b = y1 - y2;

    return Math.sqrt(a + b);
}

const touched = (blob, blobs) => {
    if (blob.x < 1 || blob.x > 499) {
        return true;
    }
    if (blob.y < 1 || blob.y > 499) {
        return true;
    }
    for (blob2 of blobs) {
        if (blob === blob2) {
            continue;
        }
        if (distance_between(blob.x, blob.y, blob2.x, blob2.y) < 0.2) {
            if (true) {
                blob.color = "#b33030"
                blob.infected = true
            }
            return true;
        }
    }
    return false;
}


const render = (blobs) => {
    const canvas = byId("c")
    const ctx = canvas.getContext("2d")

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(-1, -1, 502, 502)

    for (blob of blobs) {
        ctx.fillStyle = blob.color
        ctx.beginPath()
        ctx.arc(blob.x, blob.y, 5, 0, 2 * Math.PI)
        ctx.fill()
    }
}

let t0 = null

const step = (t) => {
    if (!t0) t0 = t

    const dt = 0.9 * (t - t0)
    t0 = t

    for (blob of blobs) {
        blob.step(dt, blobs)
    }

    render(blobs)

    window.requestAnimationFrame(step)
}

const blobs = []
for (let i = 0; i < 100; i++) {
    const b = new Blobmensch(Math.random() * 500, Math.random() * 500)
    blobs.push(b)
}

window.requestAnimationFrame(step)