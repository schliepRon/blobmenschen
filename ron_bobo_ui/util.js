
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const eingrenzen = (min, max, x) => {
  return Math.min(max, Math.max(min, x))
}

export const byId = id => document.getElementById(id)

export const worldBounds = (colonies) => {
  const xmin = Math.min(...colonies.map(c => c.x))
  const xmax = Math.max(...colonies.map(c => c.x + c.size))
  const ymin = Math.min(...colonies.map(c => c.y))
  const ymax = Math.max(...colonies.map(c => c.y + c.size))
  return [xmin, xmax, ymin, ymax]
}