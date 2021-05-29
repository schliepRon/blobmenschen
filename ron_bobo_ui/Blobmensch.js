import Vec2 from "./Vec2.js"
import { getRandomInt, eingrenzen } from "./util.js"


class Blobmensch {
  constructor(x, y, id, params, colonies, idx) {
    this.r = new Vec2(x, y)
    this.v = Vec2.fromPolar(0.1, Math.random() * 2 * Math.PI)
    this.params = params;
    this.idx = idx

    this.state = "normal"
    this.distancing = getRandomInt(0,100) < this.params.percentDistancing;
    this.homeColony = id;
    this.currentColony = id;
    this.size = colonies.find(c => c.name === this.currentColony).size;
    this.colonies = colonies;
  }

  step(t, dt, blobs, renderer) {
    if (this.state !== "dead") {

      let size = this.size;
      // abstand zu rändern
      let Fx = 0.0
      let Fy = 0.0

      if (this.r.x < 20) {
        let d = this.r.x
        Fx += 1.0 / (d * d)
      }
      if (this.r.x > (size - 20)) {
        let d = size - this.r.x
        Fx += -1.0 / (d * d)
      }

      if (this.r.y < 20) {
        let d = this.r.y
        Fy += 1.0 / (d * d)
      }
      if (this.r.y > (size - 20)) {
        let d = size - this.r.y
        Fy += -1.0 / (d * d)
      }

      const otherBlobs = blobs.filter(b => b !== this && b.state !== "dead")

      // abstand zu anderen blobs
      for (let that of otherBlobs) {
        const d = this.r.distance(that.r)
        if (d < 70 && this.distancing) {
          const away = this.r.pointAwayFrom(that.r)
          const distancingPower = this.params.powerDistancing * this.params.powerDistancing / 4000;
          Fx += away.x * distancingPower / (d * d)
          Fy += away.y * distancingPower / (d * d)
        }

        if (d < this.params.infectionDistance && this.state === "normal" && that.state === "infected") {
          // infektion?
          if (getRandomInt(0,100) <= this.params.infectionRate) {
            this.state = "infected"
            this.infectedAt = t
            renderer.onStateChange(this)
          }
        }
      }

      if (this.state === "infected" && (this.infectedAt + this.params.sicknessDuration * 1000) < t) {
        if (getRandomInt(0,100) <= this.params.mortality) {
          this.state = "dead"
          this.v = new Vec2(0.0, 0.0)
          renderer.onStateChange(this)
        } else {
          //set infectedAt for removed -> normal
          this.infectedAt = t;
          this.state = "removed"
          renderer.onStateChange(this)
        }
      } else {
        let a = (new Vec2(Fx, Fy)).limit(0.1)

        if (!a.zero()) {
          this.v = this.v.add(a.smul(dt)).limit(0.1)
        }
      }

      if(getRandomInt(0, 1000000) < this.params.travelChance) {
        const otherColonies = this.colonies.filter(c => c.name !== this.currentColony)
        if (otherColonies.length > 0) {
          const newIdx = getRandomInt(0, otherColonies.length - 1)
          const newCol = otherColonies[newIdx]
          this.currentColony = newCol.name

          // in der mitte der neuen kolonie spawnen
          this.size = newCol.size
          size = this.size
          this.r.x = size / 2;
          this.r.y = size / 2;
        }
      }

      if(this.state === "removed" && (this.infectedAt + this.params.sicknessDuration * 1000) < t) {
        if(getRandomInt(0, 1000) < 10) {
            this.state = "normal"
            this.infectedAt = null
            renderer.onStateChange(this)
        }
      }

      const x = eingrenzen(1, size - 1, this.r.x + dt * this.v.x)
      const y = eingrenzen(1, size - 1, this.r.y + dt * this.v.y)
      this.r = new Vec2(x, y)
    }
  }
}

export default Blobmensch