
export class Mover {

  #raw = {};
  
  constructor(owner) {
    this.#raw.owner = owner;
  }
  
  prepareMovePoints() {
    if(!this.#raw.edges) {
      this.#raw.edges = this.#raw.owner.skeleton
        .getAllEdges()
        .filter((edge) => edge.selected || edge.startVertex.selected || edge.endVertex.selected);
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
    const {delta} = this.#raw;
    if(delta?.length) {
      for(const edge of this.#raw.edges) {
        const {selected, profile, startVertex, endVertex} = edge;
        // if(selected && !profile.isLinear()) {
        //  
        // }
        if (selected || startVertex.selected) {
          const {b} = profile; 
          b.point = b.point.add(delta);
        }
        if (selected || endVertex.selected) {
          const {e} = edge.profile;
          e.point = e.point.add(delta);
        }
      }  
    }
    
    for(const profile of this.#raw.owner.profiles) {
      profile.opacity = 1;
    }
    this.#raw.edges = null;
    this.#raw.delta = null;
  }
}
