import Blobmensch from "./Blobmensch.js"
import Params from "./Params.js"
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

  const colony1 = blobs.filter(b => b.currentColony == '1');
  const colony2 = blobs.filter(b => b.currentColony == '2');
  const colony3 = blobs.filter(b => b.currentColony == '3');

   var header1 = document.getElementById("1_header");
   var normal1 = document.getElementById("1_normal");
   var infected1 = document.getElementById("1_infected");
   var recovered1 = document.getElementById("1_recovered");
   var dead1 = document.getElementById("1_dead");
   var count1 = document.getElementById("1_count");
   header1.innerHTML =
   "Colony 1";
   normal1.innerHTML = colony1.filter(b => b.state == "normal").length;
   infected1.innerHTML = colony1.filter(b => b.state == "infected").length;
   recovered1.innerHTML = colony1.filter(b => b.state == "removed").length;
   dead1.innerHTML = colony1.filter(b => b.state == "dead").length;
   count1.innerHTML = colony1.length;

  var header2 = document.getElementById("2_header");
  var normal2 = document.getElementById("2_normal");
  var infected2 = document.getElementById("2_infected");
  var recovered2 = document.getElementById("2_recovered");
  var dead2 = document.getElementById("2_dead");
  var count2 = document.getElementById("2_count");
  header2.innerHTML =
  "Colony 2";
  normal2.innerHTML = colony2.filter(b => b.state == "normal").length;
  infected2.innerHTML = colony2.filter(b => b.state == "infected").length;
  recovered2.innerHTML = colony2.filter(b => b.state == "removed").length;
  dead2.innerHTML = colony2.filter(b => b.state == "dead").length;
  count2.innerHTML = colony2.length;

  var header3 = document.getElementById("3_header");
  var normal3 = document.getElementById("3_normal");
  var infected3 = document.getElementById("3_infected");
  var recovered3 = document.getElementById("3_recovered");
  var dead3 = document.getElementById("3_dead");
  var count3 = document.getElementById("3_count");
  header3.innerHTML =
  "Colony 3";
  normal3.innerHTML = colony3.filter(b => b.state == "normal").length;
  infected3.innerHTML = colony3.filter(b => b.state == "infected").length;
  recovered3.innerHTML =  colony3.filter(b => b.state == "removed").length;
  dead3.innerHTML = colony3.filter(b => b.state == "dead").length;
  count3.innerHTML = colony3.length;

  window.requestAnimationFrame(statistics)
}

window.requestAnimationFrame(statistics)

window.startSim = startSim;
window.startSimEmpty = startSimEmpty;