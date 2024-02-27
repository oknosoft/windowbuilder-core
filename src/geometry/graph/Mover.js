import paper from 'paper/dist/paper-core';

export class Mover {

  #raw = {};
  
  constructor(owner) {
    Object.assign(this.#raw, {
      owner,
      vertexes: new Map(),
    });
  }
  
  addRecursive(vertex, edge, level) {
    const {owner, vertexes} = this.#raw;
    if(!vertexes.has(vertex)) {
      vertexes.set(vertex, {level, point: vertex.point.clone()});
    }
    const {other, profileOther} = edge.other(vertex);
    if(!other.selected && !vertexes.has(other)) {
      for(const otherEdge of other.getEdges()) {
        if(otherEdge.profile !== edge.profile) {
          this.addRecursive(other, otherEdge, level + 1);
        }
      }
    }
    if(profileOther && !profileOther.selected) {
      vertexes.get(vertex).base = profileOther.point.clone();
    }
  }

  /**
   * @summary Запоминает выделенные узлы и рёбра перед началом сдвига
   * @param {Boolean} [interactive]
   */
  prepareMovePoints(interactive) {
    const {owner, vertexes} = this.#raw;
    for(const edge of owner.skeleton.getAllEdges()) {
      if(edge.selected || (edge.startVertex.selected && edge.endVertex.selected)) {
        this.addRecursive(edge.startVertex, edge, 0);
        this.addRecursive(edge.endVertex, edge, 0);
      }
      else if(edge.startVertex.selected) {
        this.addRecursive(edge.startVertex, edge, 0);
      }
      else if(edge.endVertex.selected) {
        this.addRecursive(edge.endVertex, edge, 0);
      }      
    }
    // при интерактивных сдвигах, прячем линии профилей
    if(interactive) {
      this.#raw.initialCarcass = owner.project.props.carcass; 
      owner.project.props.carcass = true;
    }
  }

  /**
   * @summary При завершении или отмене сдвига
   */
  cancelMovePoints() {
    const {owner, vertexes, initialCarcass} = this.#raw;
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
    // извлекаем разрешенные диапазоны из шаблона
    let li = 200;
    let lmin = 200;
    let lmax = 2000;
    
    for(const [vertex, move] of this.#raw.vertexes) {
      if(!move.startPoint) {
        move.startPoint = move.point;
      }
      const test = move.startPoint.add(delta);
      // если это узел нулевого уровня
      if(move.level === 0) {
        if(vertex.isT) {
          // узел импоста не должен покидать родительский профиль и приближаться к углам ближе li
          
        }
        else {
          // узел угла не должен порождать длины < lmin и > lmax
          
        }
        
        move.point = move.startPoint.add(delta);
      }
    }
  }
  
  applyMovePoints() {
    let moved;
    for(const [vertex, move] of this.#raw.vertexes) {
      if(!vertex.point.isNearest(move.point)) {
        moved = true;
        vertex.point = move.point;
      }
    }    
    this.cancelMovePoints();
    return moved;
  }
}
