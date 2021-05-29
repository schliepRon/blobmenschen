import Blobmensch from "./Blobmensch.js"

const byId = id => document.getElementById(id)

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

const blobs = [];
const history = [];


const startSim = (id) => {
    const byId = id => document.getElementById(id)
    const WIDTH = 700

    window.infectionRate = byId("infectionRate").value;
    window.percentDistancing = byId("percentDistancing").value;
    window.powerDistancing = byId("powerDistancing").value;
    window.mortality = byId("mortality").value;
    window.infectionDistance = byId("infectionDistance").value;
    window.blobCount = byId("blobCount").value;
    window.travelChance = byId("travelChance").value;

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
    console.log("travelChance: ");
    console.log(travelChance);

    const render = (blobs) => {
        const canvas = byId(id)
        const ctx = canvas.getContext("2d")

        ctx.fillStyle = "#ffffff"
        ctx.fillRect(-1, -1, WIDTH + 2, WIDTH + 2)

        for (const blob of blobs) {
            blob.draw(ctx)
        }
    }

    let t0 = null

    const step = (t) => {
        if (!t0) {
            t0 = t
            blobs[0].state = "infected"
            blobs[0].infectedAt = t
            blobs[0].distincing = false
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

    for (let i = 0; i < blobCount; i++) {
        const b = new Blobmensch(Math.random() * (WIDTH - 100) + 50, Math.random() * (WIDTH - 100) + 50, id)
        blobs.push(b)
    }

    window.requestAnimationFrame(step)
}

const startSimEmpty = (id) => {
    const WIDTH = 700

    window.infectionRate = byId("infectionRate").value;
    window.percentDistancing = byId("percentDistancing").value;
    window.powerDistancing = byId("powerDistancing").value;
    window.mortality = byId("mortality").value;
    window.infectionDistance = byId("infectionDistance").value;
    window.blobCount = byId("blobCount").value;
    window.travelChance = byId("travelChance").value;

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
    console.log("travelChance: ");
    console.log(travelChance);

    const render = (blobs) => {
        const canvas = byId(id)
        const ctx = canvas.getContext("2d")

        ctx.fillStyle = "#dddddd"
        ctx.fillRect(-1, -1, WIDTH + 2, WIDTH + 2)

        for (const blob of blobs) {
            blob.draw(ctx)
        }
    }

    let t0 = null

    const step = (t) => {
        if (!t0) {
            t0 = t
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

    window.requestAnimationFrame(step)
}

const startPlot = (t) => {

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
        "Colony 1 -- Normal: " + colony2.filter(b => b.state == "normal").length
        + " | Infected: " + colony2.filter(b => b.state == "infected").length
        + " | Recovered: " + colony2.filter(b => b.state == "removed").length
        + " | Dead: " + colony2.filter(b => b.state == "dead").length
        + " | Count: " + colony2.length;

    element = document.getElementById("stats_3");
    element.innerHTML =
        "Colony 1 -- Normal: " + colony3.filter(b => b.state == "normal").length
        + " | Infected: " + colony3.filter(b => b.state == "infected").length
        + " | Recovered: " + colony3.filter(b => b.state == "removed").length
        + " | Dead: " + colony3.filter(b => b.state == "dead").length
        + " | Count: " + colony3.length;


    history.push([
        blobs.filter(b => b.state == "normal").length,
        blobs.filter(b => b.state == "infected").length,
        blobs.filter(b => b.state == "removed").length,
        blobs.filter(b => b.state == "dead").length])
    console.log("Da mal ich max hin" + history.length)

    element = document.getElementById("plotter")
    var context = element.getContext("2d")
    context.fillStyle = "#000000"
    context.beginPath()
    context.moveTo(0, history[0][0] / blobs.length * element.height)
    for (let datasir of history) {
        context.lineTo( datasir.index, datasir[0] / blobs.length * element.height)
        context.moveTo(datasir.index, datasir[0] / blobs.length * element.height)
    }
    context.stroke()
    context.fillStyle = "#7a0f00"
    context.beginPath()
    context.moveTo(0, history[0][1] / blobs.length * element.height)
    for (let datasir of history) {
        context.lineTo( datasir.index, datasir[1] / blobs.length * element.height)
        context.moveTo(datasir.index, datasir[1] / blobs.length * element.height)
    }
    context.stroke()
    context.beginPath()
    context.fillStyle = "#06a"
    context.moveTo(0, history[0][2] / blobs.length * element.height)
    for (let datasir of history) {
        context.lineTo( datasir.index, datasir[2] / blobs.length * element.height)
        context.moveTo(datasir.index, datasir[2] / blobs.length * element.height)
    }
    context.stroke()
    context.beginPath()
    context.fillStyle = "#f1a"
    context.moveTo(0, history[0][3] / blobs.length * element.height)
    for (let datasir of history) {
        context.lineTo( datasir.index, datasir[3] / blobs.length * element.height)
        context.moveTo(datasir.index, datasir[3] / blobs.length * element.height)
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
window.startPlot = startPlot;