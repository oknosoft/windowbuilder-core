
export class Mover {

  #raw = {};
  
  constructor(owner) {
    this.#raw.owner = owner;
  }
  
  prepareMovePoints() {
    if(!this.#raw.edges) {
      this.#raw.edges = this.#raw.owner.skeleton.getAllEdges();
    }
  }

  tryMovePoints(delta, interactive) {
    if(interactive) {
      this.prepareMovePoints();
      for(const profile of this.#raw.owner.profiles) {
        profile.opacity = 0.3;
      }
    }
    this.#raw.delta = delta;
  }
  
  applyMovePoints() {

    for(const profile of this.#raw.owner.profiles) {
      profile.opacity = 1;
    }
    this.#raw.edges = null;
    this.#raw.delta = null;
  }
}
