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
    const {owner, edges, vertexes, dependEdges} = this.#raw;
    for(const edge of owner.skeleton.getAllEdges()) {
      if(edge.selected || (edge.startVertex.selected && edge.endVertex.selected)) {
        edges.add(edge);
        vertexes.set(edge.startVertex, new paper.Point);
        vertexes.set(edge.endVertex, new paper.Point);
      }
      else if(edge.startVertex.selected) {
        vertexes.set(edge.startVertex, new paper.Point);
        dependEdges.add(edge);
      }
      else if(edge.endVertex.selected) {
        vertexes.set(edge.endVertex, new paper.Point);
        dependEdges.add(edge);
      }      
    }
    if(interactive) {
      this.#raw.initialCarcass = owner.project.props.carcass; 
      owner.project.props.carcass = true;
    }
  }

  /**
   * @summary При завершении или отмене сдвига
   */
  cancelMovePoints() {
    const {owner, edges, vertexes, dependEdges, initialCarcass} = this.#raw;
    edges.clear();
    dependEdges.clear();
    vertexes.clear();
    owner.project.props.carcass = initialCarcass;
  }

  /**
   * @summary Корректирует delta допустимой величиной сдвига для каждого узла
   * @param {paper.Point} start
   * @param {paper.Point} delta
   * @param {Boolean} [interactive]
   */
  tryMovePoints(start, delta, interactive) {
    for(const [vertex] of this.#raw.vertexes) {
      this.#raw.vertexes.set(vertex, delta);
    }
  }
  
  applyMovePoints() {
    let moved;
    for(const [vertex, delta] of this.#raw.vertexes) {
      if(delta?.length) {
        moved = true;
        vertex.point = vertex.point.add(delta);
      }
    }
    
    this.cancelMovePoints();
    return moved;
  }
}
