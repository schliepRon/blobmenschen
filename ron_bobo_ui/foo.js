import Blobmensch from "./Blobmensch.js"
import Params from "./Params.js"
import StatUI from "./StatUI.js"
import CanvasRenderer from "./CanvasRenderer.js"
import ThreejsRenderer from "./TheejsRenderer.js"
import { byId, getRandomInt } from "./util.js"


const TOTAL_HEIGHT = window.innerHeight - 150
const TOTAL_WIDTH = window.innerWidth - 400
byId("container").style.height = "" + TOTAL_HEIGHT + "px"
byId("container").style.width = "" + TOTAL_WIDTH + "px"


const sims = {
  "einfach": [
    {
      name: "1",
      size: 700,
      x: 0,
      y: 0,
      empty: false,
      bgcolor: "#ffffff"
    }
  ],
  "komplex": [
   {
      name: "1",
      size: 500,
      x: 0,
      y: 0,
      empty: false,
      bgcolor: "#ffffff"
    }, {
      name: "2",
      size: 500,
      x: 550,
      y: 0,
      empty: false,
      bgcolor: "#ffffff"
    }, {
      name: "3",
      size: 120,
      x: 1100,
      y: 300,
      empty: true,
      bgcolor: "#cccccc"
    } 
  ]
}
let blobs = [];

let renderer = null


byId("toggleView").onclick = () => {
  if (renderer) {
    renderer.toggleView()
  }
}

const startSim = (elementId, config) => {
  const colonies = sims[config];

  const params = Params.fromSliders()

  blobs = [];

  const container = byId(elementId)

  if (renderer) {
    renderer.stop()
  }

  renderer = new ThreejsRenderer({
    colonies: colonies,
    width: TOTAL_WIDTH,
    height: TOTAL_HEIGHT
  })

  while (container.firstChild) {
    container.removeChild(container.lastChild)
  }
  container.appendChild(renderer.domElement)

  const stepFns = []
  for (const colony of colonies) {
    const nblobs = colony.empty ? 0 : params.blobCount
    const colonyName = colony.name

    let t0 = null

    const step = (t, renderer) => {
      if (!t0) {
        t0 = t
        if (!colony.empty) {
          blobs[0].state = "infected"
          blobs[0].infectedAt = t
          blobs[0].distincing = false
          renderer.onStateChange(blobs[0])
        }
      }

      const dt = (t - t0)
      if (dt <= 0) {
        return []
      }
      t0 = t

      const myColonyBlobs = blobs.filter(e => e.currentColony == colonyName)

      for (const blob of myColonyBlobs) {
        blob.step(t, 20, myColonyBlobs, renderer)
      }

      return myColonyBlobs
    }
    stepFns.push(step);

    for (let i = 0; i < nblobs; i++) {
      const b = new Blobmensch(getRandomInt(50, colony.size - 50), getRandomInt(50, colony.size - 50), colonyName, params, colonies, i)
      blobs.push(b)
    }
  }

  renderer.init(blobs)

  const combinedStepFn = (t, renderer) => [].concat(...stepFns.map(f => f(t, renderer)))

  renderer.run(combinedStepFn);
}


const startPlot = () => {
    const WIDTH = 700
}

let t0 = null
const history = [];

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
