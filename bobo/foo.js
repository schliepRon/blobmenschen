import Blobmensch from "./Blobmensch.js"
import Params from "./Params.js"
import CanvasRenderer from "./CanvasRenderer.js"
import { byId } from "./util.js"


const blobs = [];

const startSim = (config, empty = false, color = "#ffffff") => {
  console.log(config);
  var id = config['id'];

  const params = Params.fromSliders()
  params.width = config['size'];
  
  if (empty) {
    params.blobCount = 0;
  }

  if(window.colony == null) {
    window.colony = [];
  }

  window.colony[id] = config;
  
  params.logValues()

  const renderer = new CanvasRenderer({
    elRef: byId(id),
    width: params.width,
    height: params.width,
    bgcolor: color
  })

  let t0 = null

  const step = (t, renderer) => {
    if (!t0) {
      t0 = t
      if (!empty) {
        blobs[0].state = "infected"
        blobs[0].infectedAt = t
        blobs[0].distincing = false
      }
    }

    const dt = (t - t0)
    if (dt <= 0) {
      return []
    }
    t0 = t

    const myColonyBlobs = blobs.filter(e => e.currentColony == id)

    for (const blob of myColonyBlobs) {
      blob.step(t, 20, myColonyBlobs, renderer)
    }

    return myColonyBlobs
  }

  for (let i = 0; i < params.blobCount; i++) {
    const b = new Blobmensch(Math.random() * (params.width - 100) + 50, Math.random() * (params.width - 100) + 50, id, params)
    blobs.push(b)
  }

  renderer.run(step);
}

const startSimEmpty = (config) => startSim(config, true, "#cccccc")

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
   "Colony 2 -- Normal: " + colony2.filter(b => b.state == "normal").length
   + " | Infected: " + colony2.filter(b => b.state == "infected").length
   + " | Recovered: " + colony2.filter(b => b.state == "removed").length
   + " | Dead: " + colony2.filter(b => b.state == "dead").length
   + " | Count: " + colony2.length;

   element = document.getElementById("stats_3");
   element.innerHTML =
   "Colony 3 -- Normal: " + colony3.filter(b => b.state == "normal").length
   + " | Infected: " + colony3.filter(b => b.state == "infected").length
   + " | Recovered: " + colony3.filter(b => b.state == "removed").length
   + " | Dead: " + colony3.filter(b => b.state == "dead").length
   + " | Count: " + colony3.length;

  window.requestAnimationFrame(statistics)
}

window.requestAnimationFrame(statistics)

window.startSim = startSim;
window.startSimEmpty = startSimEmpty;
