import {byId} from "./util.js"

class Params {
  constructor() {
    this.infectionRate = 80;
    this.infectionDistance = 20;
    this.percentDistancing = 50;
    this.powerDistancing = 50;
    this.mortality = 10;
    this.blobCount = 100;
    this.travelChance = 10;
    this.sicknessDuration = 15;
  }

  static fromSliders() {
    const p = new Params();

    p.infectionRate = byId("infectionRate").value;
    p.percentDistancing = byId("percentDistancing").value;
    p.powerDistancing = byId("powerDistancing").value;
    p.mortality = byId("mortality").value;
    p.infectionDistance = byId("infectionDistance").value;
    p.blobCount = byId("blobCount").value;
    p.travelChance = byId("travelChance").value;
    p.sicknessDuration = byId("sicknessDuration").value;

    return p;
  }

  logValues() {
    console.log("blobCount: ", this.blobCount);
    console.log("infectionRate: ", this.infectionRate);
    console.log("infectionDistance: ", this.infectionDistance);
    console.log("percentDistancing: ", this.percentDistancing);
    console.log("powerDistancing: ", this.powerDistancing);
    console.log("mortality: ", this.mortality);
    console.log("travelChance: ", this.travelChance);
    console.log("sicknessDuraion: ", this.sicknessDuration);
  }
}

export default Params;
