import paper from 'paper/dist/paper-core';

export class Mover {

  #raw = {};
  
  constructor(owner) {
    Object.assign(this.#raw, {
      owner,
      edges: new Set(),
      dependEdges: new Set(),
      vertexes: new Map(),
    });
  }

  /**
   * @summary Запоминает выделенные узлы перед началом сдвига
   * @param {Boolean} [interactive]
   */
  prepareMovePoints(interactive) {
    for(const edge of this.#raw.owner.skeleton.getAllEdges()) {
      if(edge.selected || (edge.startVertex.selected && edge.endVertex.selected)) {
        this.#raw.edges.add(edge);
        this.#raw.vertexes.set(edge.startVertex, new paper.Point);
        this.#raw.vertexes.set(edge.endVertex, new paper.Point);
      }
      else if(edge.startVertex.selected) {
        this.#raw.vertexes.set(edge.startVertex, new paper.Point);
        this.#raw.dependEdges.add(edge);
      }
      else if(edge.endVertex.selected) {
        this.#raw.vertexes.set(edge.endVertex, new paper.Point);
        this.#raw.dependEdges.add(edge);
      }      
    }
    if(this.#raw.vertexes.size && interactive) {
      for(const profile of this.#raw.owner.profiles) {
        profile.opacity = 0.3;
      }
    }
  }

  /**
   * @summary При завершении или отмене сдвига
   */
  cancelMovePoints() {
    this.#raw.edges.clear();
    this.#raw.dependEdges.clear();
    this.#raw.vertexes.clear();
    for(const profile of this.#raw.owner.profiles) {
      profile.opacity = 1;
    }
  }

  /**
   * @summary Корректирует delta допустимой величиной сдвига для каждого узла
   * @param {paper.Point} delta
   * @param {Boolean} [interactive]
   */
  tryMovePoints(delta, interactive) {
    for(const [vertex] of this.#raw.vertexes) {
      this.#raw.vertexes.set(vertex, delta);
    }
  }
  
  applyMovePoints() {
    for(const [vertex, delta] of this.#raw.vertexes) {
      if(delta?.length) {
        vertex.point = vertex.point.add(delta);
      }
    }
    
    this.cancelMovePoints();
  }
}
