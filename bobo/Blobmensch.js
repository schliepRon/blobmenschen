import Vec2 from "./Vec2.js"
import { getRandomInt, eingrenzen } from "./util.js"


    const WIDTH = 700

class Blobmensch {
  constructor(x, y, id) {
    this.r = new Vec2(x, y)
    this.v = Vec2.fromPolar(0.1, Math.random() * 2 * Math.PI)

    this.state = "normal"
    this.distancing = getRandomInt(0,100) < percentDistancing;
    this.homeColony = id;
    this.currentColony = id;
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
          const distancingPower = powerDistancing * powerDistancing / 4000;
          Fx += away.x * distancingPower / (d * d)
          Fy += away.y * distancingPower / (d * d)
        }

        if (d < infectionDistance && this.state === "normal" && that.state === "infected") {
          // infektion?
          if (getRandomInt(0,100) <= infectionRate) {
            this.state = "infected"
            this.infectedAt = t
          }
        }
      }

      if (this.state === "infected" && (this.infectedAt + sicknessDuration) < t) {
        if (getRandomInt(0,100) <= mortality) {
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

      if(getRandomInt(0, 1000000) < travelChance) {
        if(this.currentColony == '1') {
            const newColony = 1 + getRandomInt(1,2);
            console.log("blob traveled from 1 to " + newColony);
            console.log(this);
            this.currentColony = '' + newColony;
        } else if(this.currentColony == '2'){
            const newColony = getRandomInt(1,2) == 1 ? 1 : 3;
            console.log("blob traveled from 2 to " + newColony);
            console.log(this);
            this.currentColony = '' + newColony;
        } else if(this.currentColony == '3'){
            const newColony = getRandomInt(1,2);
            console.log("blob traveled from 2 to " + newColony);
            console.log(this);
            this.currentColony = '' + newColony;
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