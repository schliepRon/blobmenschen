import {worldBounds} from "./util.js"

class CanvasRenderer {
  constructor({elRef, colonies, width, height}) {
    const el = elRef || document.createElement("canvas")
    this.colonies = colonies;
    this.bounds = worldBounds(colonies);
    this.width = width
    this.height = height
    el.width = width
    el.height = height 
    this.domElement = el
    this.ctx = el.getContext("2d")

    this.offsetx = {}
    this.offsety = {}
    for (const colony of colonies) {
      this.offsetx[colony.name] = colony.x
      this.offsety[colony.name] = colony.y
    }
    this.stopped = false
  }

  init(blobs) {

  }

  clear() {
    for (const colony of this.colonies) {
      this.ctx.fillStyle = colony.bgcolor
      this.ctx.fillRect(colony.x - 1, colony.y - 1, colony.size + 2, colony.size + 2)
    }
  }

  render(blobs) {
    this.clear()

    for (const blob of blobs) {
      this.ctx.fillStyle = blob.state === "normal" ? "#0000aa" : (blob.state === "infected" ? "#990000" : (blob.state === "dead" ? "#000000" : "#009900"))
      const x0 = this.offsetx[blob.currentColony]
      const y0 = this.offsety[blob.currentColony]
      this.ctx.beginPath()
      this.ctx.arc(x0 + blob.r.x, y0 + blob.r.y, 5, 0, 2 * Math.PI)
      this.ctx.fill()
    }
  }

  onStateChange(blob) {
    // nichts zu tun
  }

  toggleView() {
    // nichts zu tun
  }

  gameLoop(t) {
    if (t) {
      const blobsToDraw = this.step(t, this);
      this.render(blobsToDraw);
    }
    if (!this.stopped)
      window.requestAnimationFrame((t) => this.gameLoop(t))
  }

  run(stepFn) {
    this.step = stepFn
    this.gameLoop();
  }

  stop() {
    this.ctx.clearRect(-1, -1, this.width + 2, this.height + 2)
    this.stopped = true;
  }
}

export default CanvasRenderer
