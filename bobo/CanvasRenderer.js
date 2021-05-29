class CanvasRenderer {
  constructor({elRef, width, height, bgcolor}) {
    const el = elRef || document.createElement("canvas")
    this.width = width
    this.height = height
    this.bgcolor = bgcolor
    el.width = width
    el.height = height 
    this.domElement = el
    this.ctx = el.getContext("2d")
  }

  clear() {
    this.ctx.fillStyle = this.bgcolor
    this.ctx.fillRect(-1, -1, this.width + 2, this.height + 2)
  }

  render(blobs) {
    this.clear()

    for (const blob of blobs) {
      this.ctx.fillStyle = blob.state === "normal" ? "#0000aa" : (blob.state === "infected" ? "#990000" : (blob.state === "dead" ? "#000000" : "#009900"))
      this.ctx.beginPath()
      this.ctx.arc(blob.r.x, blob.r.y, 5, 0, 2 * Math.PI)
      this.ctx.fill()
    }
  }

  onStateChange(blob) {
    // nichts zu tun
  }

  gameLoop(t) {
    if (t) {
      const blobsToDraw = this.step(t, this);
      this.render(blobsToDraw);
    }
    window.requestAnimationFrame((t) => this.gameLoop(t))
  }

  run(stepFn) {
    this.step = stepFn
    this.gameLoop();
  }
}

export default CanvasRenderer
