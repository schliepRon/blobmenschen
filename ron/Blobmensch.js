import Vec2 from "./Vec2.js"
import { getRandomInt, eingrenzen } from "./util.js"
import places from "../ron/places.js"


    const WIDTH = 700

class Blobmensch {
  constructor(x, y) {
    this.r = new Vec2(x, y)
    this.v = Vec2.fromPolar(0.1, Math.random() * 2 * Math.PI)

    this.state = "normal"
    this.defaultColonie = places.home;
    this.currentColonie = places.home;
    this.distancing = getRandomInt(0,100) < percentDistancing * this.currentColonie.percentDistancing;
  }

  step(t, dt, blobs) {
    if(getRandomInt(0,100) < 10){
          switch(getRandomInt(0,4)){
              case 0: this.currentColonie = places.home;
              break;
              case 1: this.currentColonie = places.workplace;
              break;
              case 2: this.currentColonie = places.school;
              break;
              case 3: this.currentColonie = places.supermarket;
              break;
              case 4: this.currentColonie = places.hospital;
              break;
          }
    }

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
          const distancingPower = powerDistancing * powerDistancing / 4000 * this.currentColonie.powerDistancing;
          Fx += away.x * distancingPower / (d * d)
          Fy += away.y * distancingPower / (d * d)
        }

        if (d < infectionDistance && this.state === "normal" && that.state === "infected") {
          // infektion?
          if (getRandomInt(0,100) <= infectionRate * this.currentColonie.infectionRate) {
            this.state = "infected"
            this.infectedAt = t
          }
        }
      }

      if (this.state === "infected" && (this.infectedAt + 5000) < t) {
        if (getRandomInt(0,100) <= mortality * this.currentColonie.mortality) {
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
    ctx.arc(this.r.x, this.r.y, 5, 0, 2 * Math.PI)
    ctx.fill()
  }
}

export default Blobmensch