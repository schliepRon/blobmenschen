const byId = id => document.getElementById(id)

const eingrenzen = (min, max, x) => {
    return Math.min(max, Math.max(min, x))
}

const susceptibleColor = "#3076b3";
const infectedColor = "#b33030";
const recoveredColor = "#36ad38";
const deadColor = "#04090d";

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
        this.recovered = false;
        this.dead = false;
        this.daysInfected = 0;
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
        recoverOrDie(this);

        this.vx = 0.055 * this.z1 * dt
        this.vy = 0.055 * this.z2 * dt

        this.x = eingrenzen(0, 1920, this.x + this.vx)
        this.y = eingrenzen(0, 1080, this.y + this.vy)

    }
}

const distance_between = (x1, y1, x2, y2) => {
    var a = x1 - x2;
    var b = y1 - y2;

    return Math.sqrt(a + b);
}

const touched = (blob, blobs) => {
    if (blob.x < 1 || blob.x > 1919) {
        return true;
    }
    if (blob.y < 1 || blob.y > 1079) {
        return true;
    }
    for (blob2 of blobs) {
        if (blob === blob2) {
            continue;
        }
        if (distance_between(blob.x, blob.y, blob2.x, blob2.y) < 0.5) {
            if (blob2.infected && infect(blob)) {
                blob.normal = false;
                blob.infected = true;
            } else if (blob.infected && infect(blob2)) {
                blob2.normal = false;
                blob2.infected = true;
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
    ctx.fillRect(-1, -1, 1921, 1081)

    for (blob of blobs) {
        ctx.fillStyle = getColor(blob)
        ctx.beginPath()
        ctx.arc(blob.x, blob.y, 6, 0, 2 * Math.PI)
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

const recoverOrDie = (blob) => {
    if(blob.recovered || blob.dead) return;

    //recover
    if (blob.infected && blob.daysInfected < 400) {
        blob.daysInfected++;
    } else if (blob.infected) {
        blob.infected = false;
        blob.recovered = true;
    }

    //die
    const u1 = Math.random() * 100;
    if(blob.infected && u1 <= 0.01){
        blob.infected = false;
        blob.dead = true;
    }

}

const infect = (blob) => {
    if(!blob.normal) return false
    const u1 = Math.random();
    return u1 <= 0.1
}


const getColor = (blob) => {
    if (blob.infected) return infectedColor
    else if (blob.dead) return deadColor
    else if (blob.recovered) return recoveredColor
    else return susceptibleColor
}

const blobs = []
for (let i = 0; i < 499; i++) {
    const b = new Blobmensch(Math.random() * 1920, Math.random() * 1080)
    blobs.push(b)
}

const b1 = new Blobmensch(Math.random() * 1920, Math.random() * 1080)
b1.color = infectedColor
b1.infected = true
blobs.push(b1)

window.requestAnimationFrame(step)