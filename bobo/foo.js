import Blobmensch from "./Blobmensch.js"
import Params from "./Params.js"
import { byId } from "./util.js"


const blobs = [];

const startSim = (id) => {
    const WIDTH = 700

    const params = Params.fromSliders()
    params.width = WIDTH;
    params.logValues()


    const render = (blobs) => {
      const canvas = byId(id)
      const ctx = canvas.getContext("2d")

      ctx.fillStyle = "#ffffff"
      ctx.fillRect(-1, -1, params.width + 2, params.width + 2)

      for (const blob of blobs) {
        blob.draw(ctx)
      }
    }

    let t0 = null

    const step = (t) => {
      if (!t0) {
        t0 = t
        blobs[0].state = "infected"
        blobs[0].infectedAt = t
        blobs[0].distincing = false
      }

      const dt = 0.9 * (t - t0)
      if (dt <= 0) {
        window.requestAnimationFrame(step)
        return
      }
      t0 = t

      const myColonyBlobs = blobs.filter(e => e.currentColony == id)

      for (const blob of myColonyBlobs) {
        blob.step(t, 20, myColonyBlobs)
      }

      render(myColonyBlobs)

      window.requestAnimationFrame(step)
    }

    for (let i = 0; i < params.blobCount; i++) {
      const b = new Blobmensch(Math.random() * (params.width - 100) + 50, Math.random() * (params.width - 100) + 50, id, params)
      blobs.push(b)
    }

    window.requestAnimationFrame(step)
}

const startSimEmpty = (id) => {
    const byId = id => document.getElementById(id)
    const WIDTH = 700

    const params = Params.fromSliders()
    params.width = WIDTH
    params.logValues()

    const render = (blobs) => {
      const canvas = byId(id)
      const ctx = canvas.getContext("2d")

      ctx.fillStyle = "#dddddd"
      ctx.fillRect(-1, -1, params.width + 2, params.width + 2)

      for (const blob of blobs) {
        blob.draw(ctx)
      }
    }

    let t0 = null

    const step = (t) => {
      if (!t0) {
        t0 = t
      }

      const dt = 0.9 * (t - t0)
      if (dt <= 0) {
        window.requestAnimationFrame(step)
        return
      }
      t0 = t

      const myColonyBlobs = blobs.filter(e => e.currentColony == id)

      for (const blob of myColonyBlobs) {
        blob.step(t, 20, myColonyBlobs)
      }

      render(myColonyBlobs)

      window.requestAnimationFrame(step)
    }

    window.requestAnimationFrame(step)
}

const startPlot = () => {
    const WIDTH = 700
}

let t0 = null

const statistics = (t) => {
  if (!t0) {
    t0 = t
  }

  const dt = 0.9 * (t - t0)
  if (dt <= 0) {
    window.requestAnimationFrame(statistics)
    return
  }
  t0 = t

  const colony1 = blobs.filter(b => b.currentColony == '1');
  const colony2 = blobs.filter(b => b.currentColony == '2');
  const colony3 = blobs.filter(b => b.currentColony == '3');

   var element = document.getElementById("stats_1");
   element.innerHTML =
   "Colony 1 -- Normal: " + colony1.filter(b => b.state == "normal").length
   + " | Infected: " + colony1.filter(b => b.state == "infected").length
   + " | Recovered: " + colony1.filter(b => b.state == "removed").length
   + " | Dead: " + colony1.filter(b => b.state == "dead").length
   + " | Count: " + colony1.length;

   element = document.getElementById("stats_2");
      element.innerHTML =
      "Colony 1 -- Normal: " + colony2.filter(b => b.state == "normal").length
      + " | Infected: " + colony2.filter(b => b.state == "infected").length
      + " | Recovered: " + colony2.filter(b => b.state == "removed").length
      + " | Dead: " + colony2.filter(b => b.state == "dead").length
      + " | Count: " + colony2.length;

      element = document.getElementById("stats_3");
         element.innerHTML =
         "Colony 1 -- Normal: " + colony3.filter(b => b.state == "normal").length
         + " | Infected: " + colony3.filter(b => b.state == "infected").length
         + " | Recovered: " + colony3.filter(b => b.state == "removed").length
         + " | Dead: " + colony3.filter(b => b.state == "dead").length
         + " | Count: " + colony3.length;

  window.requestAnimationFrame(statistics)
}

window.requestAnimationFrame(statistics)

window.startSim = startSim;
window.startSimEmpty = startSimEmpty;
