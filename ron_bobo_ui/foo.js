import Blobmensch from "./Blobmensch.js"
import Params from "./Params.js"
import StatUI from "./StatUI.js"
import { byId } from "./util.js"


const blobs = [];

const startSim = (id, empty = false, color = "#ffffff") => {
  const WIDTH = 700

  const params = Params.fromSliders()
  params.width = WIDTH;

  if (empty) {
    params.blobCount = 0;
  }

  params.logValues()


  const render = (blobs) => {
    const canvas = byId(id)
    const ctx = canvas.getContext("2d")

    ctx.fillStyle = color
    ctx.fillRect(-1, -1, params.width + 2, params.width + 2)

    for (const blob of blobs) {
      blob.draw(ctx)
    }
  }

  let t0 = null

  const step = (t) => {
    if (!t0) {
      t0 = t
      if (!empty) {
        blobs[0].state = "infected"
        blobs[0].infectedAt = t
        blobs[0].distincing = false
      }
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

const startSimEmpty = (id) => startSim(id, true, "#cccccc")

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

  const statUI = new StatUI();
  statUI.printStats(blobs);

  window.requestAnimationFrame(statistics)
}

window.requestAnimationFrame(statistics)

window.startSim = startSim;
window.startSimEmpty = startSimEmpty;