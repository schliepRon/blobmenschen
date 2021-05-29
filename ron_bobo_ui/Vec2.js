class Vec2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  static fromPolar(r, phi) {
    const x = r * Math.cos(phi)
    const y = r * Math.sin(phi)
    return new Vec2(x, y)
  }

  distance(that) {
    const dx = this.x - that.x
    const dy = this.y - that.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  smul(n) {
    return new Vec2(n * this.x, n * this.y)
  }

  dot(that) {
    return new Vec2(this.x * that.x, this.y * that.y)
  }

  sadd(n) {
    return new Vec2(this.x + n, this.y + n)
  }

  add(that) {
    return new Vec2(this.x + that.x, this.y + that.y)
  }

  zero() {
    return this.x == 0 && this.y == 0
  }

  limit(max) {
    const m = this.distance(new Vec2(0, 0))
    return this.smul(Math.min(1.0, max / m))
  }

  pointAwayFrom(that) {
    const dx = this.x - that.x
    const dy = this.y - that.y
    const r = Math.sqrt(dx * dx + dy * dy)
    return new Vec2(dx / r, dy / r)
  }

  abs() {
    const dx = this.x
    const dy = this.y
    const r = Math.sqrt(dx * dx + dy * dy)
    return r
  }
}

export default Vec2;
