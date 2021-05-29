import Blobmensch from "./Blobmensch.js"
import Params from "./Params.js"
import StatUI from "./StatUI.js"
import CanvasRenderer from "./CanvasRenderer.js"
import { byId } from "./util.js"


const blobs = [];
const history = [];

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

const startSimEmpty = (config) => startSim(config, true, "#ffffff")

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

    history.push([
        blobs.filter(b => b.state == "normal").length,
        blobs.filter(b => b.state == "infected").length,
        blobs.filter(b => b.state == "removed").length,
        blobs.filter(b => b.state == "dead").length])


    var element = document.getElementById("plot_1")
    var context = element.getContext("2d")
    context.clearRect(0, 0, element.width, element.height);
    context.strokeStyle = "#000000"
    context.beginPath()
    context.moveTo(0, history[0][0] / blobs.length * element.height)
    for (let datasir of history.filter(b => b.currentColony == '1')) {
        context.lineTo( history.indexOf(datasir), datasir[0] / blobs.length * element.height)
        context.moveTo(history.indexOf(datasir), datasir[0] / blobs.length * element.height)
    }
    context.stroke()
    context.strokeStyle = "#7a0f00"
    context.beginPath()
    context.moveTo(0, history[0][1] / blobs.length * element.height)
    for (let datasir of history.filter(b => b.currentColony == '1')) {
        context.lineTo( history.indexOf(datasir), datasir[1] / blobs.length * element.height)
        context.moveTo(history.indexOf(datasir), datasir[1] / blobs.length * element.height)
    }
    context.stroke()
    context.beginPath()
    context.strokeStyle = "#06a"
    context.moveTo(0, history[0][2] / blobs.length * element.height)
    for (let datasir of history.filter(b => b.currentColony == '1')) {
        context.lineTo( history.indexOf(datasir), datasir[2] / blobs.length * element.height)
        context.moveTo(history.indexOf(datasir), datasir[2] / blobs.length * element.height)
    }
    context.stroke()
    context.beginPath()
    context.strokeStyle = "#f1a"
    context.moveTo(0, history[0][3] / blobs.length * element.height)
    for (let datasir of history.filter(b => b.currentColony == '1')) {
        context.lineTo( history.indexOf(datasir), datasir[3] / blobs.length * element.height)
        context.moveTo(history.indexOf(datasir), datasir[3] / blobs.length * element.height)
    }
    context.stroke()




     var element = document.getElementById("plot_2")

    context.clearRect(0, 0, element.width, element.height);
        var context = element.getContext("2d")
        context.strokeStyle = "#000000"
        context.beginPath()
        context.moveTo(0, history[0][0] / blobs.length * element.height)
        for (let datasir of history.filter(b => b.currentColony == '2')) {
            context.lineTo( history.indexOf(datasir), datasir[0] / blobs.length * element.height)
            context.moveTo(history.indexOf(datasir), datasir[0] / blobs.length * element.height)
        }
        context.stroke()
        context.strokeStyle = "#7a0f00"
        context.beginPath()
        context.moveTo(0, history[0][1] / blobs.length * element.height)
        for (let datasir of history.filter(b => b.currentColony == '2')) {
            context.lineTo( history.indexOf(datasir), datasir[1] / blobs.length * element.height)
            context.moveTo(history.indexOf(datasir), datasir[1] / blobs.length * element.height)
        }
        context.stroke()
        context.beginPath()
        context.strokeStyle = "#06a"
        context.moveTo(0, history[0][2] / blobs.length * element.height)
        for (let datasir of history.filter(b => b.currentColony == '2')) {
            context.lineTo( history.indexOf(datasir), datasir[2] / blobs.length * element.height)
            context.moveTo(history.indexOf(datasir), datasir[2] / blobs.length * element.height)
        }
        context.stroke()
        context.beginPath()
        context.strokeStyle = "#f1a"
        context.moveTo(0, history[0][3] / blobs.length * element.height)
        for (let datasir of history.filter(b => b.currentColony == '2')) {
            context.lineTo( history.indexOf(datasir), datasir[3] / blobs.length * element.height)
            context.moveTo(history.indexOf(datasir), datasir[3] / blobs.length * element.height)
        }
        context.stroke()



            var element = document.getElementById("plot_3")
            var context = element.getContext("2d")
            context.clearRect(0, 0, element.width, element.height);
            context.strokeStyle = "#000000"
            context.beginPath()
            context.moveTo(0, history[0][0] / blobs.length * element.height)
            for (let datasir of history.filter(b => b.currentColony == '3')) {
                context.lineTo( history.indexOf(datasir), datasir[0] / blobs.length * element.height)
                context.moveTo(history.indexOf(datasir), datasir[0] / blobs.length * element.height)
            }
            context.stroke()
            context.strokeStyle = "#7a0f00"
            context.beginPath()
            context.moveTo(0, history[0][1] / blobs.length * element.height)
            for (let datasir of history.filter(b => b.currentColony == '3')) {
                context.lineTo( history.indexOf(datasir), datasir[1] / blobs.length * element.height)
                context.moveTo(history.indexOf(datasir), datasir[1] / blobs.length * element.height)
            }
            context.stroke()
            context.beginPath()
            context.strokeStyle = "#06a"
            context.moveTo(0, history[0][2] / blobs.length * element.height)
            for (let datasir of history.filter(b => b.currentColony == '3')) {
                context.lineTo( history.indexOf(datasir), datasir[2] / blobs.length * element.height)
                context.moveTo(history.indexOf(datasir), datasir[2] / blobs.length * element.height)
            }
            context.stroke()
            context.beginPath()
            context.strokeStyle = "#f1a"
            context.moveTo(0, history[0][3] / blobs.length * element.height)
            for (let datasir of history.filter(b => b.currentColony == '3')) {
                context.lineTo( history.indexOf(datasir), datasir[3] / blobs.length * element.height)
                context.moveTo(history.indexOf(datasir), datasir[3] / blobs.length * element.height)
            }
            context.stroke()

    while(history.length > element.width) {
        history.shift()
    }



  window.requestAnimationFrame(statistics)
}

window.requestAnimationFrame(statistics)

window.startSim = startSim;
window.startSimEmpty = startSimEmpty;
