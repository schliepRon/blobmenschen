import Blobmensch from "./Blobmensch.js"

const eingrenzen = (min, max, x) => {
  return Math.min(max, Math.max(min, x))
}

// generiert 2 normalverteile zufallszahlen
const box_muller = () => {
    const u1 = Math.random()
    const u2 = Math.random()

    const z1 = Math.sqrt(-2. * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    const z2 = Math.sqrt(-2. * Math.log(u1)) * Math.sin(2 * Math.PI * u2)

    return [z1, z2]
}

const startSim = () => {
    const byId = id => document.getElementById(id)
    const WIDTH = 700

    window.infectionRate = byId("infectionRate").value;
    window.percentDistancing = byId("percentDistancing").value;
    window.powerDistancing = byId("powerDistancing").value;
    window.mortality = byId("mortality").value;
    window.infectionDistance = byId("infectionDistance").value;
    window.blobCount = byId("blobCount").value;

    console.log("blobCount: ");
    console.log(blobCount);
    console.log("infectionRate: ");
    console.log(infectionRate);
    console.log("infectionDistance: ");
    console.log(infectionDistance);
    console.log("percentDistancing: ");
    console.log(percentDistancing);
    console.log("powerDistancing: ");
    console.log(powerDistancing);
    console.log("mortality: ");
    console.log(mortality);



    const render = (blobs) => {
      const canvas = byId("c")
      const ctx = canvas.getContext("2d")

      ctx.fillStyle = "#ffffff"
      ctx.fillRect(-1, -1, WIDTH + 2, WIDTH + 2)

      for (const blob of blobs) {
        blob.draw(ctx)
      }
    }

    let t0 = null

    const step = (t) => {
      if (!t0) t0 = t

      const dt = 0.9 * (t - t0)
      if (dt <= 0) {
        window.requestAnimationFrame(step)
        return
      }
      t0 = t

      for (const blob of blobs) {
        blob.step(t, 20, blobs)
      }

      render(blobs)

      window.requestAnimationFrame(step)
    }

    const blobs = []
    for (let i = 0; i < blobCount; i++) {
      const b = new Blobmensch(Math.random() * (WIDTH - 100) + 50, Math.random() * (WIDTH - 100) + 50)
      blobs.push(b)
    }


    blobs[0].state = "infected"
    blobs[0].infectedAt = (new Date()).getTime()
    blobs[0].distincing = false

    window.requestAnimationFrame(step)
}

const startPlot = () => {

}

window.startSim = startSim;